<template>
  <BubbleBackground></BubbleBackground>
  <div class="page-container">
    <LoginSection
      v-model:id="employeeNumber"
      v-model:password="password"
      :invalid="invalid"
      :message="errorMessage"
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
const invalid = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    const response = (await axios.post('http://localhost:5000/api/login', {
      employee_number: employeeNumber.value,
      password: password.value
    })).data;
  } catch (error) {
    invalid.value = true;
    errorMessage.value = error.response.data.error ? error.response.data.error.message : null;
    console.log(error.response.data);
  }
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
