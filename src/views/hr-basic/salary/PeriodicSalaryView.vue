<template>
  <FlexItem class="content-header" fld="row" h="1rem" w="90%">
    <YearMonthDropDown
      label="시작 월"
      @valid-date-selected="updateStartMonth"
    ></YearMonthDropDown>
    <div class="text">~</div>
    <YearMonthDropDown
      label="종료 월"
      @valid-date-selected="updateEndMonth"
    ></YearMonthDropDown>
    <ButtonItem
      class="btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      @click="handleOnclick"
    >
      조회
    </ButtonItem>
  </FlexItem>
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
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import YearMonthDropDown from '@/components/dropdowns/YearMonthDropDown.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import { ref } from 'vue';
import { getPeriodicPayments } from '@/api/payroll.js';

const payments = ref([]);
const startDate = ref('');
const endDate = ref('');

// 시작 월 선택
const updateStartMonth = (date) => {
  startDate.value = date;
};

// 종료 월 선택
const updateEndMonth = (date) => {
  endDate.value = date;
};

// 조회 버튼 클릭
const handleOnclick = async () => {
  if (!startDate.value || !endDate.value) {
    alert('시작 월과 종료 월을 모두 선택해주세요.');
    return;
  }

  try {
    const employeeId = localStorage.getItem('employeeId');
    if (!employeeId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const response = await getPeriodicPayments(
      employeeId,
      startDate.value,
      endDate.value
    );
    payments.value = response.content || [];
  } catch (error) {
    console.error('급여 데이터를 가져오는 중 오류 발생:', error);
    payments.value = [];
  }
};

const formatDate = (value) => {
  if (!value) return '지급일: -';
  const [date] = value.split('T');
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

const formatCurrency = (value) => `${value.toLocaleString()} 원`;
</script>

<style scoped>
.content-header {
  margin-top: 2rem;
  justify-content: flex-end;
  align-items: center;
}

.text {
  margin-left: 2rem;
  margin-right: 2rem;
  font-size: 2rem;
}

.btn {
  margin-left: 2rem;
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
</style>
