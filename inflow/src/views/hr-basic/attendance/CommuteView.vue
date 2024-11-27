<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="90%">
    <SectionItem class="change-month-section" fld="row">
      <ChevronLeftButton h="3.6rem" w="3.6rem" bgc="transparent" c="#202020"></ChevronLeftButton>
      <span class="cur-month">{{ curMonth }}</span>
      <span class="description">출퇴근 내역</span>
      <ChevronRightButton h="3.6rem" w="3.6rem" bgc="transparent" c="#202020"></ChevronRightButton>
    </SectionItem>
    <SectionItem class="select-year-month-section" fld="row">
      <YearMonthDropDown @valid-date-selected="selectedDate"></YearMonthDropDown>
      <ButtonItem h="3.6rem" w="7.2rem" bgc="#003566" br="0.6rem" c="#fff" fs="1.6rem">조회</ButtonItem>
    </SectionItem>
  </FlexItem>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <TableItem class="commute-table" gtc="repeat(5, 1fr)">
      <TableRow>
        <TableCell th fs="1.6rem">일자</TableCell>
        <TableCell th fs="1.6rem">출근 시각</TableCell>
        <TableCell th fs="1.6rem">퇴근 시각</TableCell>
        <TableCell th fs="1.6rem">재택여부</TableCell>
        <TableCell th fs="1.6rem">초과근무 시간</TableCell>
      </TableRow>
      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableItem>
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ChevronLeftButton from '@/components/buttons/ChevronLeftButton.vue';
import ChevronRightButton from '@/components/buttons/ChevronRightButton.vue';
import YearMonthDropDown from '@/components/dropdowns/YearMonthDropDown.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const eid = ref(null);
const curPage = ref(1);
const curMonth = ref('2024-11');
const commuteList = ref([]);

const router = useRouter();

const fetchCommuteDate = async () => {
  const response = (
      await axios.get(`http://localhost:5000/api/commutes?eid=${eid.value}&page=${curPage.value}&date=${curMonth.value}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      )
    ).data;

  if (response.success) {
    commuteList.value = response.content;
    console.log(commuteList.value);
  }
}

const selectedDate = (date) => {
  console.log(date);
}

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (eid.value == null) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
  fetchCommuteDate();
})
</script>

<style scoped>
.content-header {
  position: relative;
  justify-content: center;
  align-items: center;
}

.content-body {
  width: 80%;
  margin-top: 3rem;
}

.cur-month {
  font-size: 2rem;
  font-weight: 700;
  color: #0063BF;
}

.description {
  font-size: 2rem;
  font-weight: 700;
  color: #202020;
}

.change-month-section {
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.change-month-section button {
  margin-top: 0.5rem;
}

.select-year-month-section {
  position: absolute;
  right: 0;
  bottom: 0;
  gap: 1rem;
}

</style>
