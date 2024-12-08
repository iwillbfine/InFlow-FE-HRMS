<template>
  <CommonNav :cur="3"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="0" :list="menuList"></CommonMenu>
    <SearchEmployeeComponent @employee-selected="getEmployeeId" />
    <SectionItem class="content-section" w="100%">
      <ProfileView :employee_id="employeeId"></ProfileView>
      <SubMenuNav
        :cur="subIdx"
        :list="subMenuList"
        @clicked="handleClicked"
      ></SubMenuNav>
      <router-view :employee_id="employeeId"></router-view>
    </SectionItem>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import ProfileView from '../hr-basic/employee/ProfileView.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import SearchEmployeeComponent from '@/components/common/SearchEmployeeComponent.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getEmpByNum } from '@/api/emp_attach';

const router = useRouter();
const route = useRoute();
const subIdx = ref(0);

const menuList = ref([
  { name: '사원 정보 조회', link: '/hr-management/employee/info' },
  { name: '사원 정보 등록', link: '/hr-management/employee/upload' },
  { name: '부서 관리', link: '/hr-management/department' },
  { name: '인사발령', link: '/hr-management/appointment' },
  { name: '휴가 관리', link: '/hr-management/vacation' },
  { name: '급여 관리', link: '/hr-management/salary' },
]);

const subMenuList = ref([
  { name: '경력', link: '/hr-management/employee/info/careers' },
  { name: '학력', link: '/hr-management/employee/info/educations' },
  { name: '자격증', link: '/hr-management/employee/info/qualifications' },
  { name: '어학', link: '/hr-management/employee/info/languagetests' },
  { name: '가족', link: '/hr-management/employee/info/familymembers' },
  {
    name: '포상 및 징계',
    link: '/hr-management/employee/info/disciplinerewards',
  },
]);

const eid = ref(null);
const employeeName = ref('');
const employeeId = ref('');

const getEmployeeId = async (data) => {
  const tmp = await getEmpByNum(data.employee_number);
  employeeId.value = String(tmp.employee_id);
  router.push('/hr-management/employee/info/careers');
};

const handleClicked = (idx) => {
  subIdx.value = idx;
};

onMounted(async () => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }

  if (subIdx.value === null) {
    const matchedIndex = subMenuList.value.findIndex(
      (item) => item.link === route.path
    );
    if (matchedIndex !== -1) {
      subIdx.value = matchedIndex;
    } else {
      subIdx.value = 0;
    }
  }
});

watch(
  () => route.path,
  (newPath) => {
    const matchedIndex = subMenuList.value.findIndex(
      (item) => item.link === newPath
    );
    if (matchedIndex !== -1) {
      subIdx.value = matchedIndex;
    }
  },
  { immediate: true }
);

watch(employeeId, (newVal) => {
  router.push('/hr-management/employee/info/careers');
});
</script>

<style scoped>
.content-section {
  width: calc(100% - 36rem) !important;
  margin-left: 36rem !important;
  margin-top: 8rem;
}
.search-emp {
  top: 19rem;
}
</style>
