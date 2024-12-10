<template>
  <div class="wrapper">
    <FlexItem class="content-header" fld="row" h="6rem" w="96%">
      <ChangeMonthComponent
        class="child1"
        :cur-month="curMonth"
        description="인사발령 내역"
        @go-prev-month="goPrevMonth"
        @go-next-month="goNextMonth"
      />
    </FlexItem>

    <ButtonItem
      h="3.6rem"
      w="9rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      class="dBtn"
      @click="showDownload"
      >다운로드</ButtonItem
    >
    <FlexItem class="content-header-btns" fld="row" h="6rem" w="96%">
      <SelectAppTypeComponent
        :y="curMonth.split('-')[0]"
        :m="curMonth.split('-')[1]"
        class="select-data"
        @selected="goSelectedPoint"
      />
    </FlexItem>

    <div v-if="downloadModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <SelectPeriodComponent @selected="hideDownload"></SelectPeriodComponent>
      </div>
    </div>

    <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
      <div class="table-wrapper">
        <TableItem class="commute-table" gtc="repeat(9, 1fr)" br="0.5rem">
          <TableRow>
            <TableCell th fs="1.6rem">No</TableCell>
            <TableCell th fs="1.6rem">일자</TableCell>
            <TableCell th fs="1.6rem">유형</TableCell>
            <TableCell th fs="1.6rem">사원</TableCell>
            <TableCell th fs="1.6rem">부서</TableCell>
            <TableCell th fs="1.6rem">직무</TableCell>
            <TableCell th fs="1.6rem">직위</TableCell>
            <TableCell th fs="1.6rem">직책</TableCell>
            <TableCell th fs="1.6rem">담당자</TableCell>
          </TableRow>
          <TableRow
            v-if="!isEmpty"
            v-for="(item, index) in appointmentHistory"
            :key="index"
          >
            <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['appointed_at'].split(' ')[0]
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['appointment_item_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['employee_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['department_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['duty_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['position_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['role_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['authorizer_name']
            }}</TableCell>
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
        인사발령 내역이 존재하지 않습니다.
      </FlexItem>
    </FlexItem>
  </div>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import SelectAppTypeComponent from '@/components/common/SelectAppTypeComponent.vue';
import SelectPeriodComponent from '@/components/common/SelectPeriodComponent.vue';
import ChangeMonthComponent from '@/components/common/ChangeMonthComponent.vue';
import * as XLSX from 'xlsx';
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAppHistoryByMonth, getAppHistoryByPeriod } from '@/api/emp_attach';

const curMonth = ref('');
const appointmentHistory = ref([]);
const isEmpty = ref(true);

const router = useRouter();
const route = useRoute();
const selectedType = ref('전체');
const downloadModal = ref(false);

const appItems = ref({
  전체: 'all',
  강등: 'DEMO',
  승진: 'PROM',
  보직변경: 'RCHG',
  퇴직: 'RETI',
  특진: 'SPPR',
  부서이동: 'TRNS',
});

const fetchDate = async (date) => {
  if (!date || typeof date !== 'string' || date.split('-').length < 3) {
    date = getCurMonth();
  }

  const [year, month, type = '전체'] = date.split('-');
  curMonth.value = `${year}-${month}`;
  selectedType.value = type;

  const response = await getAppHistoryByMonth(year, month);

  if (response) {
    appointmentHistory.value =
      type === '전체'
        ? response
        : response.filter((row) => row['appointment_item_name'] === type);
    isEmpty.value = appointmentHistory.value.length === 0;
  } else {
    appointmentHistory.value = [];
    isEmpty.value = true;
  }
};

const getCurMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-전체`;
};

const navigateTo = (path, data) => {
  router.push({ path, query: { data } });
};

const goPrevMonth = (prevMonth) => {
  navigateTo('/hr-management/appointment/history', `${prevMonth}-전체`);
};

const goNextMonth = (nextMonth) => {
  const [endYear, endMonth] = getCurMonth().split('-').slice(0, 2);
  const [moveYear, moveMonth] = nextMonth.split('-');
  if (endYear > moveYear || (endYear === moveYear && endMonth >= moveMonth)) {
    navigateTo('/hr-management/appointment/history', `${nextMonth}-전체`);
    return;
  } else return;
};

const goSelectedPoint = (selectedData) => {
  navigateTo('/hr-management/appointment/history', selectedData);
};

const generateDateRange = (start, end) => {
  const startDate = new Date(start + '-01');
  const endDate = new Date(end + '-01');
  const dates = [];

  while (startDate <= endDate) {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    dates.push(`${year}-${month}`);
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return dates;
};

const showDownload = () => {
  downloadModal.value = true;
};

const periodData = ref([]);

const downloadExcel = (date) => {
  const titleRow = [[`발령(${date.type}) 이력 (${date.start} ~ ${date.end})`]];
  const columnHeaders = [
    ['no', '일자', '유형', '사원', '부서', '직무', '직위', '직책', '담당자'],
  ];
  const data = periodData.value.map((row, index) => [
    index + 1,
    row.appointed_at.split(' ')[0],
    row.appointment_item_name,
    row.employee_name,
    row.department_name,
    row.duty_name,
    row.position_name,
    row.role_name,
    row.authorizer_name,
  ]);
  const combinedData = [...titleRow, [], ...columnHeaders, ...data];

  const worksheet = XLSX.utils.aoa_to_sheet(combinedData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '발령 이력');

  XLSX.writeFile(
    workbook,
    `${date.start}_${date.end}_발령(${date.type})_이력.xlsx`
  );
};

const hideDownload = async (data) => {
  const daylist = generateDateRange(data.start, data.end);

  const results = await Promise.all(
    daylist.map(async (row) => {
      const [y, m] = row.split('-').map(Number);
      return getAppHistoryByPeriod(y, m, appItems.value[data.type]);
    })
  );

  results.forEach((tmp) => {
    periodData.value = [...periodData.value, ...tmp];
  });

  downloadExcel(data);

  downloadModal.value = false;
};

watch(
  () => route.query,
  (newData) => {
    curMonth.value = newData.data || getCurMonth();
    fetchDate(curMonth.value);
  },
  { immediate: true }
);

onMounted(() => {
  curMonth.value = getCurMonth();
  fetchDate(curMonth.value);
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  align-items: center;
}

.content-header {
  position: relative;
  justify-content: center;
  align-items: center;
}

.content-header-btns {
  display: flex;
  flex-direction: column !important;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
}

/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 최상위 표시 */
}

/* 모달 컨텐츠 */
.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%; /* 반응형 조정 */
  text-align: center;
}

.dBtn {
  position: absolute;
  padding: 0.3rem !important;
  right: 5rem;
  top: 5.5rem;
}

.select-data {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.select-data ::v-deep(.app-his-dropdown .dropdown .dropdown-header) {
  margin: none;
  padding-bottom: 0.25rem;
  height: 3.6rem;
  align-items: center;
}

.content-body {
  width: 96% !important;
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
