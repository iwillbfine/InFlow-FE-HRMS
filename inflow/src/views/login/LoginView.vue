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
import { getEmployeeById } from '@/api/emp_info'; // 사원 정보 조회 API
import { checkAndUpdateCommute } from '@/api/attendance';

// 상태 변수
const employeeNumber = ref('');
const password = ref('');
const invalid = ref(false);
const errorMessage = ref('');
const router = useRouter(); // 라우터 객체 생성

// 로그인 처리 함수
const handleLogin = async () => {
  // 입력값 검사
  if (!employeeNumber.value.trim()) {
    invalid.value = true;
    errorMessage.value = '아이디를 입력해주세요.';
    return; // 입력값이 없으면 함수 종료
  }

  if (!password.value.trim()) {
    invalid.value = true;
    errorMessage.value = '비밀번호를 입력해주세요.';
    return; // 입력값이 없으면 함수 종료
  }

  try {
    const response = (
      await axios.post('http://localhost:5000/api/login', {
        employee_number: employeeNumber.value,
        password: password.value,
      })
    ).data;

    if (response.success) {
      // 로그인 성공 시 API 응답에서 데이터 추출
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        employee_id: employeeId,
        employee_number: empNumber,
      } = response.content;

      // 사원 이름 가져오기
      let employeeName = '';
      try {
        const employeeData = await getEmployeeById(employeeId, accessToken); // 인증 토큰 포함 API 호출
        employeeName = employeeData.name; // 사원 이름 추출
        console.log(`로그인한 사원 이름: ${employeeName}`);
      } catch (error) {
        console.error('사원 정보 조회 실패:', error);
        throw new Error('사원 정보를 불러오는 데 실패했습니다.');
      }

      // 로컬 저장소에 데이터 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('employeeId', employeeId);
      localStorage.setItem('employeeNumber', empNumber);
      localStorage.setItem('employeeName', employeeName);

      // 세션 만료 시간 설정 (30분 후)
      const expireTime = new Date().getTime() + 1 * 60 * 60 * 1000;
      localStorage.setItem('expireTime', expireTime);

      try {
        const response = await checkAndUpdateCommute(employeeId);
        if (response.success) {
          console.log(response.content);
        }
      } catch (error) {
        console.error('출근 처리 실패', error);
      }

      // 홈 화면으로 이동
      router.push('/');
    }
  } catch (error) {
    invalid.value = true;
    errorMessage.value =
      error.response?.data?.error?.message || '로그인 실패. 다시 시도해주세요.';
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
