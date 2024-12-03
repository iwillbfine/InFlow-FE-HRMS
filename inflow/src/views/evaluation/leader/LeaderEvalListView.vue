<template>
  <CommonArticle class="feedback-article" label="평가 결과" w="90%">
    <FlexItem class="year-half-section" fld="row" fs="1.6rem" fw="500" c="#003566">
      <YearDropDown @valid-date-selected="handleYearSelected" />
      <HalfDropdown @half-selected="handleHalfSelected" />
    </FlexItem>
    <FlexItem class="article-content-container" fld="row" h="20rem">
      <FlexItem class="feedback-wrapper" w="70%" br="0.6rem" bgc="#EEF4FA" c="#0D0D0D" fs="1.5rem" fw="400">
        <span>dfasdfasdasdfsadffffffffffffffffffffffffffffffffasdfadsfsadfsadfsadfasdfasdfasdfdasf</span>
      </FlexItem>
      <FlexItem class="grade-wrapper" fld="column" w="30%" br="0.6rem" b="1px solid #003566" bgc="#fff" c="#003566">
        <span class="grade-label">최종 등급</span>
        <span class="grade">A</span>
      </FlexItem>
    </FlexItem>
  </CommonArticle>
  <CommonArticle class="task-list-article" label="평가 상세" w="90%">
    <TableItem gtc="1fr 2fr 1fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>유형</TableCell>
        <TableCell th fs="1.6rem">과제명</TableCell>
        <TableCell th fs="1.6rem" topr>과제별 등급</TableCell>
      </TableRow>
      <TableRow v-for="(item, index) in taskList" :key="index">
        <TableCell class="mid" fs="1.6rem" :botl="index === taskList.length-1">{{ getTaskTypeName(item.task_type_id) }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ item.task_name }}</TableCell>
        <TableCell class="mid" fs="1.6rem" :botr="index === taskList.length-1">{{ item.task_grade }}</TableCell>
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
import { ref } from 'vue';

const selectedYear = ref(null);
const selectedHalf = ref(null);

const taskTypes = ref([
  { task_type_id: 1, task_type_name: '개인 과제' }
]);

const taskList = ref([
  {
    task_type_id: 1,
    task_name: '과제 테스트',
    task_grade: 'A',
  },
  {
    task_type_id: 1,
    task_name: '과제 테스트2',
    task_grade: 'B',
  },
  {
    task_type_id: 1,
    task_name: '과제 테스트3',
    task_grade: 'C',
  },
  {
    task_type_id: 1,
    task_name: '과제 테스트4',
    task_grade: 'A',
  },
  {
    task_type_id: 1,
    task_name: '과제 테스트5',
    task_grade: 'B',
  },
  {
    task_type_id: 1,
    task_name: '과제 테스트6',
    task_grade: 'C',
  },
])

// 과제 유형 이름 가져오기
const getTaskTypeName = (typeId) => {
  const foundType = taskTypes.value.find((type) => type.task_type_id === typeId);
  return foundType ? foundType.task_type_name : '-';
};

const handleYearSelected = (year) => {
  selectedYear.value = year;
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
};
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
  font-size: 9rem;
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
