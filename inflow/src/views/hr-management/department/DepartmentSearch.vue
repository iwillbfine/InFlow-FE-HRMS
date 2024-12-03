<template>
    <div class="container">
        <div class="search">
            <div class="search-bar">
                <div class="input">
                    <input 
                        v-model="searchKeyword" 
                        type="text" 
                        placeholder="부서명, 부서 코드 또는 부서장으로 검색" 
                        class="input-css">
                </div>
                <div class="button">
                    <SearchButton class="button-css" @click="fetchDepartments"/>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="search-list">
                <div 
                    v-for="department in departments" 
                    :key="department.department_code" 
                    class="search-list-one-item">
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
const departments = ref([]);  // API에서 받아온 부서 목록

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
            console.error('API 호출 실패:', response.data.error);
            departments.value = [];
        }
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        departments.value = [];
    }
};

// 검색어 변경 감지 및 자동 검색
watch(searchKeyword, fetchDepartments);
</script>

<style scoped>
.container{
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.search{
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
    border: 1px solid #C7C7C7;
    border-radius: 2px;
    display: flex;
    align-items: center; /* 수직 가운데 정렬 */
    justify-content: space-between; /* 좌우 공간 분배 */
}

.input-css {
    width: 100%;
    height: 2.5rem; /* 입력 필드의 높이를 설정 */
    padding: 0.5rem; /* 내부 여백 추가 */
    font-size: 1.3rem; /* 글자 크기 */
}

.content{
    height: 95%;
    width: 100%;
    margin-top: 5px;

}

.input {
    width: 90%;
    display: flex;
    align-items: center; /* 수직 가운데 정렬 */
    justify-content: center; /* 내용 중앙 정렬 */
}
.button {
    width: 10%;
    display: flex;
    align-items: center; /* 수직 가운데 정렬 */
    justify-content: center; /* 내용 중앙 정렬 */
}


.button-css {
    background-color: white !important;
    color: #C7C7C7 !important;
    font-size: 2rem !important;
    display: flex;
    align-items: center; /* 버튼 아이콘 수직 정렬 */
    justify-content: center; /* 버튼 아이콘 가로 정렬 */
}
.search-list{
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;

}
.search-list-one-item{
    background-color: white;
    /* border: 1px solid black; */
    height: 10%;
    border-radius: 2px;
    font-size: 1.8rem;
    width: 95%;
    color: #003566;
    font-weight: lighter;
    padding: 7px;
    cursor: pointer;

    transition: background-color 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease;
}

.search-list-one-item:hover{
    background-color:#e3f2fd;
    padding: 10px;
}
</style>