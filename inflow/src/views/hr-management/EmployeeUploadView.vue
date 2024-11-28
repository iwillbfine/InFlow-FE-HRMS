<template>
  <CommonNav :cur="3"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="1" :list="menuList"></CommonMenu>
    <SubMenuNav :cur="subIdx" :list="subMenuList" @clicked="handleClicked"></SubMenuNav>
    <SectionItem class="content-section" w="100%">
      <router-view></router-view>
    </SectionItem>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import CommonArticle from '@/components/common/CommonArticle.vue'
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const menuList = ref([
  { name: '사원 정보 조회', link: '/hr-management/employee/info' },
  { name: '사원 정보 등록', link: '/hr-management/employee/upload' },
  { name: '부서 관리', link: '/hr-management/department' },
  { name: '인사발령', link: '/hr-management/appointment' },
  { name: '과제 및 평가', link: '/hr-management/evaluation' },
  { name: '계약서 서명', link: '/hr-management/contract' },
  { name: '휴가 관리', link: '/hr-management/vacation' },
  { name: '급여 관리', link: '/hr-management/salary' },
]);

const subMenuList = ref([
  { name: '기본 정보', link: '/hr-management/employee/upload/employees' },
  { name: '경력', link: '/hr-management/employee/upload/careers' },
  { name: '학력', link: '/hr-management/employee/upload/educations' },
  { name: '자격증', link: '/hr-management/employee/upload/qualifications' },
  { name: '어학', link: '/hr-management/employee/upload/languagetests' },
  { name: '가구원', link: '/hr-management/employee/upload/familymembers' },
  { name: '포상 및 징계', link: '/hr-management/employee/upload/disciplinerewards' },
]);

const subIdx = ref(0);

const handleClicked = (idx) => {
  subIdx.value = idx;
  localStorage.setItem('subIdx', subIdx.value);
}

const eid = ref(null);
const employeeName = ref('');

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }

  const defaultUrl = '/hr-management/vacation';
  if(route.fullPath == defaultUrl) {
    localStorage.removeItem('subIdx');
    return;
  }

  const savedSubIdx = localStorage.getItem('subIdx');
  if (savedSubIdx) {
    subIdx.value = Number(savedSubIdx);
  }
}
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
