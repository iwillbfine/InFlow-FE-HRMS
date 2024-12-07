<!-- EvalPolicyManagementView.vue -->
<template>
  <CommonArticle label="평가 정책 등록" w="90%">
    <TableItem gtc="0.25fr 0.75fr 0.25fr 0.75fr">
      <TableRow>
        <TableCell th fs="1.6rem">과제유형</TableCell>
        <TableCell>
          <TypeDropdown
            placeholder="선택"
            :list="taskTypes"
            w="40%"
            @update:selectedItem="handleTypeSelection"
            class="typeDropdown task-input"
          />
        </TableCell>
        <TableCell th fs="1.6rem">기준 사원 수</TableCell>
        <TableCell fs="1.6rem">
          <input
            type="number"
            class="task-input"
            min="0"
            max="999999"
            step="1"
            pattern="\d*"
            inputmode="numeric"
            placeholder="상대평가 기준 최소 사원 수를 입력해주세요"
            v-model="minimumEmployeeCount"
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell th fs="1.6rem">평가 시작일</TableCell>
        <TableCell fs="1.6rem">
          <FlexItem
            class="year-half-section"
            fld="row"
            fs="1.6rem"
            fw="500"
            c="#003566"
          >
            <DateDropDown @valid-date-selected="handleStartDateSelected" />
          </FlexItem>
        </TableCell>
        <TableCell th fs="1.6rem">평가 종료일</TableCell>
        <TableCell fs="1.6rem">
          <FlexItem
            class="year-half-section"
            fld="row"
            fs="1.6rem"
            fw="500"
            c="#003566"
          >
            <DateDropDown @valid-date-selected="handleEndDateSelected" />
          </FlexItem>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell th fs="1.6rem"> 수정 가능 시기</TableCell>
        <TableCell fs="1.6rem">
          <YearMonthDropDown
            @valid-date-selected="handlePolicyEditDateSelected"
          />
        </TableCell>
        <TableCell th fs="1.6rem">적용 시기</TableCell>
        <TableCell fs="1.6rem">
          <FlexItem
            class="year-half-section"
            fld="row"
            fs="1.6rem"
            fw="500"
            c="#003566"
          >
            <YearDropDown
              @valid-date-selected="handleRegistrationYearSelected"
            />
            <HalfDropdown @half-selected="handleRegistrationHalfSelected" />
          </FlexItem>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell th fs="1.6rem">유형별 적용 비율</TableCell>
        <TableCell gc="span 3">
          <input
            type="number"
            class="task-input"
            min="0"
            max="1"
            step="0.1"
            placeholder="0과 1사이의 과제 유형별 적용 비율을 입력해주세요"
            v-model="taskRatio"
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell th fs="1.6rem">정책설명란</TableCell>
        <TableCell gc="span 3">
          <textarea
            class="policy-textarea"
            placeholder="정책 설명을 입력하세요"
            v-model="policyDescription"
          ></textarea>
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
    <FlexItem
      class="year-half-section"
      fld="row"
      fs="1.6rem"
      fw="500"
      c="#003566"
    >
      <YearDropDown @valid-date-selected="handleYearSelected" />
      <HalfDropdown @half-selected="handleHalfSelected" />
    </FlexItem>

    <TableItem gtc="0.125fr 0.25fr 0.25fr 0.2fr 0.2fr">
      <TableRow>
        <TableCell th fs="1.6rem">유형</TableCell>
        <TableCell th fs="1.6rem">평가 시작일</TableCell>
        <TableCell th fs="1.6rem">평가 종료일</TableCell>
        <TableCell th fs="1.6rem">수정 가능 시기</TableCell>
        <TableCell th fs="1.6rem">관리</TableCell>
      </TableRow>

      <TableRow v-for="policy in policyList" :key="policy.evaluation_policy_id">
        <TableCell class="mid" fs="1.6rem">
          {{ getTaskTypeName(policy.task_type_id) }}
        </TableCell>
        <TableCell class="mid" fs="1.6rem">
          {{ formatDate(policy.start_date) }}
        </TableCell>
        <TableCell class="mid" fs="1.6rem">
          {{ formatDate(policy.end_date) }}
        </TableCell>
        <TableCell class="mid" fs="1.6rem">
          {{ formatDate(policy.modifiable_date) }}
        </TableCell>

        <TableCell class="button-cell">
          <ButtonItem
            class="submit-btn"
            h="3.6rem"
            w="7.2rem"
            bgc="#003566"
            br="0.6rem"
            c="#fff"
            fs="1.6rem"
            @click="handleViewPolicy(policy)"
          >
            상세보기
          </ButtonItem>
        </TableCell>
      </TableRow>
    </TableItem>

    <FlexItem
      v-if="policyList.length === 0"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.6rem"
    >
      등록된 평가 정책이 없습니다.
    </FlexItem>
  </CommonArticle>

  <EvalPolicyUpdateAndViewModal
    v-if="showPolicyModal"
    :policy-id="selectedPolicyId"
    :task-types="taskTypes"
    @close="closePolicyModal"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
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
import {
  getAllTaskTypes,
  createEvaluationPolicy,
  findEvaluationPolicyByYearAndHalf,
} from '@/api/evaluation';
import EvalPolicyUpdateAndViewModal from './EvalPolicyUpdateAndViewModal.vue';

// 과제 유형 관련 상태
const taskTypes = ref([]);
const selectedTaskType = ref('');

// 기본 입력 필드 상태
const minimumEmployeeCount = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const policyEditDate = ref(null);
const policyDescription = ref('');
const taskRatio = ref(null);
const policyRegisterId = ref(null);

