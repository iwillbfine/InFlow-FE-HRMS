<template>
  <CommonNav :cur="2"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="1" :list="menuList"></CommonMenu>
    <SubMenuNav
      :cur="subIdx"
      :list="subMenuList"
      @clicked="handleClicked"
    ></SubMenuNav>
    <SectionItem class="content-section" w="100%">
      <router-view></router-view>
    </SectionItem>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SectionItem from '@/components/semantic/SectionItem.vue';

// 상태 변수
const eid = ref(null);
const employeeName = ref(''); // 사원 이름 상태

const router = useRouter();
const route = useRoute();

const menuList = ref([
  { name: '개인신상관리', link: '/hr-basic/my-info' },
  { name: '근태 정보', link: '/hr-basic/attendance' },
  { name: '급여 및 수당', link: '/hr-basic/salary' },
  { name: '계약서 서명', link: '/hr-basic/document' },
  { name: '내 부서 관리', link: '/hr-basic/my-department' },
]);

const subMenuList = ref([
  { name: '출퇴근 내역', link: '/hr-basic/attendance/commute' },
  { name: '재택근무 관리', link: '/hr-basic/attendance/remote' },
  { name: '초과근무 관리', link: '/hr-basic/attendance/overtime' },
  { name: '휴가 관리', link: '/hr-basic/attendance/vacation' },
  { name: '휴직 관리', link: '/hr-basic/attendance/leave' },
  { name: '복직 관리', link: '/hr-basic/attendance/return' },
  { name: '출장 관리', link: '/hr-basic/attendance/business-trip' },
  { name: '파견 관리', link: '/hr-basic/attendance/dispatch' },
]);

const subIdx = ref(0);

const handleClicked = (idx) => {
  subIdx.value = idx;
  localStorage.setItem('subIdx', subIdx.value);
};

// 컴포넌트가 마운트될 때 사원 정보를 가져옴
onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }

  const defaultUrl = '/hr-basic/attendance';
  if (route.fullPath == defaultUrl) {
    localStorage.removeItem('subIdx');
    return;
  }

  const savedSubIdx = localStorage.getItem('subIdx');
  if (savedSubIdx) {
    subIdx.value = Number(savedSubIdx);
  }
});
</script>

<style scoped>
.sub-menu-nav {
  position: fixed;
  top: 19.4rem;
  width: calc(100% - 12rem) !important;
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
}

.content-section {
  position: absolute;
  top: 13.5rem;
  right: 0;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 2rem;
  padding-bottom: 5rem;
  flex-grow: 1;
  align-items: center;
}
</style>
