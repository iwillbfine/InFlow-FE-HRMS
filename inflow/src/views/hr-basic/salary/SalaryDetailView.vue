<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="90%">
    <SelectYearMonthComponent class="select-month-year-section" @month-selected="goSelectMonth"></SelectYearMonthComponent>
  </FlexItem>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="salary-table" gtc="repeat(4, 1fr)" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.8rem" gc="span 2">지급 내역</TableCell>
          <TableCell th fs="1.8rem" gc="span 2">공제 내역</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="mid" fs="1.7rem">기본급</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedMonthlySalary }}</TableCell>
          <TableCell class="mid" fs="1.7rem">국민연금</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedNationalPension }}</TableCell>
          <TableCell class="mid" fs="1.7rem">비과세</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedNonTaxable }}</TableCell>
          <TableCell class="mid" fs="1.7rem">건강보험</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedHealthInsurance }}</TableCell>
          <TableCell class="mid" fs="1.7rem">초과근무수당</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedOvertimeAllowance }}</TableCell>
          <TableCell class="mid" fs="1.7rem">장기요양</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedLongTermCare }}</TableCell>
          <TableCell class="mid" fs="1.7rem">연차수당</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedVacationAllowance }}</TableCell>
          <TableCell class="mid" fs="1.7rem">고용보험</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedEmpInsurance }}</TableCell>
          <TableCell class="mid" fs="1.7rem">상여금</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedBonus }}</TableCell>
          <TableCell class="mid" fs="1.7rem">소득세</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedIncomeTax }}</TableCell>
          <TableCell class="mid" fs="1.7rem"></TableCell>
          <TableCell class="amount" fs="1.7rem"></TableCell>
          <TableCell class="mid" fs="1.7rem">지방소득세</TableCell>
          <TableCell class="amount" fs="1.7rem">{{ formattedLocalTax }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="total-pay" fs="1.8rem" fw="bold" bgc="#f8f8f8">지급 총액</TableCell>
          <TableCell class="total-pay-amount" fw="bold" fs="1.8rem">{{ formattedTotalPayment }}</TableCell>
          <TableCell class="total-pay" fs="1.8rem" fw="bold" bgc="#f8f8f8">공제 총액</TableCell>
          <TableCell class="total-pay-amount" fw="bold" fs="1.8rem">{{ formattedTotalDeduction }}</TableCell>
          <TableCell class="total" fs="1.9rem" fw="bold" bgc="#f8f8f8">차인 지급액</TableCell>
          <TableCell class="total-amount" fs="1.9rem" fw="bold" gc="span 3">{{ formattedActualPayment }}</TableCell>
        </TableRow>
      </TableItem>
    </div>
  </FlexItem>
</template>

<script setup>
import SelectYearMonthComponent from '@/components/common/SelectYearMonthComponent.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getPaymentByEmployeeIdAndYearAndMonth } from '@/api/payroll';

// 상태 변수
const eid = ref(null);
const curMonth = ref('');
const curYear = ref('');
const payments = ref({})
const isEmpty = ref(false);

const router = useRouter();
const route = useRoute();

// 총액 계산
const formattedMonthlySalary = computed(() => formatCurrency(payments.value.monthly_salary || 0));
const formattedNonTaxable = computed(() => formatCurrency(payments.value.non_taxable_amount || 0));
const formattedOvertimeAllowance = computed(() => formatCurrency(payments.value.overtime_allowance || 0));
const formattedVacationAllowance = computed(() => formatCurrency(payments.value.annual_vacation_allowance || 0));
const formattedBonus = computed(() => formatCurrency(payments.value.bonus || 0));
const formattedNationalPension = computed(() => formatCurrency(payments.value.national_pension_deductible || 0));
const formattedHealthInsurance = computed(() => formatCurrency(payments.value.health_insurance_deductible || 0));
const formattedLongTermCare = computed(() => formatCurrency(payments.value.long_term_care_insurance_deductible || 0));
const formattedEmpInsurance = computed(() => formatCurrency(payments.value.employment_insurance_deductible || 0));
const formattedIncomeTax = computed(() => formatCurrency(payments.value.income_tax_deductible - payments.value.child_deductible || 0));
const formattedLocalTax = computed(() => formatCurrency(payments.value.local_income_tax_deductible || 0));
const formattedTotalPayment = computed(() => formatCurrency(payments.value.monthly_salary + payments.value.non_taxable_amount || 0));
const formattedTotalDeduction = computed(() => formatCurrency(payments.value.total_deductible || 0));
const formattedActualPayment = computed(() => formatCurrency(payments.value.actual_salary || 0));

const fetchPaymentDate = async(eid, year, month) => {
  try {
    const response = await getPaymentByEmployeeIdAndYearAndMonth(eid, year, month);
    if (response.success) {
      payments.value = response.content;
      isEmpty.value = !response.content || Object.keys(response.content).length === 0;
    } else {
      payments.value = {};
      isEmpty.value = true;
    }
  } catch (error) {
    console.error('api 호출 오류: ', error);
    payments.value = {};
    isEmpty.value = true;
  }
};

const goSelectMonth = (selectedMonth) => {
  if (!selectedMonth) {
    console.error('선택한 날짜가 유효하지 않습니다.', selectedMonth);
    return;
  }

  // 파싱
  const [year, month] = selectedMonth.split('-');

  if (!year || !month) {
    console.error('유효하지 않은 연, 월입니다.', { year, month });
    return;
  }

  console.log('파싱된 연월: ', { year, month });

  router.push({
    path: '/hr-basic/salary/salary-detail',
    query: { year, month }
  });
};

const getCurYear = () => new Date().getFullYear();
const getCurMonth = () => new Date().getMonth() + 1;

watch(
  () => route.query,
  (newQuery) => {
    const year = parseInt(newQuery.year, 10) || getCurYear();
    const month = parseInt(newQuery.month, 10) || getCurMonth();

    curYear.value = year;
    curMonth.value = month;

    if (eid.value) {
      fetchPaymentDate(eid.value, year, month);
    }
  },
  { immediate: true }
);

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }
})

const formatCurrency = (value) => `${value.toLocaleString()} 원`;

</script>

<style scoped>

.content-header {
  position: relative;
  justify-content: flex-end;
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

.amount {
  justify-content: flex-end;
  align-items: center;
}

.total-pay {
  justify-content: center;
  align-items: center;
}

.total-pay-amount {
  justify-content: flex-end;
  align-items: center;
}

.total-amount {
  justify-content: flex-end;
  align-items: center;
}

.total {
  justify-content: center;
  align-items: center;
}

</style>
