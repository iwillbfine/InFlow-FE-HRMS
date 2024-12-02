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
          <TableCell class="mid" fs="1.6rem">{{ formatDate(payment.paid_at) }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{ formatCurrency(payment.monthly_salary) }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{ formatCurrency(payment.non_taxable_salary) }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{ formatCurrency(payment.bonus_and_allowance) }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{ formatCurrency(payment.total_deductible) }}</TableCell>
          <TableCell class="amount" fs="1.6rem">{{ formatCurrency(payment.actual_salary) }}</TableCell>
        </TableRow>
      </TableItem>
      <PaginationComponent class="pagination"
        :data="pageInfo"
        @changePage="handlePageChange"
      ></PaginationComponent>
    </CommonArticle>
  </SectionItem>
</template>
<script setup>
import SearchEmployeeComponent from "@/components/common/SearchEmployeeComponent.vue";
import SectionItem from "@/components/semantic/SectionItem.vue";
import CommonArticle from "@/components/common/CommonArticle.vue";
import FigureItem from "@/components/semantic/FigureItem.vue";
import FlexItem from "@/components/semantic/FlexItem.vue";
import TableItem from "@/components/semantic/TableItem.vue";
import TableRow from "@/components/semantic/TableRow.vue";
import TableCell from "@/components/semantic/TableCell.vue";
import {onMounted, ref} from "vue";
import PaginationComponent from "@/components/common/PaginationComponent.vue";
import {getAllPayments} from "@/api/payroll.js";
import {useRouter} from "vue-router";

const router = useRouter();

const payments = ref([]);
const pageInfo = ref({});

const curPage = ref(1);

const selectedEmployee = ref(null);

const fetchData = async(employeeId, page) => {
  employeeId = selectedEmployee.value.department_member_id;
  const response = await getAllPayments(employeeId, page);
  payments.value = response.content.elements || [];
  pageInfo.value = response.content;
}

const handlePageChange = (page) => {
  curPage.value = page;
  fetchData(selectedEmployee.value.department_member_id, curPage.value);
  router.push({
    name: "hr-management-salary-list",
    params: {employeeId: selectedEmployee.value.department_member_id},
    query: { page: curPage.value }
  });
};

const handleSelected = (item) => {
  selectedEmployee.value = item;
  console.log("selectedEmployee.value", selectedEmployee.value);
  fetchData(selectedEmployee.value.department_menber_id, curPage.value);
};

const formatCurrency = (value) => `${value.toLocaleString()} 원`;
const formatDate = (value) => {
  if (!value) return '지급일: -';
  const [date] = value.split('T');
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

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
.salary-list {
  margin-top: 2rem;
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
