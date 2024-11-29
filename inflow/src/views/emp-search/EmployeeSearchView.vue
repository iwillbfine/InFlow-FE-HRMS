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
          <SearchBar  @search="handleSearch" class="search-bar" ></SearchBar>
          <div class="search-content">
            <DepartmentHeirarchy class="heirarchy"></DepartmentHeirarchy>
            <EmployeeList class="employee-list" :employees="employees"></EmployeeList>
            <EmployeeDetail class="employee-detail"></EmployeeDetail>
          </div>

        </div>

      </MainItem>

    </FlexItem>
  </div>
</template>

<script setup>
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
  console.log('검색어:', query); // 로그: 검색어 확인
  try{
    const respnose = await apiClient.get('/departments/search/members', {
      params:{keyword:query}
    });
    employees.value = respnose.data.content;
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

.container{
  width: 100%;
  height: 100%;
}

.title{
  font-size: 2rem;
  font-weight: bolder;
  color: #003566;

}
/* 검색창 */
.search-bar{
  margin: 10px 0;
  height: 4.5%;
}

/* 컨텐츠 */
.search-content{
  display: flex;
  height: 88%;
  width: 100%;
  overflow: hidden;
}

.heirarchy{
  width: 20%;
  height: 100%;
}

.employee-list{
  width: 55%;
  height: 100%;
  overflow-y: auto;
}

.employee-detail{
  width: 25%;
  height: 100%;
}
</style>
