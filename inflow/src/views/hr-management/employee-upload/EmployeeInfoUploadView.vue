<template>
  <div class="emp-container">
    <CommonArticle :label="title" class="ca" w="96%">
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
    </CommonArticle>
  </div>
</template>


<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue'
import * as xlsx from "xlsx";
import { ref, onMounted } from "vue";
import { getDoc, saveData, getValidData } from '@/api/emp_attach';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const headerNames = ref([
  "사번", "성별", "성명", "생년월일", "이메일", "휴대폰번호", "입사유형", "계약월급",
  "도로명 주소", "상세주소", "우편번호", "부서코드", "직위코드", "직책코드", "직무코드"
]);
const defaultRow = Object.fromEntries(headerNames.value.map((key) => [key, null]));

const chkHeader = ref(false);
const selectedRows = ref([]);
const rowsData = ref([]);
const fileInput = ref(null);
const workbook = ref(null);
const validData = ref({});

const validators = {
  성별: (value) => /^(남|여)$/.test(value),
  생년월일: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
  이메일: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  휴대폰번호: (value) => /^01[0-9]-\d{3,4}-\d{4}$/.test(value),
  입사유형: (value) => /^(ROOKIE|VETERAN)$/.test(value),
  부서코드: (value) => validData.value.departments?.includes(value),
  직위코드: (value) => validData.value.positions?.includes(value),
  직책코드: (value) => validData.value.roles?.includes(value),
  직무코드: (value) => validData.value.duties?.includes(value),
};

const isCellValid = (value, header) => {
  if (value === null || value === '') {
    return false;
  }

  if (validators[header]) {
    return validators[header](value);
  }

  return true;
};

onMounted(async () => {
  validData.value = await getValidData();
  initializeSelectedRows();
});

const clickInput = () => {
  fileInput.value.click();
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

const mapping = () => {
  return rowsData.value.map((row) => ({
    employee_number: row["사번"],
    gender: row["성별"] === "여" ? "FEMALE" : row["성별"] === "남" ? "MALE" : null,
    name: row["성명"],
    birth_date: row["생년월일"],
    email: row["이메일"],
    phone_number: row["휴대폰번호"],
    join_type: row["입사유형"],
    monthly_salary: row["계약월급"],
    street_address: row["도로명 주소"],
    detailed_address: row["상세주소"],
    postcode: row["우편번호"],
    department_code: row["부서코드"],
    position_code: row["직위코드"],
    role_code: row["직책코드"],
    duty_code: row["직무코드"],
  }));
};

// 파일 다운로드
const fileDownload = async () => {
  try {
    const fileUrl = await getDoc("new_employee"); // Pre-signed URL 가져오기
    const link = document.createElement("a"); // 링크 생성
    link.href = fileUrl; // URL 연결
    link.setAttribute("download", "new_employee_form.xlsx"); // 다운로드 파일 이름 설정
    link.click(); // 클릭 이벤트 발생
  } catch (error) {
    console.error("양식 다운로드 에러:", error.message);
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
  await saveData(mapping(), null);
  window.alert("사원 기본 정보 등록 완료");
  window.location.reload();
};
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

.exlbtns1, .exlbtns2 {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 2rem;
  margin-right: 0.8rem;
}

.exlbtns1 button, .exlbtns2 button {
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
  color: #FFF;
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
  background: #FFF;
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
  grid-template-columns: 50px 150px 50px 100px 130px 250px 160px 100px 120px 300px 150px 100px 100px 100px 100px 100px;
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
  background-color: #fff;
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
  margin-top: 2rem;
}

.invalid-row {
  background: #FFD8D8 !important;
  stroke: #F00 !important;
  border: 2px solid red !important;
}
</style>
