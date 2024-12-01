<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="90%">
    <ChangeMonthComponent
      :cur-month="curMonth"
      description="출퇴근 내역"
      @go-prev-month="goPrevMonth"
      @go-next-month="goNextMonth"
    >
    </ChangeMonthComponent>
    <SelectYearMonthComponent
      class="select-year-month-section"
      @month-selected="goSelectedMonth"
    ></SelectYearMonthComponent>
  </FlexItem>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="commute-table" gtc="repeat(5, 1fr)">
        <TableRow>
          <TableCell th fs="1.6rem" topl>일자</TableCell>
          <TableCell th fs="1.6rem">출근 시각</TableCell>
          <TableCell th fs="1.6rem">퇴근 시각</TableCell>
          <TableCell th fs="1.6rem">재택여부</TableCell>
          <TableCell th fs="1.6rem" topr>초과근무 시간</TableCell>
        </TableRow>
        <TableRow
          v-for="(item, index) in commuteList"
          v-if="!isEmpty"
          :key="index"
        >
          <TableCell
            class="mid"
            fs="1.6rem"
            :botl="index === commuteList.length - 1"
            >{{ parseDate(item.start_time) }}</TableCell
          >
          <TableCell class="mid" fs="1.6rem">{{
            parseTime(item.start_time)
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            parseTime(item.end_time)
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            item.remote_status
          }}</TableCell>
          <TableCell
            class="mid"
            fs="1.6rem"
            :botr="index === commuteList.length - 1"
            >{{
              item.overtime
                ? Math.trunc(item.overtime / 60) +
                  '시간 ' +
                  (item.overtime % 60) +
                  '분'
                : '-'
            }}</TableCell
          >
        </TableRow>
      </TableItem>
    </div>
    <FlexItem
      v-if="isEmpty"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.6rem"
    >
      출퇴근 내역이 존재하지 않습니다.
    </FlexItem>
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import SelectYearMonthComponent from '@/components/common/SelectYearMonthComponent.vue';
import ChangeMonthComponent from '@/components/common/ChangeMonthComponent.vue';
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getCommutesByEmployeeId } from '@/api/attendance';

const eid = ref(null);
const curMonth = ref('');
const commuteList = ref([]);
const isEmpty = ref(true);

const router = useRouter();
const route = useRoute();

const fetchCommuteData = async (eid, date) => {
  const response = await getCommutesByEmployeeId(eid, date);
  if (response.success) {
    commuteList.value = response.content;
    isEmpty.value = commuteList.value.length === 0 ? true : false;
  } else {
    commuteList.value = [];
    isEmpty.value = true;
  }
};

// 이번 달 가져오기
const getCurMonth = () => {
  const today = new Date();

  const year = today.getFullYear(); // 연도 가져오기
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 가져오기 (0부터 시작하므로 +1, 두 자리로 맞춤)

  const curMonth = `${year}-${month}`;
  return curMonth;
};

// 일까지 파싱
const parseDate = (dateStr) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
  const day = date.getDate();

  const formattedDate = `${year}년 ${month}월 ${day}일`;
  return formattedDate;
};

// 시간만 파싱
const parseTime = (dateStr) => {
  const date = new Date(dateStr);

  const hours = String(date.getHours()).padStart(2, '0'); // 2자리로 패딩
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formattedTime = `${hours}시 ${minutes}분`;
  return formattedTime;
};

const goPrevMonth = (prevMonth) => {
  router.push({
    path: '/hr-basic/attendance/commute',
    query: { date: prevMonth },
  });
};

const goNextMonth = (nextMonth) => {
  router.push({
    path: '/hr-basic/attendance/commute',
    query: { date: nextMonth },
  });
};

const goSelectedMonth = (selectedMonth) => {
  router.push({
    path: '/hr-basic/attendance/commute',
    query: { date: selectedMonth },
  });
};

// URL 쿼리 변화를 감지하는 watcher
watch(
  () => route.query,
  (newQuery) => {
    eid.value = localStorage.getItem('employeeId');
    curMonth.value = newQuery.date || getCurMonth();
    fetchCommuteData(eid.value, curMonth.value);
  },
  { immediate: true }
);

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
});
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

.empty-message {
  justify-content: center;
  align-items: center;
}
</style>
