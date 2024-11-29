<template>
  <div class="emp-container">
    <CommonArticle :label="title" class="ca" w="90%"></CommonArticle>

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
          <div v-for="(value, header) in row" :key="header">
            <input 
              type="text" 
              v-model="rowsData[rowIndex][header]" 
              :class="{ 'invalid-row': !isCellValid(rowsData[rowIndex][header], header) }"
              class="cell-input"/>
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
import { getDoc, saveData, getEmpId, getRelationships } from '@/api/emp_attach';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const headerNames = ref(["사번", "가구원관계", "성명", "생년월일"]);
const defaultRow = Object.fromEntries(headerNames.value.map((key) => [key, null]));

const chkHeader = ref(false);
const selectedRows = ref([]);
const rowsData = ref([]);
const fileInput = ref(null);
const workbook = ref(null);
const validData = ref({});
const ids = ref({});
const relationships = ref([]);
const rChk = ref([]);
const loading = ref(true);

const validators = {
  사번: (value) => ids.value[value] !== undefined,
  가구원관계: (value) => rChk.value?.includes(`${value}`),
  생년월일: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
};

const isCellValid = (value, header) => {
  if (value === null || value === '') return false;
  if (header === '사번' && (loading.value || Object.keys(ids.value).length === 0)) return true;
  if (header === '가구원관계' && (loading.value || Object.keys(relationships.value).length === 0)) return true;
  return validators[header] ? validators[header](value) : true;
};

const clickInput = () => {
  fileInput.value.click();
}

const getEmpIds = async() => {
  loading.value = true;
  const tmp1 = await getEmpId({'employee_number':rowsData.value.map(row => `${row['사번']}`)})
  const tmp2 = await getRelationships();
  tmp1.forEach((row) => {
    ids.value[row["employee_number"]] = row["employee_id"];
    ids.value[row["employee_id"]] = row["employee_number"];
  });
  tmp2.forEach((row) => {
    relationships.value[row["family_relationship_code"]] = row["family_relationship_name"];
    relationships.value[row["family_relationship_name"]] = row["family_relationship_code"];
  });
  rChk.value = tmp2.map(row => row["family_relationship_name"]);
  loading.value = false;
}

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
      name: row["성명"],
      birth_date: row["생년월일"],
      employee_id: `${ids.value[row['사번']]}`,
      family_relationship_code: relationships.value[row["가구원관계"]],
    });
  });
  return result.value;
};


const fileDownload = async () => {
  const blob = await getDoc("family");
  const url = URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "family_form.xlsx");
  link.click();
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
  await saveData(data, 'family-members');
  window.alert("사원 가구원 정보 등록 완료");
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
  grid-template-columns: 50px 150px 2.5fr 2.5fr 2.5fr;
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
  text-align: center;
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