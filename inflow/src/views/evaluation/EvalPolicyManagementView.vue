<template>
    <CommonArticle label="평가 정책 등록" w="90%">
      <TableItem gtc="0.25fr 0.25fr 0.25fr 0.25fr">
        <TableRow>
          <TableCell th fs="1.6rem">과제유형</TableCell>
          <TableCell fs="1.6rem">
            <div class="dropdown-container">
              <TypeDropdown></TypeDropdown>
            </div>
          </TableCell>
          <TableCell th fs="1.6rem">상대평가기준 사원 수</TableCell>
          <TableCell fs="1.6rem">
            <div class="dropdown-container">
              <input type="number" class="number-input" />
            </div>
          </TableCell>
        </TableRow>
  
        <TableRow>
          <TableCell th fs="1.6rem">평가 시작일</TableCell>
          <TableCell fs="1.6rem">
            <div class="date-selector">
              <YearMonthDropDown></YearMonthDropDown>
              <DateDropDown></DateDropDown>
            </div>
          </TableCell>
          <TableCell th fs="1.6rem">평가 종료일</TableCell>
          <TableCell fs="1.6rem">
            <div class="date-selector">
              <YearMonthDropDown></YearMonthDropDown>
              <DateDropDown></DateDropDown>
            </div>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell th fs="1.6rem">정책 수정 가능 시기</TableCell>
          <TableCell fs="1.6rem">
            <div class="dropdown-container">
              <YearMonthDropDown></YearMonthDropDown>
            </div>
          </TableCell>
          <TableCell th fs="1.6rem">적용 시기</TableCell>
          <TableCell fs="1.6rem">
            <div class="year-half-section">
              <YearDropDown @valid-date-selected="handleYearSelected" />
              <HalfDropdown @half-selected="handleHalfSelected" />
            </div>
          </TableCell>
        </TableRow>
  
        <TableRow>
          <TableCell th fs="1.6rem">정책설명란</TableCell>
          <TableCell gc="span 3">
            <textarea class="policy-textarea" placeholder="정책 설명을 입력하세요"></textarea>
          </TableCell>
        </TableRow>
      </TableItem>
    </CommonArticle>
  
    <ButtonItem
      class="submit-btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      @click="handleSubmit"
      :disabled="!isFormValid"
    >
      등록
    </ButtonItem>
  
    <hr />
  
    <CommonArticle label="평가 정책 목록" w="90%">
      <FlexItem class="year-half-section" fld="row" fs="1.6rem" fw="500" c="#003566">
        <YearDropDown @valid-date-selected="handleYearSelected" />
        <HalfDropdown @half-selected="handleHalfSelected" />
      </FlexItem>
  
      <TableItem gtc="0.125fr 0.25fr 0.25fr 0.2fr 0.2fr">
        <TableRow>
          <TableCell th fs="1.6rem">유형</TableCell>
          <TableCell th fs="1.6rem">시작비율</TableCell>
          <TableCell th fs="1.6rem">종료비율</TableCell>
          <TableCell th fs="1.6rem">절대평가 기준 점수</TableCell>
          <TableCell th fs="1.6rem">관리</TableCell>
        </TableRow>
  
        <TableRow v-for="grade in distinctGrades" :key="grade.grade_id">
          <TableCell class="mid" fs="1.6rem">{{ grade.grade_name }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ grade.start_ratio }}%</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ grade.end_ratio }}%</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ grade.absolute_grade_ratio }}점</TableCell>
          <TableCell class="button-cell">
            <ButtonItem
              class="submit-btn"
              h="3.6rem"
              w="7.2rem"
              bgc="#003566"
              br="0.6rem"
              c="#fff"
              fs="1.6rem"
              @click="handleModify(grade)"
            >
              수정
            </ButtonItem>
            <ButtonItem
              class="submit-btn"
              h="3.6rem"
              w="7.2rem"
              bgc="#003566"
              br="0.6rem"
              c="#fff"
              fs="1.6rem"
              @click="handleDelete(grade.grade_id)"
            >
              삭제
            </ButtonItem>
          </TableCell>
        </TableRow>
      </TableItem>
  
      <FlexItem
        v-if="distinctGrades.length === 0"
        class="empty-message"
        fld="row"
        h="6rem"
        w="100%"
        fs="1.6rem"
      >
        등록된 평가 등급이 없습니다.
      </FlexItem>
    </CommonArticle>

    <EvalGradeUpdateModalView
  v-if="isUpdateModalOpen"
  :grade="selectedGrade"
  @close="isUpdateModalOpen = false"
  @update-success="fetchGrades"
/>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import CommonArticle from '@/components/common/CommonArticle.vue';
  import TableCell from '@/components/semantic/TableCell.vue';
  import TableRow from '@/components/semantic/TableRow.vue';
  import TableItem from '@/components/semantic/TableItem.vue';
  import FlexItem from '@/components/semantic/FlexItem.vue';
  import ButtonItem from '@/components/semantic/ButtonItem.vue';
  import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
  import YearMonthDropDown from '@/components/dropdowns/YearMonthDropDown.vue';
  import DateDropDown from '@/components/dropdowns/DateDropDown.vue';
  import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
  import TypeDropdown from '@/components/dropdowns/DropdownItem.vue';
  import { findGradeByYearAndHalf, createGrade, updateGrade } from '@/api/evaluation';
  import EvalGradeUpdateModalView from '@/views/evaluation/EvalGradeUpdateModalView.vue';
  
