<template>
  <div>
    <h2>자기평가 등록</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>과제명</label>
        <input v-model="taskName" required />
      </div>
      <div>
        <label>내용</label>
        <textarea v-model="taskContent" required></textarea>
      </div>
      <button type="submit">등록</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const taskName = ref('');
const taskContent = ref('');

const handleSubmit = () => {
  alert(`과제명: ${taskName.value}, 내용: ${taskContent.value}`);
};
</script>
