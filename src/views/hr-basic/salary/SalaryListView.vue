<template>
  <FlexItem class="content-header" fld="row" h="1rem" w="90%"> </FlexItem>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="salary-list" gtc="repeat(6, 1fr)" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.7rem">지급 연월</TableCell>
          <TableCell th fs="1.7rem">기본급</TableCell>
          <TableCell th fs="1.7rem">비과세</TableCell>
          <TableCell th fs="1.7rem">기타 수당 및 상여</TableCell>
          <TableCell th fs="1.7rem">공제 금액</TableCell>
          <TableCell th fs="1.7rem">급여 총액</TableCell>
        </TableRow>
        <TableRow v-for="(payment, index) in payments" :key="index">
          <TableCell class="mid" fs="1.6rem">{{
            formatDate(payment.paid_at)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(payment.monthly_salary)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(payment.non_taxable_salary)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(payment.bonus_and_allowance)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(payment.total_deductible)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(payment.actual_salary)
          }}</TableCell>
        </TableRow>
      </TableItem>
    </div>
    <PaginationComponent
      class="pagination"
      :data="pageInfo"
      @changePage="handlePageChange"
    ></PaginationComponent>
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import PaginationComponent from '@/components/common/PaginationComponent.vue';
import { getAllPayments } from '@/api/payroll.js';

const route = useRoute();
const router = useRouter();

// 상태 변수
const employeeId = ref(null);
const curPage = ref(1);
const payments = ref([]);
const pageInfo = ref({});

// api 호출 함수
const fetchPaymentData = async (employeeId, page) => {
  if (!employeeId) {
    console.error('유효하지 않은 파라미터');
    return;
  }
  try {
    const response = await getAllPayments(employeeId, page);
    payments.value = response.content.elements || [];
    pageInfo.value = response.content;
  } catch (error) {
    console.error('Failed to fetch payments', error);
  }
};

const handlePageChange = (page) => {
  curPage.value = page;
  fetchPaymentData(employeeId.value, curPage.value);
  router.push({
    name: 'hr-basic-salary-list',
    params: { employeeId: employeeId.value },
    query: { page: curPage.value },
  });
};

watch(
  () => route.query.page,
  (newPage) => {
    curPage.value = parseInt(newPage, 10) || 1;
    fetchPaymentData(employeeId.value, curPage.value);
  },
  { immediate: true }
);

const formatDate = (value) => {
  if (!value) return '지급일: -';
  const [date] = value.split('T');
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

const formatCurrency = (value) => `${value.toLocaleString()} 원`;

onMounted(() => {
  employeeId.value = localStorage.getItem('employeeId');
  curPage.value = parseInt(route.query.page, 10) || 1;

  if (!employeeId.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  fetchPaymentData(employeeId.value, curPage.value);
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

.mid {
  justify-content: center;
  align-items: center;
}

.amount {
  justify-content: flex-end;
  align-items: center;
}

.pagination {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