// 목록 조회를 위한 상태
const gradeList = ref([]);
const selectedYear = ref(null);
const selectedHalf = ref(null);

// 등록 폼을 위한 상태
const registrationYear = ref(null);
const registrationHalf = ref(null);

const isUpdateModalOpen = ref(false);
const selectedGrade = ref(null);

const gradeForm = ref({
  grade_name: '',
  start_ratio: null,
  end_ratio: null,
  absolute_grade_ratio: null
});

// 폼 유효성 검증
const isFormValid = computed(() => {
  const form = gradeForm.value;
  return (
    form.grade_name &&
    form.start_ratio !== null &&
    form.end_ratio !== null &&
    form.absolute_grade_ratio !== null &&
    registrationYear.value &&
    registrationHalf.value &&
    form.start_ratio >= 0 &&
    form.end_ratio > form.start_ratio &&
    form.end_ratio <= 100 &&
    form.absolute_grade_ratio >= 0
  );
});

// 중복 제거된 등급 목록
const distinctGrades = computed(() => {
  const uniqueGrades = Array.from(new Map(
    gradeList.value.map(grade => [grade.grade_name, grade])
  ).values());
  return uniqueGrades.sort((a, b) => b.absolute_grade_ratio - a.absolute_grade_ratio);
});

// 등급 목록 조회
const fetchGrades = async () => {
  if (!selectedYear.value || !selectedHalf.value) return;
  
  try {
    const response = await findGradeByYearAndHalf(selectedYear.value, selectedHalf.value);
    if (response.success) {
      gradeList.value = response.content || [];
    } else {
      gradeList.value = [];
    }
  } catch (error) {
    console.error('평가 등급 조회 실패:', error);
    alert('평가 등급 조회에 실패했습니다.');
    gradeList.value = [];
  }
};

// 목록 조회 Year/Half 핸들러
const handleYearSelected = (year) => {
  selectedYear.value = year;
  fetchGrades();
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
  fetchGrades();
};

// 등록 폼 Year/Half 핸들러
const handleRegistrationYearSelected = (year) => {
  registrationYear.value = year;
};

const handleRegistrationHalfSelected = (half) => {
  registrationHalf.value = half;
};

// 등록 제출 핸들러
const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('모든 필드를 올바르게 입력해주세요.');
    return;
  }

  // API 요청을 위한 데이터 구성
  const createGradeRequestDTO = {
    grade_name: gradeForm.value.grade_name,
    start_ratio: Number(gradeForm.value.start_ratio),
    end_ratio: Number(gradeForm.value.end_ratio),
    absolute_grade_ratio: Number(gradeForm.value.absolute_grade_ratio)
  };

  try {
    const response = await createGrade(
      createGradeRequestDTO,
      registrationYear.value,
      registrationHalf.value
    );

    if (response.success) {
      alert('평가 등급이 성공적으로 등록되었습니다.');
      // 폼 초기화
      gradeForm.value = {
        grade_name: '',
        start_ratio: null,
        end_ratio: null,
        absolute_grade_ratio: null
      };
      // 조회 영역의 년도/반기를 등록한 년도/반기로 변경
      selectedYear.value = registrationYear.value;
      selectedHalf.value = registrationHalf.value;
      fetchGrades(); // 목록 새로고침
    } else {
      alert('등급 등록에 실패했습니다.');
    }
  } catch (error) {
    console.error('등급 등록 실패:', error);
    alert('등급 등록 중 오류가 발생했습니다.');
  }
};

// handleModify 함수 수정
const handleModify = (grade) => {
  selectedGrade.value = grade;
  isUpdateModalOpen.value = true;
};

// 삭제 핸들러
const handleDelete = async (gradeId) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    const response = await deleteGrade(gradeId);
    if (response.success) {
      alert('등급이 삭제되었습니다.');
      fetchGrades();
    } else {
      alert('등급 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('등급 삭제 실패:', error);
    alert('등급 삭제 중 오류가 발생했습니다.');
  }
};

onMounted(() => {
  fetchGrades();
});

</script>

<style scoped>
.dropdown-container {
  width: 100%; /* 추가 */  
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.date-selector {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.year-half-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.policy-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1.4rem;
  resize: vertical;
}

.number-input {
  width: 100%;
  height: 3rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1.4rem;
  text-align: center;
}

.button-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  gap: 1rem;
}

.submit-btn {
  margin-top: 3.2rem;
  padding: 1rem 0;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.mid {
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
}

.task-input {   
  width: 100%;
  height: 3rem;
  border: 0px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 1.4rem;
  text-align: center;
}

.task-input:invalid {
  border-color: red;
}

.task-input[type="number"] {
  -moz-appearance: textfield;
}

.task-input[type="number"]::-webkit-outer-spin-button,
.task-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

hr {
  width: 90%;
  margin: 3rem auto;
  border: 1px solid #dadada;
}
</style>