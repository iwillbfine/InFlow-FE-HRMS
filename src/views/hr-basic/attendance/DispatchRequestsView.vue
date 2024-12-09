<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="90%">
    <ArrowLeftButton
      h="3.6rem"
      w="3.6rem"
      br="50%"
      @click="goBack"
    ></ArrowLeftButton>
    <ChangeMonthComponent
      :cur-month="curMonth"
      description="파견 신청 내역"
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
      <TableItem gtc="1.5fr 3fr 3fr 1.5fr 1fr 1.25fr">
        <TableRow>
          <TableCell th fs="1.6rem" topl>파견지</TableCell>
          <TableCell th fs="1.6rem">파견 기간</TableCell>
          <TableCell th fs="1.6rem">파견 사유</TableCell>
          <TableCell th fs="1.6rem">신청일</TableCell>
          <TableCell th fs="1.6rem">상태</TableCell>
          <TableCell th fs="1.6rem" topr>취소 요청</TableCell>
        </TableRow>
        <TableRow
          v-for="(item, index) in dispatchRequestList"
          v-if="!isEmpty"
          :key="index"
        >
          <TableCell
            class="mid"
            fs="1.6rem"
            :botl="index === dispatchRequestList.length - 1"
            >{{ item.destination }}</TableCell
          >
          <TableCell class="mid" fs="1.6rem">{{
            parseDate(item.start_date) + ' ~ ' + parseDate(item.end_date)
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            item.request_reason
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            parseDate(item.created_at)
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            parseRequestStatus(item.request_status)
          }}</TableCell>
          <TableCell
            class="mid"
            fs="1.6rem"
            :botr="index === dispatchRequestList.length - 1"
          >
            <span v-if="item.cancel_status == 'Y'">취소 완료</span>
            <ButtonItem
              v-else-if="
                item.cancel_status == 'N' && item.request_status == 'WAIT'
              "
              h="3rem"
              w="6.4rem"
              br="0.4rem"
              fs="1.2rem"
              bgc="#003566"
              c="#fff"
              @click="toggleCancelRequestModal(item)"
            >
              취소 요청
            </ButtonItem>
            <span v-else>-</span>
          </TableCell>
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
      신청 내역이 존재하지 않습니다.
    </FlexItem>
    <PaginationComponent
      :data="pageInfo"
      @change-page="handleChangePage"
    ></PaginationComponent>
  </FlexItem>
  <CancelRequestModal
    v-if="isModalOpen"
    :item="tryCancelItem"
    @close="toggleCancelRequestModal"
  ></CancelRequestModal>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import SelectYearMonthComponent from '@/components/common/SelectYearMonthComponent.vue';
import ChangeMonthComponent from '@/components/common/ChangeMonthComponent.vue';
import PaginationComponent from '@/components/common/PaginationComponent.vue';
import ArrowLeftButton from '@/components/buttons/ArrowLeftButton.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import CancelRequestModal from '@/components/attendance/CancelRequestModal.vue';
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getDispatchRequestsByEmployeeId } from '@/api/attendance';

const eid = ref(null);
const curPage = ref(1);
const curMonth = ref('');
const dispatchRequestList = ref([]);
const pageInfo = ref({});
const isEmpty = ref(true);
const isModalOpen = ref(false);

const tryCancelItem = ref(null);

const router = useRouter();
const route = useRoute();

const fetchDispatchRequestData = async (eid, page, date) => {
  const response = await getDispatchRequestsByEmployeeId(eid, page, date);
  if (response.success) {
    dispatchRequestList.value = response.content.elements;
    pageInfo.value = response.content;
    isEmpty.value = dispatchRequestList.value.length === 0 ? true : false;
  } else {
    dispatchRequestList.value = [];
    pageInfo.value = {};
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

const parseRequestStatus = (status) => {
  switch (status) {
    case 'ACCEPT':
      return '승인됨';
    case 'REJECT':
      return '반려됨';
    default:
      return '대기중';
  }
};

const toggleCancelRequestModal = (item) => {
  tryCancelItem.value = item;
  isModalOpen.value = !isModalOpen.value;
};

const handleChangePage = (page) => {
  curPage.value = page;
  router.push({
    path: '/hr-basic/attendance/dispatch/requests',
    query: { page: curPage.value, date: curMonth.value },
  });
};

const goPrevMonth = (prevMonth) => {
  curPage.value = 1;
  router.push({
    path: '/hr-basic/attendance/dispatch/requests',
    query: { page: curPage.value, date: prevMonth },
  });
};

const goNextMonth = (nextMonth) => {
  curPage.value = 1;
  router.push({
    path: '/hr-basic/attendance/dispatch/requests',
    query: { page: curPage.value, date: nextMonth },
  });
};

const goSelectedMonth = (selectedMonth) => {
  curPage.value = 1;
  router.push({
    path: '/hr-basic/attendance/dispatch/requests',
    query: { page: curPage.value, date: selectedMonth },
  });
};

const goBack = () => {
  router.push('/hr-basic/attendance/dispatch');
};

// URL 쿼리 변화를 감지하는 watcher
watch(
  () => route.query,
  (newQuery) => {
    eid.value = localStorage.getItem('employeeId');
    curPage.value = newQuery.page || 1;
    curMonth.value = newQuery.date || getCurMonth();
    fetchDispatchRequestData(eid.value, curPage.value, curMonth.value);
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

.arrow-left-btn {
  position: absolute;
  left: 0;
  bottom: 0;
  gap: 1rem;
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

.pagination {
  min-height: 8rem;
}
</style>
