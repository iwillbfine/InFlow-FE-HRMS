<template>
  <CommonArticle class="feedback-article" label="평가 상세" w="90%">
    <FlexItem
      class="year-half-section"
      fld="row"
      fs="1.6rem"
      fw="500"
      c="#003566"
    >
      <YearDropDown @valid-date-selected="handleYearSelected" />
      <HalfDropdown @half-selected="handleHalfSelected" />
      <ButtonItem
        class="search-btn"
        h="3.6rem"
        w="7.2rem"
        bgc="#003566"
        br="0.6rem"
        c="#fff"
        fs="1.6rem"
        @click="handleSearch"
      >
        조회
      </ButtonItem>
    </FlexItem>

    <!-- 평가 데이터 테이블 -->
    <FlexItem class="article-content-container" fld="column">
      <TableItem gtc="0.5fr 1fr 0.8fr 2fr 2.5fr 0.7fr">
        <TableRow>
          <TableCell th fs="1.6rem">No</TableCell>
          <TableCell th fs="1.6rem">유형</TableCell>
          <TableCell th fs="1.6rem">가중치</TableCell>
          <TableCell th fs="1.6rem">과제명</TableCell>
          <TableCell th fs="1.6rem">과제 내용</TableCell>
          <TableCell th fs="1.6rem">등급</TableCell>
        </TableRow>
        <TableRow
          v-if="isSearched && !isEmpty"
          v-for="(task, index) in taskList"
          :key="task.task_eval_id"
        >
          <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            getTaskTypeName(task.task_type_id) || '-'
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            task.set_ratio ? `${(task.set_ratio * 100).toFixed(0)}%` : '-'
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            task.task_eval_name || '-'
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            task.task_eval_content || '-'
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            task.task_grade || 'N/A'
          }}</TableCell>
        </TableRow>
      </TableItem>

      <!-- 데이터가 없을 경우 메시지 -->
      <FlexItem
        v-if="isEmpty && isSearched"
        class="empty-message"
        fld="row"
        h="6rem"
        w="100%"
        fs="1.6rem"
      >
        평가 내역이 존재하지 않습니다.
      </FlexItem>
    </FlexItem>
  </CommonArticle>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import {
  getAllTaskTypes,
  findIndividualTaskListByEvaluationId,
} from '@/api/evaluation';

// 상태 관리 변수
const taskList = ref([]);
const taskTypes = ref([]);
const selectedYear = ref(null);
const selectedHalf = ref(null);
const isSearched = ref(false);
const isEmpty = ref(true);

// 로컬 스토리지에서 사용자 ID 가져오기
const eid = ref(localStorage.getItem('employeeId'));

// 연도 선택 핸들러
const handleYearSelected = (year) => {
  selectedYear.value = Number(year);
};

// 반기 선택 핸들러
const handleHalfSelected = (half) => {
  selectedHalf.value = half;
};

// 조회 버튼 클릭 핸들러
const handleSearch = async () => {
  if (!selectedYear.value || !selectedHalf.value) {
    alert('연도와 반기를 모두 선택해주세요.');
    return;
  }

  await loadTaskEvaluation();
  isSearched.value = true;
};

// 평가 데이터 로드
const loadTaskEvaluation = async () => {
  try {
    const response = await findIndividualTaskListByEvaluationId(
      eid.value,
      Number(selectedYear.value),
      selectedHalf.value
    );
    if (response.success) {
      taskList.value = response.content;
      isEmpty.value = taskList.value.length === 0;
    } else {
      taskList.value = [];
      isEmpty.value = true;
    }
  } catch (error) {
    console.error('과제 평가 데이터 로드 실패:', error);
    taskList.value = [];
    isEmpty.value = true;
  }
};

// 과제 유형 로드
const fetchTaskTypes = async () => {
  try {
    const response = await getAllTaskTypes();
    if (response.success) {
      taskTypes.value = response.content;
    }
  } catch (error) {
    console.error('과제 유형 조회 실패:', error);
  }
};

// 과제 유형 이름 가져오기
const getTaskTypeName = (typeId) => {
  const foundType = taskTypes.value.find(
    (type) => type.task_type_id === typeId
  );
  return foundType ? foundType.task_type_name : '-';
};

// 초기화
onMounted(async () => {
  if (!eid.value) {
    alert('사용자 인증 정보가 없습니다. 다시 로그인 해주세요.');
    return;
  }

  await fetchTaskTypes();
});
</script>

<style scoped>
.common-article {
  position: relative;
}

.feedback-article {
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.article-content-container {
  margin-top: 2rem;
}

.year-half-section {
  position: absolute;
  top: -1rem;
  gap: 1rem;
  right: 0;
}

.mid {
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  padding: 1rem;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.search-btn {
  margin-left: 1rem;
}
</style>
