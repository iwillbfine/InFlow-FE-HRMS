<template>
  <FlexItem class="content-header" fld="row" h="1rem" w="90%"> </FlexItem>
  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="work-day-table" gtc="repeat(6, 1fr)" br="0.5rem">
        <TableRow>
          <TableCell
            class="date"
            fs="1.7rem"
            gc="span 2"
            fw="bold"
            bgc="#f8f8f8"
            >입사일</TableCell
          >
          <TableCell class="mid" fs="1.7rem" gc="span 4">{{
            formatDate(workingDay.join_date)
          }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            class="date"
            fs="1.7rem"
            gc="span 2"
            fw="bold"
            bgc="#f8f8f8"
            >퇴직일</TableCell
          >
          <TableCell class="mid" fs="1.7rem" gc="span 4">{{
            formatDate(workingDay.severance_date)
          }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            class="date"
            fs="1.7rem"
            gc="span 2"
            fw="bold"
            bgc="#f8f8f8"
            >총 재직일</TableCell
          >
          <TableCell class="mid" fs="1.7rem" gc="span 4"
            >{{ workingDay.total_working_days }}일</TableCell
          >
        </TableRow>
      </TableItem>
    </div>
    <div class="button-wrapper">
      <ButtonItem
        class="button"
        h="3.6rem"
        w="7.2rem"
        bgc="#003566"
        br="0.6rem"
        c="#fff"
        fs="1.6rem"
        @click="toggleSeveranceTable"
      >
        조회
      </ButtonItem>
    </div>
    <div class="severance-table-wrapper" v-if="showSeveranceTable">
      <TableItem class="severance-pay-table" gtc="repeat(6, 1fr)" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.6rem" fw="bold">직전 3개월 기간</TableCell>
          <TableCell th fs="1.6rem" fw="bold">기본급 총액</TableCell>
          <TableCell th fs="1.6rem" fw="bold">비과세 총액</TableCell>
          <TableCell th fs="1.6rem" fw="bold">연간 상여금 가산액</TableCell>
          <TableCell th fs="1.6rem" fw="bold">연간 연차수당 가산액</TableCell>
          <TableCell th fs="1.6rem" fw="bold">퇴직금 예상치</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="period" fs="1.5rem">
            {{
              formatPeriod(
                severancePay.three_months_ago,
                severancePay.severance_date
              )
            }}
          </TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(severancePay.total_salary)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(severancePay.total_non_taxable_salary)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(severancePay.bonus_addition)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(severancePay.leave_allowance_addition)
          }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{
            formatCurrency(severancePay.severance_pay)
          }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell th fs="1.8rem" fw="bold" gc="span 6"
            >귀하의 퇴직금 예상치는
            {{ formatCurrency(severancePay.severance_pay) }}입니다.</TableCell
          >
          <TableCell th fs="1.6rem" gc="span 6"
            >* 본 계산은 예상치로 실제 세금 납부액 및 각종 공제 내역에 따라
            달라질 수 있습니다.</TableCell
          >
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
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import {
  getEstimateWorkingDays,
  calculateSeverancePay,
} from '@/api/payroll.js';

const router = useRouter();

// 상태 변수
const employeeId = ref(null);
const workingDay = ref({});
const severancePay = ref({});
const showSeveranceTable = ref(false);

// api 호출
const fetchData = async () => {
  const id = localStorage.getItem('employeeId');

  if (!id) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  employeeId.value = id;

  try {
    // 재직일 데이터 호출
    const workingData = await getEstimateWorkingDays(employeeId.value);
    workingDay.value = workingData.content || {};

    // 퇴직금 데이터 호출
    const severanceData = await calculateSeverancePay(employeeId.value);
    severancePay.value = severanceData.content || {};
  } catch (error) {
    console.error('데이터 호출 중 오류 발생', error);
  }
};

const toggleSeveranceTable = () => {
  showSeveranceTable.value = true; // 조회 버튼 클릭 시 테이블 표시
};

// const fetchWorkingData = async(employeeId) => {
//   if (!employeeId.value) {
//     console.error("유효하지 않은 파라미터");
//     return;
//   }
//   try {
//     const response = await getEstimateWorkingDays(employeeId.value);
//     workingDay.value = response.content || {};
//   } catch (error) {
//     console.error("Failed to fetch workingDay", error);
//   }
// };
//
// const fetchSeverancePay = async(id) => {
//   if (!id) {
//     console.error("유효하지 않은 파라미터", id);
//     return;
//   }
//   try {
//     const response = await calculateSeverancePay(id);
//
//     const content = response.content || {};
//     severancePay.value = {
//         total_salary: content.total_salary || "-",
//         total_non_taxable_salary: content.total_non_taxable_salary || "-",
//         bonus_addition: content.bonus_addition || "-",
//         leave_allowance_addition: content.leave_allowance_addition || "-",
//         severance_pay: content.severance_pay || "-",
//         three_months_ago: content.three_months_ago || "-년 -월 -일",
//         severance_date: content.severance_date || "-년 -월 -일",
//       };
//   } catch (error) {
//     console.error("Failed to fetch severancePay", error);
//   }
// };

// const handleOnclick = () => {
//   if (!employeeId.value) {
//     console.error('employeeId가 유효하지 않음!!');
//     return;
//   }
//   fetchSeverancePay(employeeId.value);
// };

const formatDate = (value) => {
  if (!value) return '-년 -월 -일';
  const [date] = value.split('T');
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

const formatPeriod = (startDate, endDate) => {
  if (!startDate || !endDate) return '-년 -월 -일 ~ -년 -월 -일';
  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}년 ${month}월 ${day}일`;
  };
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) {
    return '- 원'; // 기본값 설정
  }
  return `${value.toLocaleString()} 원`;
};

onMounted(() => {
  const id = localStorage.getItem('employeeId');
  if (!id) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  employeeId.value = id;
  fetchData(employeeId.value);
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

.button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.severance-table-wrapper {
  margin-top: 2.5%;
}

.date {
  justify-content: center;
  align-items: center;
}

.mid {
  justify-content: flex-start;
  align-items: center;
}

.period {
  justify-content: center;
  align-items: center;
}

.amount {
  justify-content: flex-end;
  align-items: center;
}
</style>
