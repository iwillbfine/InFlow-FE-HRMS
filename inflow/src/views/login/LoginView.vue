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
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Vue Router 사용

// 상태 변수
const employeeNumber = ref('');
const password = ref('');
const invalid = ref(false);
const errorMessage = ref('');
const router = useRouter(); // 라우터 객체 생성

// 로그인 처리 함수
const handleLogin = async () => {
  try {
    const response = (await axios.post('http://localhost:5000/api/login', {
      employee_number: employeeNumber.value,
      password: password.value,
    })).data;

    if (response.success) {
      const { 
        access_token: accessToken, 
        refresh_token: refreshToken, 
        employee_id: employeeId, 
        employee_number: empNumber 
      } = response.content;

      // 로컬 저장소에 데이터 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('employeeId', employeeId);
      localStorage.setItem('employeeNumber', empNumber);

      // 홈 화면으로 이동
      router.push('/');
    }
  } catch (error) {
    invalid.value = true;
    errorMessage.value = error.response?.data?.error?.message || '로그인 실패. 다시 시도해주세요.';
    console.error(error.response?.data || error);
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
}
</style>
