<template>
  <SectionItem class="assign-section" w="calc(100% - 36rem)">
    <CommonArticle label="부서원 과제 할당">
      <FlexItem class="year-half-section" fld="row" fs="1.6rem" fw="500" c="#003566">
        <YearDropDown @valid-date-selected="handleYearSelected" />
        <HalfDropdown @half-selected="handleHalfSelected" />
      </FlexItem>
      <FlexItem
        class="profile"
        fld="row"
        w="100%"
        h="14rem"
        bgc="#fff"
        br="0.6rem"
      >
        <FigureItem
          v-if="selectedEmployee"
          class="profile-img-wrapper"
          h="100%"
          w="10.5rem"
        >
          <img :src="selectedEmployee.profile_image_url" alt="Profile Image" />
        </FigureItem>
        <FlexItem
          v-if="selectedEmployee"
          class="emp-info"
          fld="column"
          h="100%"
        >
          <span class="emphasize">{{ selectedEmployee.employee_name }}</span>
          <span class="normal">{{ selectedEmployee.employee_number }}</span>
          <span class="normal">{{ selectedEmployee.department_path }}</span>
        </FlexItem>
        <FlexItem
          v-else
          class="empty-message"
          fld="row"
          h="100%"
          w="100%"
          fs="2rem"
        >
          사원을 선택해주세요.
        </FlexItem>
      </FlexItem>
      <TableItem gtc="2fr 3fr 6fr 8fr 2fr">
        <TableRow>
          <TableCell th fs="1.6rem" topl>No</TableCell>
          <TableCell th fs="1.6rem">유형</TableCell>
          <TableCell th fs="1.6rem">과제명</TableCell>
          <TableCell th fs="1.6rem" topr>과제 내용</TableCell>
          <TableCell th fs="1.6rem">가중치</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="mid" fs="1.6rem">1</TableCell>
          <TableCell class="mid" fs="1.6rem">개인 과제</TableCell>
          <TableCell class="mid" fs="1.6rem">과제 이름입니다.</TableCell>
          <TableCell class="mid" fs="1.6rem">과제 내용입니다.</TableCell>
          <TableCell class="mid" fs="1.6rem">0.5</TableCell>
        </TableRow>
      </TableItem>
    </CommonArticle>
    <SearchEmployeeComponent @employee-selected="handleSelected"></SearchEmployeeComponent>
  </SectionItem>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import FigureItem from '@/components/semantic/FigureItem.vue';
import SearchEmployeeComponent from '@/components/common/SearchEmployeeComponent.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import { createFeedback, findFinalGrade, findFeedbacks, updateFeedback } from '@/api/evaluation';

// 상태 관리
const selectedEmployee = ref(null);
const selectedYear = ref(null);
const selectedHalf = ref(null);
const isLoading = ref(false);
const feedbackData = ref(null);

// 버튼 텍스트 계산
const buttonText = computed(() => {
  return feedbackData.value?.feedback_id ? '수정' : '등록';
});

const handleSelected = (employee) => {
  selectedEmployee.value = employee;
}

const handleYearSelected = (year) => {
  selectedYear.value = year;
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
};
</script>

<style scoped>
.emphasize {
  font-size: 2.2rem;
  font-weight: 500;
}

.normal {
  font-size: 1.2rem;
  font-weight: 400;
}

.h-5 {
height: 5rem !important;
}

.h-12 {
height: 12rem !important;
}

.pl-2 {
padding-left: 2rem;
}

.mid {
  justify-content: center;
  align-items: center;
}

.common-article {
  position: relative;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.profile {
  padding: 1rem;
  gap: 3rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
  margin-bottom: 4rem;
}

.profile-img-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.emp-info {
  justify-content: center;
  gap: 1rem;
}

.feedback-input {
width: 100%;
height: 100%;
padding: 1rem;
border: 1px solid #ccc;
border-radius: 0.4rem;
resize: none;
font-size: 1.4rem;
}

.submit-btn {
margin-top: 3.2rem;
align-self: center;
}

.assign-section {
margin-left: 36rem;
padding: 1rem 2rem;
}

.year-half-section {
position: absolute;
top: 0;
right: 0;
margin-top: -1rem;
gap: 1rem;
}

.created-feedback {
margin-top: 2rem;
box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.1);
height: 15rem !important;
}

.feedback-content {
font-size: 1.4rem;
line-height: 1.6;
margin-bottom: 1rem;
word-wrap: break-word;  /* 긴 단어가 넘어갈 때 줄바꿈 */
word-break: break-word;  /* 긴 단어가 컨테이너를 넘지 않도록 강제로 줄바꿈 */
overflow-wrap: break-word;  /* 텍스트가 컨테이너를 넘지 않도록 줄바꿈 */
white-space: pre-wrap;  /* 줄바꿈을 유지하면서 긴 텍스트가 자동으로 넘어가도록 함 */
max-height: 100%;  /* 최대 높이를 부모 요소에 맞춤 */
overflow-y: auto;
padding: 1.5rem;  /* 내부 여백 추가*/
}
.center-message {
text-align: center;
color: #888;
font-size: 1.6rem;
}

.created-feedback {
margin-top: 2rem;
box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.1);
height: 15rem;
display: flex;  /* Flexbox 사용 */
flex-direction: column;
justify-content: center;  /* 세로 가운데 정렬 */
align-items: center;  /* 가로 가운데 정렬 */
}
</style>
