<template>
  <div class="container">
    <input
      v-model="searchQuery"
      class="search-input"
      placeholder="사원명/부서명/전화번호를 입력해주세요"
      @keyup.enter="onSearch"
    />
    <button class="search-button" @click="onSearch">검색</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 입력받은 검색어 저장
const searchQuery = ref('');

// 부모에게 검색어 전달 (사용자 정의 이벤트)
const emit = defineEmits(['search']);

const onSearch = () => {
  emit('search', searchQuery.value);
  // 이벤트 발생 (emit 호출 -> search 이름의 이벤트 발생 -> 이벤트와 함꼐 searchQuery.value 전달됨)
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 4rem;
  font-size: 2rem;
  font-weight: lighter;
}

.search-input {
  width: 95%;
  background-color: #f8f8f8;
  text-align: right;
  padding: 0 21px;
}
.search-input::placeholder {
  text-align: right;
  font-size: 1.8rem;
}

.search-button {
  width: 5%;
  background-color: #003566;
  color: white;
}
</style>
