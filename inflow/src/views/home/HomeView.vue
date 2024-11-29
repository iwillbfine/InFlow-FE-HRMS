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

// 상태 변수
const eid = ref(null);
const employeeName = ref(''); // 사원 이름 상태

const router = useRouter();

// 컴포넌트가 마운트될 때 로컬 저장소에서 사원 정보를 가져옴
onMounted(() => {
  // 사원 ID 확인
  eid.value = localStorage.getItem('employeeId');
  if (!eid.value) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  } else {
    // 사원 이름 설정
    const name = localStorage.getItem('employeeName');
    if (name) {
      employeeName.value = name; // 사원 이름 상태에 로컬 저장소 값 설정
    } else {
      console.warn('사원 이름을 찾을 수 없습니다.');
      employeeName.value = '알 수 없음'; // 이름이 없을 경우 기본값 설정
    }
  }
});
</script>

<style scoped>
</style>
