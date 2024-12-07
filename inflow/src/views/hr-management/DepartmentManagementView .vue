<template>
  <CommonNav :cur="3"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="2" :list="menuList"></CommonMenu>
    <div class="content">
      <!-- 왼쪽 -->
      <!-- 부서 폴더 및 검색 -->
      <div class="department-heirarchy-content">
        <!-- 부서 폴더 -->
        <DepartmentHeirarchy
          class="department-heirarchy"
          :departments="allDepartments"
          @select="handleDepartmentSelect"
        />

        <!-- select 이벤트 발생시 
                  부서 코드 정보가 DepartmentHeirachy -> 부모 -> DepartmentSearch로 이동-->

        <!-- 부서 검색 -->
        <DepartmentSearch
          class="department-search"
          @select="handleDepartmentSelect"
        />
      </div>

      <!-- 오른쪽 -->
      <div
        style="display: flex; flex-direction: column !important; width: 100%"
      >
        <!-- 하위 부서 -->
        <SubMenuNav
          :cur="subIdx"
          :list="subMenuList"
          @clicked="handleClicked"
        />

        <!-- section 부분-->
        <SectionItem class="content-section" w="100%">
          <router-view></router-view>
        </SectionItem>
      </div>
    </div>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';

import DepartmentHeirarchy from '@/components/employee-search/DepartmentHeirarchy.vue';
import DepartmentSearch from './department/DepartmentSearch.vue';

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api/axios';

const menuList = ref([
  { name: '사원 정보 조회', link: '/hr-management/employee/info' },
  { name: '사원 정보 등록', link: '/hr-management/employee/upload' },
  { name: '부서 관리', link: '/hr-management/department' },
  { name: '인사발령', link: '/hr-management/appointment' },
  { name: '휴가 관리', link: '/hr-management/vacation' },
  { name: '급여 관리', link: '/hr-management/salary' },
]);

const subMenuList = ref([
  { name: '부서 정보', link: '/hr-management/department/info' },
  { name: '부서 추가', link: '/hr-management/department/add' },
]);

const router = useRouter();
const route = useRoute();

const subIdx = ref(0);

const handleClicked = (idx) => {
  subIdx.value = idx;
  localStorage.setItem('subIdx', subIdx.value);
};

const eid = ref(null);
const employeeName = ref('');

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }

  const defaultUrl = '/hr-management/department';
  if (route.fullPath == defaultUrl) {
    localStorage.removeItem('subIdx');
    return;
  }

  const savedSubIdx = localStorage.getItem('subIdx');
  if (savedSubIdx) {
    subIdx.value = Number(savedSubIdx);
  }
});

// 1. 부서 폴더구조 UI
// 페이지 로드되자마자 전체 폴더 구조 조회
const allDepartments = ref([]); // 부서 정보 담을 배열 선언
onMounted(async () => {
  try {
    const response = await apiClient.get('/departments/hierarchy');
    allDepartments.value = response.data.content;
  } catch (error) {
    console.error('부서 데이터를 불러오지 못했습니다.', error);
  }
});

const selectedDepartmentCode = ref(null);
// 2. select 이벤트 발생하여 handleDepartmentSelect 메소드 실행
// 자식 컴포넌트로부터 select 이벤트를 통해 department.department_code 정보가 emit됨
// 부서 선택 이벤트 처리
const handleDepartmentSelect = (departmentCode) => {
  selectedDepartmentCode.value = departmentCode;
  router.push({
    name: 'hr-management-department-info',
    query: { departmentCode },
  });
};
</script>

<style scoped>
.sub-menu-nav {
  top: 19.4rem;
  /* width: calc(100% - 12rem) !important; */
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
}

.sub-menu-content {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.content {
  position: absolute;
  display: flex;
  width: 100%;
  top: 9rem;
  padding-left: 3rem;
  padding-right: 2rem;
  height: 80vh;
}

.content-section {
  top: 13.5rem;
  right: 0;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 2rem;
  padding-bottom: 5rem;
  flex-grow: 1;
  align-items: center;
  display: flex;
}

.department-heirarchy {
  width: 50%;
  height: 100% !important;
  border-right: 1px solid #e1e1e1;
}

.department-search {
  width: 50%;
  height: 100% !important;
  border-right: 1px solid #e1e1e1;
}
.department-heirarchy-content {
  display: flex;
  height: 95% !important;
  width: 100%;
  overflow: hidden;
  top: 7px;
  position: relative;
}
</style>
