<template>
  <CommonNav :cur="2"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="2" :list="menuList"></CommonMenu>
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
import MainItem from '@/components/semantic/MainItem.vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';

// 상태 변수
const employeeId = ref(null);
const employeeName = ref('');

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
  {
    name: '전체 급여 지급내역',
    link: `/hr-basic/salary/list/${localStorage.getItem('employeeId')}`,
  },
  {
    name: '급여 명세서',
    link: `/hr-basic/salary/detail/${localStorage.getItem('employeeId')}`,
  },
  {
    name: '예상 퇴직금 조회',
    link: `/hr-basic/salary/severance-pay/${localStorage.getItem('employeeId')}`,
  },
  { name: '기간별 급여내역', link: '/hr-basic/salary/period' },
]);

const subIdx = ref(0);

const handleClicked = (idx) => {
  subIdx.value = idx;
  localStorage.setItem('subIdx', subIdx.value);
  router.push(subMenuList.value[idx].link);
};

// 메인메뉴 변경 감지
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/hr-basic/salary') {
      subIdx.value = 0;
      router.push(subMenuList.value[0].link);
    }
  }
);

onMounted(() => {
  employeeId.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!employeeId.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }

  const defaultUrl = '/hr-basic/salary';
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
