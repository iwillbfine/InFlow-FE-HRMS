<template>
  <FlexItem class="title-wrapper" w="90%" c="#003356" fs="2rem" fw="700">
    <span class="title">과제 등록</span>
  </FlexItem>
  <CommonArticle class="task-upload-article" label="개인/부서 과제 등록" w="90%">
    <TableItem gtc="3fr 6fr 8fr 2fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>유형</TableCell>
        <TableCell th fs="1.6rem">과제명</TableCell>
        <TableCell th fs="1.6rem">과제 내용</TableCell>
        <TableCell th fs="1.6rem" topr>가중치</TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="mid h-7" fs="1.6rem" botl>
          <DropdownItem :list="taskTypeList" w="12rem" placeholder="과제 유형"></DropdownItem>
        </TableCell>
        <TableCell class="mid h-7" fs="1.6rem">
          <FlexItem class="input-wrapper" h="100%" w="100%" bgc="#F8F8F8" b="1px solid #DBDBDB" br="0.1rem">
            <input name="task-name-input" type="text">
          </FlexItem>
        </TableCell>
        <TableCell class="mid h-7" fs="1.6rem">
          <FlexItem class="input-wrapper" h="100%" w="100%" bgc="#F8F8F8" b="1px solid #DBDBDB" br="0.1rem">
            <input name="task-content-input" type="text">
          </FlexItem>
        </TableCell>
        <TableCell class="mid h-7" fs="1.6rem" botr>
          <FlexItem class="input-wrapper" h="100%" w="100%" bgc="#F8F8F8" b="1px solid #DBDBDB" br="0.1rem">
            <input name="task-ratio-input" type="text">
          </FlexItem>
        </TableCell>
      </TableRow>
    </TableItem>
    <ButtonItem
      class="submit-btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      >등록</ButtonItem
    >
  </CommonArticle>
  <CommonArticle label="등록한 과제 목록" w="90%">
    <FlexItem class="year-half-section" fld="row" fs="1.6rem" fw="500" c="#003566">
      <YearDropDown @valid-date-selected="handleYearSelected" />
      <HalfDropdown @half-selected="handleHalfSelected" />
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
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import DropdownItem from '@/components/dropdowns/DropdownItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import { ref } from 'vue';

const selectedEmployeeId = ref(null);
const selectedYear = ref(null);
const selectedHalf = ref(null);

const taskTypeList = [
  { id: 1, name: '개인 과제' },
  { id: 2, name: '부서 과제' },
]

const handleSelected = (employee) => {
  selectedEmployeeId.value = typeof employee === 'object' ?
    parseInt(employee.department_member_id) :
    parseInt(employee);
};

const handleYearSelected = (year) => {
  selectedYear.value = year;
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
};
</script>

<style scoped>
.title-wrapper {
  margin-bottom: 3rem;
}

.common-article {
  position: relative;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.task-upload-article {
  margin-bottom: 2rem;
}

.input-wrapper {
  padding: 1rem;
}

.input-wrapper input {
  height: 100%;
  width: 100%;
}

.mid {
  justify-content: center;
  align-items: center;
}

.h-7 {
  height: 7rem !important;
}

.year-half-section {
  position: absolute;
  top: -1rem;
  gap: 1rem;
  right: 0;
}
</style>
