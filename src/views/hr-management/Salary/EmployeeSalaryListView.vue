<template>
  <SearchEmployeeComponent
    @employee-selected="handleSelected"
  ></SearchEmployeeComponent>
  <SectionItem class="salary-section" h="100%" w="calc(100% - 45rem)">
    <CommonArticle label="급여 내역">
      <FlexItem
        class="profile"
        fld="row"
        w="100%"
        h="18rem"
        bgc="#fff"
        br="0.6rem"
      >
        <FigureItem
          v-if="selectedEmployee"
          class="profile-img-wrapper"
          h="100%"
          w="13rem"
        >
          <img :src="selectedEmployee.profile_image_url" alt="Profile Image" />
        </FigureItem>
        <FlexItem
          v-if="selectedEmployee"
          class="emp-info"
          fld="column"
          h="100%"
        >
          <span class="emphasize">{{ selectedEmployee.employee_name }}</span>
          <span class="normal">{{ selectedEmployee.employee_number }}</span>
          <span class="normal">{{ selectedEmployee.department_path }}</span>
        </FlexItem>
        <FlexItem
          v-else
          class="empty-message"
          fld="row"
          h="100%"
          w="100%"
          fs="2rem"
        >
          사원을 선택해주세요.
        </FlexItem>
      </FlexItem>
      <ChangeYearComponent
        class="change-year"
        :cur-year="curYear"
        description="급여 내역"
        @go-prev-year="goPrevYear"
        @go-next-year="goNextYear"
      ></ChangeYearComponent>
      <TableItem class="salary-list" gtc="repeat(6, 1fr)">
        <TableRow>
          <TableCell th fs="1.5rem">지급 연월</TableCell>
          <TableCell th fs="1.5rem">기본급</TableCell>
          <TableCell th fs="1.5rem">비과세</TableCell>
          <TableCell th fs="1.5rem">기타 수당 및 상여</TableCell>
          <TableCell th fs="1.5rem">공제 금액</TableCell>
          <TableCell th fs="1.5rem">급여 총액</TableCell>
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
    </CommonArticle>
  </SectionItem>
</template>
<script setup>
import SearchEmployeeComponent from '@/components/common/SearchEmployeeComponent.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import FigureItem from '@/components/semantic/FigureItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import { ref, onMounted } from 'vue';
import { getPaymentsByYear } from '@/api/payroll.js';
import ChangeYearComponent from '@/components/common/ChangeYearComponent.vue';

const payments = ref([]);
const curYear = ref(0); // 초기 값은 빈 문자열
const selectedEmployee = ref(null);

// 데이터 페치 함수
const fetchData = async (employeeId, year) => {
  try {
    const response = await getPaymentsByYear(employeeId, year);
    payments.value = response.content || [];
  } catch (error) {
    console.error('급여 데이터를 가져오는 중 오류 발생:', error);
    payments.value = [];
  }
};

// 사원 선택 핸들러
const handleSelected = (item) => {
  selectedEmployee.value = item;
  if (selectedEmployee.value) {
    fetchData(selectedEmployee.value.department_member_id, curYear.value);
  }
};

// 이전 연도 핸들러
const goPrevYear = () => {
  curYear.value -= 1;
  if (selectedEmployee.value) {
    fetchData(selectedEmployee.value.department_member_id, curYear.value);
  }
};

// 다음 연도 핸들러
const goNextYear = () => {
  curYear.value += 1;
  if (selectedEmployee.value) {
    fetchData(selectedEmployee.value.department_member_id, curYear.value);
  }
};

// 통화 형식 변환
const formatCurrency = (value) => `${value.toLocaleString()} 원`;

// 날짜 형식 변환
const formatDate = (value) => {
  if (!value) return '지급일: -';
  const [date] = value.split('T');
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

// 컴포넌트 마운트 시 현재 연도 설정
onMounted(() => {
  curYear.value = new Date().getFullYear(); // 현재 연도 설정
});
</script>

<style scoped>
.salary-section {
  position: absolute;
  left: 40rem;
  top: 0.1rem;
  padding: 3rem;
}

.profile {
  padding: 1rem;
  gap: 3rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
}

.profile-img-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.emp-info {
  justify-content: center;
  gap: 1rem;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.change-year {
  margin-top: 2rem;
}

.salary-list {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.pagination {
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
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
