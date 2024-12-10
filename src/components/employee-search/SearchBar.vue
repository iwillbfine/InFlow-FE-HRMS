<template>
  <div class="container">
    <input
      v-model="searchQuery"
      class="search-input"
      placeholder="사원명/부서명/전화번호를 입력해주세요"
      @keyup.enter="onSearch"
      id="search-input-id"
      maxlength="16"
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
  justify-content: flex-end;
  align-items: center;
  background-color: #f8f8f8;
}

.search-input {
  width: calc(100% - 8.4rem);
  text-align: start;
  height: 100%;
  padding-left: 136rem;
}
.search-input::placeholder {
  font-size: 1.8rem;
}

.search-button {
  width: 8.4rem;
  height: 100%;
  background-color: #003566;
  color: white;
}
</style>
