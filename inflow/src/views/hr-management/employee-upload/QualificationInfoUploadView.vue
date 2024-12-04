<template>
  <div class="emp-container">
    <CommonArticle label="자격증" class="ca" w="90%"></CommonArticle>

    <div class="tmp">
      <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx, .xls" style="display: none;" />
    </div>
    <div class="exlbtns1">
      <button type="button" @click="fileDownload">
        <img src="../../../assets/icons/excel_icon.png" />
        <p>양식 다운로드</p>
      </button>
      <button type="button" @click="clickInput">
        <img src="../../../assets/icons/excel_icon.png" />
        <p>양식 업로드</p>
      </button>
    </div>

    <div class="colboard">
      <div class="exlbtns2">
        <button type="button" @click="deleteSelectedRows">
          <img src="../../../assets/icons/minus_icon.png" />
          <p>선택 삭제</p>
        </button>
        <button type="button" @click="addRow">
          <img src="../../../assets/icons/plus_icon.png" />
          <p>행 추가</p>
        </button>
      </div>

      <div class="inboard">
        <div class="colname headers">
          <div class="chbox">
            <input type="checkbox" :id="chkHeader" v-model="chkHeader" @change="toggleAllCheckboxes" />
            <label :for="chkHeader"></label>
          </div>
          <div v-for="header in headerNames" :key="header">{{ header }}</div>
        </div>
        <div class="colname rows" v-for="(row, rowIndex) in rowsData" :key="rowIndex">
          <div class="chbox">
            <input type="checkbox" :id="'check' + rowIndex" v-model="selectedRows[rowIndex]" />
            <label :for="'check' + rowIndex"></label>
          </div>
          <div v-for="(value, header) in row" :key="header" class="cell-container">
            <input 
              type="text" 
              v-model="rowsData[rowIndex][header]" 
              :class="{ 'invalid-row': !isCellValid(rowsData[rowIndex][header], header) }"
              class="cell-input"
              @focus="showModal(rowIndex, header)"
              @blur="hideModal"/>
            <div v-if="visible && activeRow === rowIndex && activeHeader === header" class="modal">
              <pre>{{ modalTxt[header] }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="regist">
      <button type="button" class="rBtn" @click="postData">
        <p>등록</p>
      </button>
    </div>
  </div>
</template>


<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue'
import * as xlsx from "xlsx";
import { ref, onMounted } from "vue";
import { getDoc, saveData, getEmpId, getQualifications } from '@/api/emp_attach';

const headerNames = ref(["사번", "자격증명", "자격번호", "취득일", "발급기관", "등급 및 점수"]);
const defaultRow = Object.fromEntries(headerNames.value.map((key) => [key, null]));

const chkHeader = ref(false);
const selectedRows = ref([]);
const rowsData = ref([]);
const fileInput = ref(null);
const workbook = ref(null);
const validData = ref({});
const ids = ref({});
const qns = ref([]);
const loading = ref(true);

const validators = {
  사번: (value) => ids.value[value] !== undefined,
  자격번호: (value) => !qns.value?.includes(`${value}`),
  취득일: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
};

const isCellValid = (value, header) => {
  if (value === null || value === '') return false;
  if (header === '사번' && (loading.value || Object.keys(ids.value).length === 0)) return true;
  return validators[header] ? validators[header](value) : true;
};

const clickInput = () => {
  fileInput.value.click();
}

const getEmpIds = async() => {
  loading.value = true;
  const tmp1 = await getEmpId({'employee_number':rowsData.value.map(row => `${row['사번']}`)})
  const tmp2 = await getQualifications();
  tmp1.forEach((row) => {
    ids.value[row["employee_number"]] = row["employee_id"];
    ids.value[row["employee_id"]] = row["employee_number"];
  });
  qns.value = tmp2.map((row) => `${row["qualification_number"]}`);
  loading.value = false;
}

const visible = ref(false);
const activeRow = ref(null);
const activeHeader = ref(null);

const showModal = (rowIndex, header) => {
  if (modalTxt.value[header]  !== undefined) {
    visible.value = true;
    activeRow.value = rowIndex;
    activeHeader.value = header;
  }
};

const hideModal = () => {
  visible.value = false;
  activeRow.value = null;
  activeHeader.value = null;
};

const modalTxt = ref({
  사번: '유효한 사번을 입력하세요.',
  자격번호: '유효한 자격번호를 입력하세요.',
  취득일: '입력 예:\n- YYYY-MM-DD',
});

const handleFileUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const binaryStr = e.target.result;
    workbook.value = xlsx.read(binaryStr, { type: "binary" });
    addToRowsData();
  };
  reader.readAsBinaryString(file);
  event.target.value = "";
};

const addToRowsData = () => {
  workbook.value.SheetNames.forEach((sheetName) => {
    const sheet = workbook.value.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const [, ...rows] = data;

    rows.forEach((row) => {
      const rowObj = {};
      headerNames.value.forEach((key, index) => {
        rowObj[key] = row.slice(1)[index] || null;
      });
      rowsData.value.push(rowObj);
    });
  });
  removeDuplicateRows();
  getEmpIds();
  initializeSelectedRows();
};