// 목록 조회를 위한 상태
const selectedYear = ref(null);
const selectedHalf = ref(null);
const policyList = ref([]);

// 등록 폼을 위한 상태
const registrationYear = ref(null);
const registrationHalf = ref(null);

// 모달 조회를 위한 상태
const showPolicyModal = ref(false);
const selectedPolicyId = ref(null);

watch([selectedYear, selectedHalf], ([newYear, newHalf]) => {
  if (newYear && newHalf) {
    fetchPolicies();
  }
});

// 과제 유형 목록 조회
const fetchTaskTypes = async () => {
  try {
    const response = await getAllTaskTypes();
    if (response.success) {
      // 데이터 구조 변환
      taskTypes.value = response.content.map((type) => ({
        id: type.task_type_id,
        name: type.task_type_name,
      }));
    } else {
      console.error('과제 유형 조회 실패:', response);
      taskTypes.value = [];
    }
  } catch (error) {
    console.error('과제 유형 조회 중 오류 발생:', error);
    taskTypes.value = [];
  }
};
const getTaskTypeName = (taskTypeId) => {
  const taskType = taskTypes.value.find((type) => type.id === taskTypeId);
  return taskType ? taskType.name : '-';
};

const fetchPolicies = async () => {
  if (!selectedYear.value || !selectedHalf.value) return;

  try {
    const response = await findEvaluationPolicyByYearAndHalf(
      selectedYear.value,
      selectedHalf.value
    );
    if (response.success) {
      policyList.value = response.content || [];
    } else {
      console.error('정책 조회 실패:', response);
      policyList.value = [];
    }
  } catch (error) {
    console.error('평가 정책 조회 실패:', error);
    alert('평가 정책 조회에 실패했습니다.');
    policyList.value = [];
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 핸들러 함수들
const handleTypeSelection = (typeId) => {
  selectedTaskType.value = typeId;
};

// 날짜 핸들러들 수정
const handleStartDateSelected = (date) => {
  startDate.value = `${date}T00:00:00`; // date는 'YYYY-MM-DD' 형식으로 옴
};

const handleEndDateSelected = (date) => {
  endDate.value = `${date}T23:59:59`; // date는 'YYYY-MM-DD' 형식으로 옴
};

const handlePolicyEditDateSelected = (date) => {
  policyEditDate.value = `${date}-01T00:00:00`; // date는 'YYYY-MM' 형식으로 옴
};

// 목록 조회용 Year/Half 핸들러
const handleYearSelected = (year) => {
  selectedYear.value = year;
  fetchPolicies();
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
  fetchPolicies();
};

// 등록용 Year/Half 핸들러
const handleRegistrationYearSelected = (year) => {
  registrationYear.value = year;
};

const handleRegistrationHalfSelected = (half) => {
  registrationHalf.value = half;
};

// 메서드 추가
const handleViewPolicy = (policy) => {
  selectedPolicyId.value = policy.evaluation_policy_id;
  showPolicyModal.value = true;
};

const closePolicyModal = () => {
  showPolicyModal.value = false;
  selectedPolicyId.value = null;
};

// 폼 유효성 검증
const isFormValid = computed(() => {
  const valid =
    selectedTaskType.value &&
    minimumEmployeeCount.value > 0 &&
    startDate.value &&
    endDate.value &&
    policyEditDate.value &&
    policyDescription.value.trim() !== '' &&
    registrationYear.value &&
    registrationHalf.value &&
    taskRatio.value > 0 &&
    taskRatio.value <= 1;

  return valid;
});

// 등록 제출 핸들러
const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('모든 필드를 올바르게 입력해주세요.');
    return;
  }

  const policyData = {
    task_type_id: selectedTaskType.value,
    min_rel_eval_count: Number(minimumEmployeeCount.value),
    start_date: startDate.value,
    end_date: endDate.value,
    modifiable_date: policyEditDate.value,
    policy_description: policyDescription.value,
    year: registrationYear.value,
    half: registrationHalf.value,
    task_ratio: Number(taskRatio.value),
    policy_register_id: policyRegisterId.value,
  };

  try {
    const response = await createEvaluationPolicy(policyData);
    if (response.success) {
      alert('평가 정책이 성공적으로 등록되었습니다.');
      resetForm();
      fetchPolicies();
    } else {
      alert(
        `정책 등록 실패: ${response.message || '알 수 없는 오류가 발생했습니다.'}`
      );
    }
  } catch (error) {
    console.error('정책 등록 실패:', error);
    alert(`정책 등록 중 오류가 발생했습니다: ${error.message}`);
  }
};

// 폼 초기화
const resetForm = () => {
  selectedTaskType.value = '';
  minimumEmployeeCount.value = null;
  startDate.value = null;
  endDate.value = null;
  policyEditDate.value = null;
  policyDescription.value = '';
  registrationYear.value = null;
  registrationHalf.value = null;
  taskRatio.value = null;
};

onMounted(() => {
  policyRegisterId.value = Number(localStorage.getItem('employeeId'));
  fetchTaskTypes();
  fetchPolicies();
});
</script>

<style scoped>
.dropdown-container {
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.date-selector {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.year-half-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 0;
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
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 1.4rem;
  text-align: center;
  background-color: white;
}

/* select 요소 화살표 스타일링 */
select.task-input {
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.task-input:invalid {
  border-color: red;
}

.task-input[type='number'] {
  -moz-appearance: textfield;
}

.task-input[type='number']::-webkit-outer-spin-button,
.task-input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

hr {
  width: 90%;
  margin: 3rem auto;
  border: 1px solid #dadada;
}

.typeDropdown {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
}

.button-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  gap: 1rem;
}

.view-btn {
  margin-top: 3.2rem;
  padding: 1rem 0;
}
</style>
