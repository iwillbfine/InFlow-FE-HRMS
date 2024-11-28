<template>
  <CommonNav></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
  </MainItem>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // 상태 관리 및 생명주기 훅
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import { useRouter } from 'vue-router';
import { getEmployeeById } from '@/api/emp_info';

// 상태 변수
const eid = ref(null);
const employeeName = ref(''); // 사원 이름 상태

const router = useRouter();

// 사원 정보를 가져오는 함수
const fetchEmployeeDetails = async () => {
  try {
    const employeeData = await getEmployeeById(eid.value);
    localStorage.setItem("employeeName", employeeData.name);
    employeeName.value = employeeData.name; // API 응답에서 이름을 가져옴
    console.log('사원 정보:', employeeData);
  } catch (error) {
    console.error('사원 정보 조회 실패:', error);
  }
};

// 컴포넌트가 마운트될 때 사원 정보를 가져옴
onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (eid.value == null) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
  fetchEmployeeDetails();
});
</script>

<style scoped>
</style>
