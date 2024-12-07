<template>
  <div class="page-container">
    <CommonNav :cur="0"></CommonNav>
    <FlexItem
      class="main-container"
      fld="column"
      h="100%"
      w="calc(100% - 12rem)"
    >
      <CommonHeader user-name="홍길동"></CommonHeader>
      <MainItem h="calc(100% - 10rem)" w="100%">
        <div class="container">
          <div class="title">
            <span>사원 또는 부서 찾기</span>
          </div>
          <!-- 검색창 -->
          <SearchBar @search="handleSearch" class="search-bar"></SearchBar>
          <div class="search-content">
            <DepartmentHeirarchy
              class="department-heirarchy"
              :departments="allDepartments"
              @select="handleDepartmentSelect"
            />
            <EmployeeList
              class="employee-list"
              :employees="employees"
              @select="handleEmployeeDetail"
            />
            <!-- 사원을 선택하면 상세정보 조회됨-->
            <EmployeeDetail
              class="employee-detail"
              v-if="selectedEmployee"
              :key="selectedEmployee?.employee_number || 'default-key'"
              :employeeCode="selectedEmployee"
            />
          </div>
        </div>
      </MainItem>
    </FlexItem>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';

import SearchBar from '@/components/employee-search/SearchBar.vue';
import DepartmentHeirarchy from '@/components/employee-search/DepartmentHeirarchy.vue';
import EmployeeList from '@/components/employee-search/EmployeeList.vue';
import EmployeeDetail from '@/components/employee-search/EmployeeDetail.vue';

import apiClient from '@/api/axios';

// 0. 페이지 로드되자마자 모든 사원 목록 로드되도록
const employees = ref([]);
onMounted(async () => {
  try {
    const response = await apiClient.get('/departments/search/all-members');
    employees.value = response.data.content;
  } catch (error) {
    console.error('전체 사원 목록을 불러오지 못했습니다.', error);
  }
});

// 1. 검색창 사원 목록 조회
// search-bar 컴포넌트에서 받아온 정보 emloyees에 저장
// 검색어 처리 함수
const handleSearch = async (query) => {
  try {
    const respnose = await apiClient.get('/departments/search/members', {
      params: { keyword: query },
    });
    employees.value = respnose.data.content;
  } catch (error) {
    console.error('사원 데이터를 불러오지 못했습니다.', error);
  }
};

// 2. 부서 폴더구조 UI
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

// 3. 부서 선택 시 해당 부서 사원 목록 조회
const handleDepartmentSelect = async (departmentCode) => {
  try {
    const respnose = await apiClient.get('/departments/search/members', {
      params: { departmentCode },
    });
    employees.value = respnose.data.content;
  } catch (error) {
    console.error('사원 데이터를 불러오지 못했습니다.', error);
  }
};

// 4. 사원 목록 -> 사원 상세정보 조회
const selectedEmployee = ref({});
// 상세정보 API
const handleEmployeeDetail = async (employeeCode) => {
  try {
    // selectedEmployee.value = null; // 데이터 로드 중일 때 null로 설정
    const response = await apiClient.get(
      `/departments/search/members/detail/employee-code/${employeeCode}`
    );
    selectedEmployee.value = response.data.content[0]; // 첫 번째 객체만 저장
  } catch (error) {
    console.error('사원 상세정보를 불러오지 못했습니다.', error);
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.container {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 2rem;
  font-weight: bolder;
  color: #003566;
}
/* 검색창 */
.search-bar {
  margin: 10px 0;
  height: 4.5%;
  margin-top: 2rem;
}

/* 컨텐츠 */
.search-content {
  display: flex;
  height: 88%;
  width: 100%;
  overflow: hidden;
}

.department-heirarchy {
  width: 20%;
  height: 100%;
}

.employee-list {
  width: 55%;
  height: 100%;
  overflow-y: auto;
}

.employee-detail {
  width: 25%;
  height: 100%;
}
</style>
