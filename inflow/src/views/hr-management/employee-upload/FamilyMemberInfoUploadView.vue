<template>
  <div class="emp-container">
    <CommonArticle label="가구원" class="ca" w="96%">
      <div class="tmp">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept=".xlsx, .xls"
          style="display: none"
        />
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
              <input
                type="checkbox"
                :id="chkHeader"
                v-model="chkHeader"
                @change="toggleAllCheckboxes"
              />
              <label :for="chkHeader"></label>
            </div>
            <div v-for="header in headerNames" :key="header">{{ header }}</div>
          </div>
          <div
            class="colname rows"
            v-for="(row, rowIndex) in rowsData"
            :key="rowIndex"
          >
            <div class="chbox">
              <input
                type="checkbox"
                :id="'check' + rowIndex"
                v-model="selectedRows[rowIndex]"
              />
              <label :for="'check' + rowIndex"></label>
            </div>
            <div
              v-for="(value, header) in row"
              :key="header"
              class="cell-container"
            >
              <input
                type="text"
                v-model="rowsData[rowIndex][header]"
                :class="{
                  'invalid-row': !isCellValid(
                    rowsData[rowIndex][header],
                    header
                  ),
                }"
                class="cell-input"
                @focus="showModal(rowIndex, header)"
                @blur="hideModal"
              />
              <div
                v-if="
                  visible && activeRow === rowIndex && activeHeader === header
                "
                class="modal"
              >
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
    </CommonArticle>
  </div>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import * as xlsx from 'xlsx';
import { ref, onMounted } from 'vue';
import {
  getDoc,
  saveData,
  getAllEmpId,
  getRelationships,
} from '@/api/emp_attach';

const headerNames = ref(['사번', '가구원관계', '성명', '생년월일']);
const defaultRow = Object.fromEntries(
  headerNames.value.map((key) => [key, null])
);

const chkHeader = ref(false);
const selectedRows = ref([]);
const rowsData = ref([]);
const fileInput = ref(null);
const workbook = ref(null);
const ids = ref({});
const relationships = ref([]);
const rChk = ref([]);
const loading = ref(true);
const modalTxt = ref({});

const validators = {
  사번: (value) => ids.value[value] !== undefined,
  가구원관계: (value) => rChk.value?.includes(`${value}`),
  생년월일: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
};

const isCellValid = (value, header) => {
  if (value === null || value === '') return false;
  if (
    header === '사번' &&
    (loading.value || Object.keys(ids.value).length === 0)
  )
    return true;
  if (
    header === '가구원관계' &&
    (loading.value || Object.keys(relationships.value).length === 0)
  )
    return true;
  return validators[header] ? validators[header](value) : true;
};

const clickInput = () => {
  fileInput.value.click();
};

const getEmpIds = async () => {
  loading.value = true;
  const tmp1 = await getAllEmpId();
  const tmp2 = await getRelationships();
  tmp1.forEach((row) => {
    ids.value[row['employee_number']] = row['employee_id'];
    ids.value[row['employee_id']] = row['employee_number'];
  });
  tmp2.forEach((row) => {
    relationships.value[row['family_relationship_code']] =
      row['family_relationship_name'];
    relationships.value[row['family_relationship_name']] =
      row['family_relationship_code'];
  });
  rChk.value = tmp2.map((row) => row['family_relationship_name']);
  loading.value = false;
};

const visible = ref(false);
const activeRow = ref(null);
const activeHeader = ref(null);

const showModal = (rowIndex, header) => {
  if (modalTxt.value[header] !== undefined) {
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

const handleFileUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const binaryStr = e.target.result;
    workbook.value = xlsx.read(binaryStr, { type: 'binary' });
    addToRowsData();
  };
  reader.readAsBinaryString(file);
  event.target.value = '';
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
  rowsData.value = rowsData.value.filter(
    (_, index) => !selectedRows.value[index]
  );
  initializeSelectedRows();
};

const mapping = async () => {
  await getEmpIds();
  const result = ref([]);
  rowsData.value.map((row) => {
    result.value.push({
      name: row['성명'],
      birth_date: row['생년월일'],
      employee_id: `${ids.value[row['사번']]}`,
      family_relationship_code: relationships.value[row['가구원관계']],
    });
  });
  return result.value;
};

// Family Form 다운로드
const fileDownload = async () => {
  try {
    const response = await getDoc('family');
    const fileUrl = response.content;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'family_form.xlsx');
    link.click();
  } catch (error) {
    console.error('Family Form 다운로드 에러:', error.message);
  }
};

const postData = async () => {
  const invalidRows = rowsData.value.some((row) =>
    Object.entries(row).some(([header, value]) => !isCellValid(value, header))
  );

  if (invalidRows) {
    window.alert('유효하지 않은 데이터 존재!! 등록 불가!!');
    return;
  }
  const data = await mapping();
  await saveData(data, 'family-members');
  window.alert('사원 가구원 정보 등록 완료');
  window.location.reload();
};

onMounted(async () => {
  await getEmpIds();

  modalTxt.value = {
    사번: '유효한 사번을 입력하세요.',
    가구원관계: `선택:\n- ${(rChk.value || []).join('\n- ')}`,
    생년월일: '입력 예:\n- YYYY-MM-DD',
  };
});
</script>

<style scoped>
.emp-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
}

.ca {
  align-self: center;
}

.common-article {
  position: relative;
}

.exlbtns1 {
  position: absolute;
  top: -0.2rem;
  right: 0;
}

.exlbtns1,
.exlbtns2 {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 2rem;
  margin-right: 0.8rem;
}

.exlbtns1 button,
.exlbtns2 button {
  width: 14.4rem;
  height: 3.6rem;
  gap: 1rem;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.6rem;
  width: 7.2rem;
  border-radius: 0.6rem;
  background-color: #003566;
  border: none;
  color: #fff;
  font-size: 1.6rem;
  cursor: pointer;
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

.colboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  border-radius: 0.6rem;
  background: #fff;
  font-size: 1.4rem;
  border: 2px solid #2e2f3015;
  margin-top: 0.5rem;
}

.inboard {
  display: flex;
  flex-direction: column;
  min-height: 27rem;
  width: 100%;
  overflow-x: auto;
}

.colname {
  display: grid;
  grid-template-columns: 50px 150px 2.5fr 2.5fr 2.5fr;
  height: 4.5rem;
  justify-content: stretch;
  justify-items: center;
  align-items: center;
}

.colname > div {
  padding: 0.5rem;
  text-align: center;
  width: 100%;
  height: 100%;
  border: 0.5px solid #dadada;
}

.headers > div {
  font-weight: bold;
  width: 100%;
  align-content: center;
  background-color: #f8f8f8;
}

.rows > div {
  width: 100%;
}

.rows > div > input {
  width: 100%;
  height: 100%;
  padding-left: 0.5rem;
  text-align: left;
  flex-shrink: 0;
  border-radius: 0.977px;
  border: 0.586px solid #dbdbdb;
  background: #f8f8f8;
  box-shadow: 0px 0.977px 1.954px 0px rgba(0, 0, 0, 0.25) inset;
}

.chbox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chbox > label {
  display: flex;
  align-items: center;
  justify-content: center;
}

input[type='checkbox'] {
  display: none;
}

input[type='checkbox'] + label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid #dbdbdb;
  background-color: #fff;
  position: relative;
}

input[type='checkbox']:checked + label::after {
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
  margin-top: 2rem;
}

.invalid-row {
  background: #ffd8d8 !important;
  stroke: #f00 !important;
  border: 2px solid red !important;
}
</style>