const removeDuplicateRows = () => {
  const seen = new Set();
  rowsData.value = rowsData.value.filter((row) => {
    const rowString = JSON.stringify(row);
    if (seen.has(rowString)) {
      return false;
    }
    seen.add(rowString);
    return true;
  });
};

const initializeSelectedRows = () => {
  selectedRows.value = rowsData.value.map(() => false);
  chkHeader.value = false;
};

initializeSelectedRows();

const toggleAllCheckboxes = () => {
  selectedRows.value.fill(chkHeader.value);
};

const addRow = () => {
  rowsData.value.push({ ...defaultRow });
  initializeSelectedRows();
};

const deleteSelectedRows = () => {
  rowsData.value = rowsData.value.filter((_, index) => !selectedRows.value[index]);
  initializeSelectedRows();
};

const mapping = async () => {
  await getEmpIds();
  const result = ref([]);
  rowsData.value.map((row) => { 
    result.value.push({
      qualification_name: row["자격증명"],
      qualification_number: row["자격번호"],
      qualified_at: row["취득일"],
      issuer: row["발급기관"],
      grade_score: row["등급 및 점수"],
      employee_id: `${ids.value[row['사번']]}`,
    });
  });
  return result.value;
};

// Qualification Form 다운로드
const fileDownload = async () => {
  try {
    const fileUrl = await getDoc("qualification");
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "qualification_form.xlsx");
    link.click();
  } catch (error) {
    console.error("Qualification Form 다운로드 에러:", error.message);
  }
};
const postData = async () => {
  const invalidRows = rowsData.value.some((row) =>
    Object.entries(row).some(
      ([header, value]) => !isCellValid(value, header)
    )
  );

  if (invalidRows) {
    window.alert("유효하지 않은 데이터 존재!! 등록 불가!!");
    return;
  }
  const data = await mapping();
  await saveData(data, 'qualifications');
  window.alert("사원 자격증 정보 등록 완료");
  window.location.reload();
};
</script>


<style scoped>
.emp-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  gap: 0.5rem;
}

.ca {
  margin-left: 2rem;
}

.exlbtns1, .exlbtns2 {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 2rem;
  margin-right: 0.5rem;
}

.exlbtns1 button, .exlbtns2 button {
  display: flex;
  flex-direction: row;
  justify-content:space-around ;
  width: 140px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 5px;
  background: #003566;
  border: none;
  color: #FFF;
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1px;
}

button {
  width: 100px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 5px;
  background: #003566;
  border: none;
  color: #FFF;
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1px;
}

button p {
  text-align: center;
  vertical-align: middle;
}

.exlbtns2 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.exlbtns2 button {
  width: 110px;
  padding: 1px;
}

.colboard, .inboard{
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  border-radius: 5px;
  background: #FFF;
  border: solid 2px #2e2f3015;
}

.inboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: stretch;
  padding: 0 0 2rem 0;
}

.inboard div {
  height: 100%;
}

.inboard > :last-child {
  border-radius: 5px;
  border-bottom: solid 2px #2e2f3015;
}

.colname {
  display: grid;
  grid-template-columns: 50px 150px 3fr 2fr 2fr 3fr 2fr;
  height: 50px;
  justify-content: stretch;
  justify-items: center;
  align-items: center;
  border-collapse: collapse;
}

.colname > div {
  padding: 0.5rem;
  text-align: center;
  width: 100%;
  height: 100%;
  border-right: 0.5px solid #dadada;
}

.headers > div {
  font-weight: bold;
  width: 100%;
  align-content: center;
}

.rows > div {
  width: 100%;
}
.rows > div > input{
  width: 100%;
  height: 100%;
  padding-left: 0.5rem;
  text-align: left;
  flex-shrink: 0;
  border-radius: 0.977px;
  border: 0.586px solid #DBDBDB;
  background: #F8F8F8;
  box-shadow: 0px 0.977px 1.954px 0px rgba(0, 0, 0, 0.25) inset;
}
.chbox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.chbox > label {
  display: flex;
  align-items: center;
  justify-content: center;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid #DBDBDB;
  position: relative;
}

input[type="checkbox"]:checked + label::after {
  content: '✔';
  font-size: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
}

.cell-container {
  position: relative;
}

.modal {
  display: flex;
  flex-direction: column;
  text-align: left;
  position: absolute;
  top: 100%;
  left: 0.5rem;
  min-width: max-content;
  min-height: max-content;
  padding: 1.5rem;
  margin-top: 0.2rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 9px;
  z-index: 10;
}

.modal pre {
  margin: 0;
  color: #333;
  font-size: 9px;
  line-height: 1.5;
}

.regist {
  display: flex;
  justify-content: center;
  margin-top: 5rem;
}

.invalid-row {
  background: #FFD8D8 !important;
  stroke: #F00 !important;
  border: 2px solid red !important;
}
</style>