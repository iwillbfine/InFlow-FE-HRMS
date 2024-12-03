<!-- EvalTaskView.vue -->
<template>
  <CommonNav :cur="4"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="2" :list="menuList" @menu-clicked="handleMenuClick"></CommonMenu>
    <SubMenuNav :cur="subIdx" :list="subMenuList" @clicked="handleClicked"></SubMenuNav>
    <SectionItem class="content-section" w="100%">
      <router-view
        :selectedYear="selectedYear"
        :selectedHalf="selectedHalf"
        @year-selected="handleYearSelected"
        @half-selected="handleHalfSelected"
      ></router-view>
    </SectionItem>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const menuList = ref([
  { name: '자기 평가', link: '/evaluation/personal' },
  { name: '리더 평가', link: '/evaluation/leader' },
  { name: '과제 등록 및 조회', link: '/evaluation/task' },
  { name: '평가 관리', link: '/evaluation/policy' },
]);

const subMenuList = ref([
  { name: '과제 관리', link: '/evaluation/task/register' }
]);

const router = useRouter();
const route = useRoute();

const subIdx = ref(0);
const eid = ref(null);
const employeeName = ref('');
const selectedYear = ref(Number(new Date().getFullYear()));
const selectedHalf = ref('1st');

const handleMenuClick = (link) => {
  if (link === '/evaluation/task') {
    router.push(subMenuList.value[0].link);
  }
};

const handleClicked = (idx) => {
  subIdx.value = idx;
  localStorage.setItem('subIdx', subIdx.value);
};

const handleYearSelected = (year) => {
  selectedYear.value = Number(year);
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }

  const defaultUrl = '/evaluation/task';
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
