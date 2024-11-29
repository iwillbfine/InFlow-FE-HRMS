<template>
  <CommonNav :cur="4"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="2" :list="menuList"></CommonMenu>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import { ref, onMounted } from 'vue';

const menuList = ref([
  { name: '자기 평가', link: '/evaluation/personal' },
  { name: '리더 평가', link: '/evaluation/leader' },
  { name: '과제 등록 및 조회', link: '/evaluation/task' },
]);

const eid = ref(null);
const employeeName = ref('');

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
});
</script>

<style scoped>
</style>
