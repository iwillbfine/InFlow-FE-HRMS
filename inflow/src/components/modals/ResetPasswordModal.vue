<template>
  <CrudModal h="50rem" w="50rem" @close="closeModal">
    <!-- 로고 및 타이틀 -->
    <div class="logo-container">
      <img :src="companyLogo" alt="Company Logo" class="company-logo" />
      <CompanyName fw="500" c="#003566" text="비밀번호 재설정"></CompanyName>
    </div>

    <!-- 새 비밀번호 -->
    <FlexItem class="input-wrapper" h="5.6rem" w="35rem" br="1rem">
      <label for="new-pwd" class="input-label">새 비밀번호</label>
      <div class="input-container">
        <input
          :type="newPasswordVisible ? 'text' : 'password'"
          class="input-text"
          id="new-pwd"
          name="new-pwd"
          placeholder="새 비밀번호"
          v-model="newPassword"
          @input="validatePassword"
        />
        <i class="eye-icon" @click="toggleNewPasswordVisibility">
          <img
            :src="newPasswordVisible ? eyeOpenIcon : eyeClosedIcon"
            alt="toggle visibility"
          />
        </i>
      </div>
      <span v-if="isNotValid" class="error-message">
        8~16자의 영문 대/소문자, 숫자, 특수문자(!,@,#,$,%)를 사용해 주세요.
      </span>
    </FlexItem>

    <!-- 비밀번호 확인 -->
    <FlexItem class="input-wrapper" h="5.6rem" w="35rem" br="1rem">
      <label for="new-pwd-confirm" class="input-label">비밀번호 확인</label>
      <div class="input-container">
        <input
          :type="confirmPasswordVisible ? 'text' : 'password'"
          class="input-text"
          id="new-pwd-confirm"
          name="new-pwd-confirm"
          placeholder="비밀번호 확인"
          v-model="confirmPassword"
          @input="checkPasswordsMatch"
        />
        <i class="eye-icon" @click="toggleConfirmPasswordVisibility">
          <img
            :src="confirmPasswordVisible ? eyeOpenIcon : eyeClosedIcon"
            alt="toggle visibility"
          />
        </i>
      </div>
      <span v-if="isNotSame" class="error-message">
        비밀번호가 일치하지 않습니다.
      </span>
    </FlexItem>

    <!-- 비밀번호 변경 버튼 -->
    <ButtonItem class="reset-pwd-btn" fs="1.6rem" @click="resetPassword"
      >비밀번호 변경</ButtonItem
    >
  </CrudModal>
</template>

<script setup>
import CrudModal from './CrudModal.vue';
import CompanyName from '../../components/common/CompanyName.vue';
import FlexItem from '../../components/semantic/FlexItem.vue';
import ButtonItem from '../../components/semantic/ButtonItem.vue';
import { ref } from 'vue';

import { resetEmployeePassword } from '@/api/emp_info';

// 로고 및 아이콘
import companyLogo from '@/assets/company_logo.svg';
import eyeOpenIcon from '@/assets/icons/eye_open.png';
import eyeClosedIcon from '@/assets/icons/eye_closed.png';

// 상태 변수
const newPassword = ref('');
const confirmPassword = ref('');
const isNotValid = ref(false);
const isNotSame = ref(false);
const newPasswordVisible = ref(false);
const confirmPasswordVisible = ref(false);

// 모달 닫기 함수
const emit = defineEmits(['close']);

// 비밀번호 유효성 검사 함수
const validatePassword = () => {
  const passwordPattern =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%])[a-zA-Z\d!@#$%]{8,16}$/;
  isNotValid.value = !passwordPattern.test(newPassword.value);

  // 입력이 끝났을 때 에러 메시지를 자동으로 제거
  if (!isNotValid.value) {
    setTimeout(() => {
      isNotValid.value = false;
    }, 2000); // 2초 후 에러 메시지 제거
  }
};

// 비밀번호 확인 검사
const checkPasswordsMatch = () => {
  isNotSame.value = newPassword.value !== confirmPassword.value;
};

// 비밀번호 변경 로직
const resetPassword = async () => {
 // 입력 값 검증
 if (!newPassword.value ) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  if ( !confirmPassword.value) {
    alert('확인비밀번호를 입력해주세요.');
    return;
  }




  if (isNotValid.value) {
    alert('유효하지 않은 비밀번호입니다.');
    return;
  }
  if (isNotSame.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    // 로컬 스토리지에서 사원 ID와 토큰 가져오기
    const employeeId = localStorage.getItem('employeeId');
    const token = localStorage.getItem('accessToken');

    if (!employeeId || !token) {
      alert('사용자 정보를 가져오지 못했습니다. 다시 로그인해주세요.');
      return;
    }

    // API 호출 - 사번(employeeId)와 새 비밀번호(newPassword) 전달
    const response = await resetEmployeePassword(
      employeeId,
      newPassword.value,
      token
    );

    if (response.success) {
      alert(response.content); // 성공 메시지 출력
      closeModal(); // 모달 닫기
    } else {
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
  }
};

// 새 비밀번호 토글
const toggleNewPasswordVisibility = () => {
  newPasswordVisible.value = !newPasswordVisible.value;
};

// 비밀번호 확인 토글
const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value;
};

// 모달 닫기 함수
const closeModal = () => {
  emit('close'); // 부모 컴포넌트에서 'close' 이벤트를 처리
};
</script>

<style scoped>
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #fff; /* 배경색을 흰색으로 명시 */
}

.company-logo {
  width: 8rem;
  height: 8rem;
  margin-bottom: 1rem;
}

.input-wrapper {
  position: relative;
  margin-bottom: 3rem;
}

/* 레이블 스타일 수정 */
.input-label {
  position: absolute;
  top: -1.2rem; /* 입력창과 겹치지 않도록 위치 조정 */
  left: 1rem;
  background-color: #fff; /* 배경색을 흰색으로 명시 */
  padding: 0 0.5rem; /* 텍스트 양옆 여백 추가 */
  font-size: 1.2rem;
  color: #003566; /* 글자색 */
  z-index: 1; /* 입력창 위에 표시되도록 z-index 설정 */
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-text {
  height: 100%;
  width: 100%;
  padding: 1rem;
  font-size: 1.6rem;
  font-weight: 300;
  border: 1px solid #1f1f1f;
  border-radius: 4px;
  color: #003566;
  padding-right: 2.5rem; /* 아이콘 영역 확보 */
}

.input-text::placeholder {
  color: #888;
}

.input-text:focus {
  border: 2px solid #0062be;
  border-radius: 4px;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%; /* 중앙 정렬 */
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.error-message {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  color: #ff6060;
}

.reset-pwd-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff;
  background-color: #003566;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
</style>

