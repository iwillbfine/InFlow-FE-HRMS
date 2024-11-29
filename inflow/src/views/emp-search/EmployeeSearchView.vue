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
        <div class="title">
          <span>사원 또는 부서 찾기</span>
        </div>
        <!-- 검색창 -->
        <SearchBar  @search="handleSearch" class="search-bar" ></SearchBar>
        <div class="search-content">
          <DepartmentHeirarchy class="heirarchy"></DepartmentHeirarchy>
          <EmployeeList class="employee-list"></EmployeeList>
          <EmployeeDetail class="employee-detail"></EmployeeDetail>
        </div>

      </MainItem>

    </FlexItem>
  </div>
</template>

<script setup>
import axios from 'axios';
import {ref} from 'vue';

import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';

import SearchBar from '@/components/employee-search/SearchBar.vue';
import DepartmentHeirarchy from '@/components/employee-search/DepartmentHeirarchy.vue';
import EmployeeList from '@/components/employee-search/EmployeeList.vue';
import EmployeeDetail from '@/components/employee-search/EmployeeDetail.vue';

import apiClient from '@/api/axios';

// search-bar 컴포넌트에서 받아온 정보 emloyees에 저장
const employees = ref([]);

// 검색어 처리 함수
const handleSearch = async(query) => {
  try{
    const respnose = await axios.get('/api/departments/search/members', {
      params:{keyword:query}
    });
    employees.value = apiClient.response.data;
  } catch(error){
    console.error('사원 데이터를 불러오지 못했습니다.',error);

  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.title{
  font-size: 2rem;
  font-weight: bolder;
  color: #003566;
}
/* 검색창 */
.search-bar{
  margin: 10px 0
}

/* 컨텐츠 */
.search-content{
  display: flex;
  height: 100%;
}

.heirarchy{
  width: 20%;
}

.employee-list{
  width: 55%;
}

.employee-detail{
  width: 25%;
}
</style>
