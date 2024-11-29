<template>
  <CommonNav :cur="2"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :list="menuList" />
    
    <SectionItem class="content-section" w="100%">
      <ProfileView></ProfileView>
      <SubMenuNav :cur="subIdx" :list="subMenuList" @clicked="handleClicked"></SubMenuNav>
      <router-view></router-view>
    </SectionItem>
    
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import { ref, onMounted } from 'vue';

import { defineCustomElement } from 'vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';

import ProfileView from '@/views/hr-basic/employee/ProfileView.vue';

const menuList = ref([
  { name: '개인신상관리', link: '/hr-basic/my-info' },
  { name: '근태 정보', link: '/hr-basic/attendance' },
  { name: '급여 및 수당', link: '/hr-basic/salary' },
  { name: '계약서 서명', link: '/hr-basic/contract' },
  { name: '내 부서 관리', link: '/hr-basic/my-department'},
]);

const subMenuList = ref([
  { name: '경력', link: '/hr-basic/my-info/careers' },
  { name: '학력', link: '/hr-basic/my-info/educations' },
  { name: '자격증', link: '/hr-basic/my-info/qualifications' },
  { name: '어학 성적', link: '/hr-basic/my-info/languagetests' },
  { name: '가구원', link: '/hr-basic/my-info/familymembers' },
  { name: '포상 및 징계', link: '/hr-basic/my-info/disciplinerewards' },
]);

const eid = ref(null);
const employeeName = ref('');

const subIdx = ref(0);

const handleClicked = (idx) => {
  subIdx.value = idx;
  localStorage.setItem('subIdx', subIdx.value);
}

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

.content-section {
  position: absolute;
  top: 5.4rem;
  right: 0;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 2rem;
  padding-bottom: 5rem;
  flex-grow: 1;
  align-items: center;
}


</style>