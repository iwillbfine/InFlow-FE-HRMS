<template>
  <CommonNav :cur="3"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="0" :list="menuList"></CommonMenu>
    <SearchEmployeeComponent @employee-selected="getEmployeeId"/>
    <MyInfoComponent :empId="employeeId"/>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import MyInfoComponent from '@/components/common/MyInfoComponent.vue';
import SearchEmployeeComponent from '@/components/common/SearchEmployeeComponent.vue';
import { ref, onMounted } from 'vue';
import { getEmpByNum } from '@/api/emp_attach';

const menuList = ref([
  { name: '사원 정보 조회', link: '/hr-management/employee/info' },
  { name: '사원 정보 등록', link: '/hr-management/employee/upload' },
  { name: '부서 관리', link: '/hr-management/department' },
  { name: '인사발령', link: '/hr-management/appointment' },
  { name: '휴가 관리', link: '/hr-management/vacation' },
  { name: '급여 관리', link: '/hr-management/salary' },
]);

const eid = ref(null);
const employeeName = ref('');
const employeeId = ref('');

const getEmployeeId = async(data) => {
  const tmp = await getEmpByNum(data.employee_number);
  employeeId.value = String(tmp.employee_id);
}

onMounted(async() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
});
</script>

<style scoped>
.content-section {
  width: calc(100% - 36rem) !important;
}
.search-emp {
  top: 20rem;
}
</style>