<template>
  <div class="container">
    <div class="search">
      <div class="search-bar">
        <div class="input">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="부서명, 부서 코드 또는 부서장으로 검색"
            class="input-css"
          />
        </div>
        <div class="button">
          <SearchButton
            h="2rem"
            w="2rem"
            class="button-css"
            @click="fetchDepartments"
          />
        </div>
      </div>
    </div>
    <div class="content">
      <div v-if="!searchKeyword.trim()" class="no-return-container">
        <span class="no-return-text">검색어를 입력해주세요.</span>
      </div>
      <div v-else-if="departments.length === 0" class="no-return-container">
        <span class="no-return-text">검색 결과가 없습니다.</span>
      </div>

      <div class="search-list">
        <div
          v-for="department in departments"
          :key="department.department_code"
          class="search-list-one-item"
          @click="selectDepartment(department.department_code)"
        >
          <span>{{ department.department_path }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import SearchButton from '@/components/buttons/SearchButton.vue';
import apiClient from '@/api/axios';

// 상태 관리
const searchKeyword = ref(''); // 검색어 상태
const departments = ref([]); // API에서 받아온 부서 목록

// API 호출 함수
const fetchDepartments = async () => {
  if (searchKeyword.value.trim() === '') {
    departments.value = []; // 검색어가 없으면 초기화
    return;
  }
  try {
    const response = await apiClient.get('/departments/search/departments', {
      params: { keyword: searchKeyword.value.trim() }, // 검색어 전달
    });
    if (response.data.success) {
      departments.value = response.data.content; // 부서 데이터 업데이트
    } else {
      departments.value = [];
    }
  } catch (error) {
    departments.value = [];
  }
};

// 검색어 변경 감지 및 자동 검색
watch(searchKeyword, fetchDepartments);

// select 이벤트 정의
// 부모로 이벤트 emit
const emit = defineEmits(['select']);
const selectDepartment = (departmentCode) => {
  emit('select', departmentCode);
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.search {
  height: 5%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.search-bar {
  width: 95%;
  height: 100%;
  background-color: white;
  border: 1px solid #c7c7c7;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-css {
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem;
  font-size: 1.3rem;
}

.content {
  height: 95%;
  width: 100%;
  margin-top: 5px;
}

.input {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button {
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-css {
  background-color: white !important;
  color: #c7c7c7 !important;
  font-size: 2rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-list {
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.search-list-one-item {
  background-color: white;
  height: 10%;
  border-radius: 2px;
  font-size: 1.8rem;
  width: 95%;
  color: #003566;
  font-weight: lighter;
  padding: 7px;
  cursor: pointer;

  transition:
    background-color 0.3s ease,
    padding 0.3s ease,
    box-shadow 0.3s ease;
}

.search-list-one-item:hover {
  background-color: #e3f2fd;
  padding: 10px;
}

.no-return-container {
  display: flex;
  justify-content: center; /* 수평 정렬 */
  align-items: center; /* 수직 정렬 */
  height: 2rem; /* 문구를 위한 고정 높이 */
  width: 100%; /* 부모 컨테이너에 맞춤 */
  margin-top: 37rem;
}

.no-return-text {
  font-size: 1.5rem;
}
</style>
