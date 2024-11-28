<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="90%">
    <SectionItem class="change-month-section" fld="row">
      <ChevronLeftButton h="3.6rem" w="3.6rem" bgc="transparent" c="#202020" @click="goPrevMonth"></ChevronLeftButton>
      <span class="cur-month">{{ parseMonth(curMonth) }}</span>
      <span class="description">출퇴근 내역</span>
      <ChevronRightButton h="3.6rem" w="3.6rem" bgc="transparent" c="#202020" @click="goNextMonth"></ChevronRightButton>
    </SectionItem>
    <SectionItem class="select-year-month-section" fld="row">
      <YearMonthDropDown @valid-date-selected="selectedDate"></YearMonthDropDown>
      <ButtonItem h="3.6rem" w="7.2rem" bgc="#003566" br="0.6rem" c="#fff" fs="1.6rem" @click="handleOnclick">조회</ButtonItem>
    </SectionItem>
  </FlexItem>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="commute-table" gtc="repeat(5, 1fr)">
        <TableRow>
          <TableCell th fs="1.6rem">일자</TableCell>
          <TableCell th fs="1.6rem">출근 시각</TableCell>
          <TableCell th fs="1.6rem">퇴근 시각</TableCell>
          <TableCell th fs="1.6rem">재택여부</TableCell>
          <TableCell th fs="1.6rem">초과근무 시간</TableCell>
        </TableRow>
        <TableRow v-if="!isEmpty" v-for="(item, index) in commuteList">
          <TableCell class="mid" fs="1.6rem">{{ parseDate(item.start_time) }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ parseTime(item.start_time) }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ parseTime(item.end_time) }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item.remote_status }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item.overtime ? Math.trunc(item.overtime / 60) + "시간 " + (item.overtime%60) + "분" : "-" }}</TableCell>
        </TableRow>
      </TableItem>
    </div>
    <FlexItem v-if="isEmpty" class="empty-message" fld="row" h="6rem" w="100%" fs="1.6rem">출퇴근 내역이 존재하지 않습니다.</FlexItem>
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
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const eid = ref(null);
const curMonth = ref('');
const selectedMonth = ref('');
const commuteList = ref([]);
const isEmpty = ref(true);

const router = useRouter();
const route = useRoute();

const fetchCommuteDate = async (eid, date) => {
  const response = (
      await axios.get(`http://localhost:5000/api/commutes?eid=${eid}&date=${date}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      )
    ).data;

  if (response.success) {
    commuteList.value = response.content;
    if (commuteList.value.isEmpty) isEmpty.value = true;
    else isEmpty.value = false;
  } else {
    commuteList.value = []
    isEmpty.value = true;
  }
}

// 이번 달 가져오기
const getCurMonth = () => {
  const today = new Date();

  const year = today.getFullYear(); // 연도 가져오기
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 가져오기 (0부터 시작하므로 +1, 두 자리로 맞춤)

  const curMonth = `${year}-${month}`
  return curMonth;
}

// 일까지 파싱
const parseDate = (dateStr) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
  const day = date.getDate();

  const formattedDate = `${year}년 ${month}월 ${day}일`;
  return formattedDate;
}

// 월까지 파싱
const parseMonth = (dateStr) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요

  const formattedMonth = `${year}년 ${month}월`;
  return formattedMonth;
}

// 시간만 파싱
const parseTime = (dateStr) => {
  const date = new Date(dateStr);

  const hours = String(date.getHours()).padStart(2, "0"); // 2자리로 패딩
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTime = `${hours}시 ${minutes}분`;
  return formattedTime;
}

// 연월 선택될 때 호출
const selectedDate = (date) => {
  selectedMonth.value = date;
}

// 조회 버튼 클릭시 호출
const handleOnclick = () => {
  router.push({ path: '/hr-basic/attendance/commute', query: { date: selectedMonth.value } })
}

// 이전 달로 이동
const goPrevMonth = () => {
  const curDate = new Date(curMonth.value + "-01"); // 현재 날짜 생성
  curDate.setMonth(curDate.getMonth() - 1); // 이전 달로 이동

  const prevMonth = curDate.getFullYear() + '-' + String(curDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  router.push({ path: '/hr-basic/attendance/commute', query: { date: prevMonth } });
}

// 다음 달로 이동
const goNextMonth = () => {
  const curDate = new Date(curMonth.value + "-01"); // 현재 날짜 생성
  curDate.setMonth(curDate.getMonth() + 1); // 다음 달로 이동

  const nextMonth = curDate.getFullYear() + '-' + String(curDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  router.push({ path: '/hr-basic/attendance/commute', query: { date: nextMonth } });
}

// URL 쿼리 변화를 감지하는 watcher
watch(
  () => route.query,
  (newQuery) => {
    eid.value = localStorage.getItem('employeeId');
    curMonth.value = newQuery.date || getCurMonth();
    fetchCommuteDate(eid.value, curMonth.value)
  },
  { immediate: true }
)

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (eid.value == null) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
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
  margin-top: 2.5rem;
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

.mid {
  justify-content: center;
  align-items: center;
}

.table-wrapper {
  padding: 1.5rem;
  max-height: 37rem;
  overflow-y: auto;
}

.empty-message {
  justify-content: center;
  align-items: center;
}
</style>
