<template>
  <BubbleBackground></BubbleBackground>
  <div class="page-container">
    <LoginSection
      v-model:id="employeeNumber"
      v-model:password="password"
      :invalid="true"
      :message="'사번 또는 비밀번호가 잘못 되었습니다.'"
      @login="handleLogin"
    />
  </div>
</template>

<script setup>
import BubbleBackground from '../../components/common/BubbleBackground.vue';
import LoginSection from '../../components/common/LoginSection.vue';
import { ref, watch } from 'vue';
import axios from 'axios';

const employeeNumber = ref('');
const password = ref('');

const handleLogin = async () => {
  const response = (await axios.post('http://localhost:5000/api/login', {
    employee_number: employeeNumber.value,
    password: password.value
  })).data;
  console.log(response);
}


</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
}
</style>
