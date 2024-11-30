<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="90%">
    <SelectYearMonthComponent class="select-month-year-section" @month-selected="goSelectedMonth"></SelectYearMonthComponent>
  </FlexItem>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="salary-table" gtc="repeat(4, 1fr)" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.8rem" gc="span 4">{{ formattedPaidAt }}</TableCell>
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

const router = useRouter();
const route = useRoute();

const employeeId = ref(null);
const year = ref(null);
const month = ref(null);
const payments = ref({});

const fetchPaymentsData = async () => {
  if (!employeeId.value || !year.value || !month.value) {
    console.error('사원 id, 연, 월 정보가 필요합니다.');
    return;
  }

  try {
    const response = await getPaymentByEmployeeIdAndYearAndMonth(
      employeeId.value,
      year.value,
      month.value
    );
    payments.value = response.content || {};
  } catch(error) {
    console.error('Failed to fetch Data:', error);
  }
};

const goSelectedMonth = (selectedDate) => {
  const [selectedYear, selectedMonth] = selectedDate.split('-');
  year.value = selectedYear;
  month.value = selectedMonth;

  router.push({
    name: 'hr-basic-salary-detail',
    params: { employeeId: employeeId.value },
    query: { year: year.value, month: month.value },
  });
};

watch(
  () => route.query,
  () => {
    year.value = route.query.year || new Date().getFullYear();
    month.value = route.query.month || new Date().getMonth() + 1;
    employeeId.value = route.params.employeeId;
    fetchPaymentsData();
  },
  { immediate: true }
);
const formattedPaidAt = computed(() => formatDate(payments.value.paid_at));

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

const formattedTotalPayment = computed(() =>
  formatCurrency(
    (payments.value.monthly_salary || 0) +
    (payments.value.non_taxable_amount || 0) +
    (payments.value.overtime_allowance || 0) +
    (payments.value.annual_vacation_allowance || 0) +
    (payments.value.bonus || 0)
  )
);

const formattedTotalDeduction = computed(() => formatCurrency(payments.value.total_deductible || 0));
const formattedActualPayment = computed(() => formatCurrency(payments.value.actual_salary || 0));

// 통화 포맷팅 함수
const formatCurrency = (value) => `${value.toLocaleString()} 원`;
const formatDate = (value) => {
  if (!value) return '지급일: -';
  const [date] = value.split('T');
  const [year, month, day] = date.split('-');
  return `지급일: ${year}년 ${month}월 ${day}일`;
}

onMounted(() => {
  employeeId.value = route.params.employeeId;
  year.value = route.query.year || new Date().getFullYear();
  month.value = route.query.month || new Date().getMonth() + 1;
  fetchPaymentsData();
})
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
