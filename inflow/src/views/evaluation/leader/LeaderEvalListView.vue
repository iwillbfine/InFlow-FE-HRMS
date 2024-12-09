<template>
  <CommonArticle class="feedback-article" label="평가 결과" w="90%">
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
    <FlexItem class="article-content-container" fld="row" h="20rem">
      <FlexItem
        class="feedback-wrapper"
        w="70%"
        br="0.6rem"
        bgc="#EEF4FA"
        c="#0D0D0D"
        fs="1.5rem"
        fw="400"
      >
        <span>{{ feedbackContent }}</span>
      </FlexItem>
      <FlexItem
        class="grade-wrapper"
        fld="column"
        w="30%"
        br="0.6rem"
        b="1px solid #003566"
        bgc="#fff"
        c="#003566"
      >
        <span class="grade-label">최종 등급</span>
        <span class="grade">{{ finalGrade }}</span>
      </FlexItem>
    </FlexItem>
  </CommonArticle>
  <CommonArticle class="task-list-article" label="평가 상세" w="90%">
    <TableItem gtc="0.5fr 2fr 0.5fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>유형</TableCell>
        <TableCell th fs="1.6rem">과제명</TableCell>
        <TableCell th fs="1.6rem" topr>과제별 등급</TableCell>
      </TableRow>
      <TableRow v-for="(item, index) in taskList" :key="index">
        <TableCell
          class="mid"
          fs="1.6rem"
          :botl="index === taskList.length - 1"
          >{{ getTaskTypeName(item.task_type_id) }}</TableCell
        >
        <TableCell class="mid" fs="1.6rem">{{ item.task_eval_name }}</TableCell>
        <TableCell
          class="mid"
          fs="1.6rem"
          :botr="index === taskList.length - 1"
          >{{ item.task_grade || 'N/A' }}</TableCell
        >
      </TableRow>
    </TableItem>
  </CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import { ref, watch, onMounted } from 'vue';
import {
  findFeedbacks,
  findFinalGrade,
  getAllTaskTypes,
  findTaskEvalByEvaluationId,
} from '@/api/evaluation';

const selectedYear = ref(null);
const selectedHalf = ref(null);
const feedbackContent = ref(null);
const finalGrade = ref('-');
const taskList = ref([]);
const taskTypes = ref([]);
const evaluationId = ref(null);

// 리더평가용 과제 함수

// 피드백 조회 함수
const fetchFeedback = async () => {
  try {
    if (selectedYear.value && selectedHalf.value) {
      const empId = localStorage.getItem('employeeId');
      const response = await findFeedbacks(
        empId,
        selectedYear.value,
        selectedHalf.value
      );
      if (response.success && response.content) {
        feedbackContent.value = response.content.content;
      }
    }
  } catch (error) {
    console.error('피드백 조회 중 오류 발생:', error);
    feedbackContent.value = '피드백을 불러오는 중 오류가 발생했습니다.';
  }
};

// 평가 반기별 최종 평가 등급 조회 함수 수정
const fetchFinalGrade = async () => {
  try {
    if (selectedYear.value && selectedHalf.value) {
      const empId = localStorage.getItem('employeeId');
      const response = await findFinalGrade(
        empId,
        selectedYear.value,
        selectedHalf.value
      );

      if (response.success && response.content) {
        finalGrade.value = response.content.fin_grade;
        evaluationId.value = response.content.evaluation_id; // 평가 ID 저장
        await fetchTaskList(); // 평가 ID를 받아온 후 과제 리스트 조회
      } else {
        finalGrade.value = 'N/A';
        taskList.value = [];
      }
    }
  } catch (error) {
    console.error('최종 등급 조회 중 오류 발생:', error);
    finalGrade.value = 'N/A';
    taskList.value = [];
  }
};

// 과제 유형 조회 함수
const fetchTaskTypes = async () => {
  try {
    const response = await getAllTaskTypes();
    if (response.success && response.content) {
      taskTypes.value = response.content;
    }
  } catch (error) {
    console.error('과제 유형 조회 중 오류 발생:', error);
    taskTypes.value = [];
  }
};

// 과제 리스트 조회 함수 추가
const fetchTaskList = async () => {
  try {
    if (!evaluationId.value) return;

    const response = await findTaskEvalByEvaluationId(evaluationId.value);
    if (response.success) {
      taskList.value = response.content;
    } else {
      taskList.value = [];
    }
  } catch (error) {
    console.error('과제 리스트 조회 중 오류 발생:', error);
    taskList.value = [];
  }
};

// 과제 유형 이름 가져오기
const getTaskTypeName = (typeId) => {
  const foundType = taskTypes.value.find(
    (type) => type.task_type_id === typeId
  );
  return foundType ? foundType.task_type_name : '-';
};

watch([selectedYear, selectedHalf], ([newYear, newHalf]) => {
  if (newYear && newHalf) {
    fetchFeedback();
    fetchFinalGrade();
  }
});

const handleYearSelected = (year) => {
  selectedYear.value = year;
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
};

onMounted(() => {
  fetchTaskTypes();
});
</script>

<style scoped>
.common-article {
  position: relative;
}

.article-content-container {
  gap: 1rem;
}

.feedback-article {
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.feedback-wrapper {
  padding: 2rem;
  overflow-y: auto;
}

.grade-wrapper {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.grade-label {
  line-height: 2.4rem;
  font-size: 2.4rem;
  font-weight: 700;
}

.grade {
  line-height: 9rem;
  font-size: 4.5rem;
  font-weight: 700;
}

.mid {
  justify-content: center;
  align-items: center;
}

.year-half-section {
  position: absolute;
  top: -1rem;
  gap: 1rem;
  right: 0;
}
</style>
