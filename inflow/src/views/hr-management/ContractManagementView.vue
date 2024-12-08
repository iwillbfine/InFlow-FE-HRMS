<template>
  <CommonNav :cur="3"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="5" :list="menuList"></CommonMenu>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import { ref, onMounted } from 'vue';

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

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }
});
</script>

<style scoped></style>
