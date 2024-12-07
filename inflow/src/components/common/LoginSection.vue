<template>
  <SectionItem class="login-container" fld="column" c="#fff">
    <FlexItem class="company-info" fld="column">
      <CompanyLogo></CompanyLogo>
      <CompanyName></CompanyName>
    </FlexItem>
    <ArticleItem
      class="login-article"
      fld="column"
      h="28rem"
      w="44rem"
      bgc="rgba(0, 34, 65, 0.74)"
      br="1.5rem"
    >
      <!-- ID 입력 -->
      <FlexItem
        class="id-input-wrapper"
        h="5.6rem"
        w="35rem"
        bgc="rgba(170, 167, 184, 0.25)"
        br="1rem"
      >
        <input
          type="text"
          class="input-text"
          name="id-input"
          placeholder="ID"
          :value="props.employeeNumber"
          @input="updateId($event.target.value)"
          @keyup.enter="focusPassword"
        />
      </FlexItem>
      <!-- 비밀번호 입력 -->
      <FlexItem
        class="pwd-input-wrapper"
        h="5.6rem"
        w="35rem"
        bgc="rgba(170, 167, 184, 0.25)"
        br="1rem"
      >
        <input
          ref="passwordInput"
          :type="passwordVisible ? 'text' : 'password'"
          class="input-text"
          name="pwd-input"
          placeholder="PASSWORD"
          :value="props.password"
          @input="updatePassword($event.target.value)"
          @keyup.enter="login"
        />
        <!-- 눈 아이콘 -->
        <i class="eye-icon" @click="togglePasswordVisibility">
          <img
            :src="passwordVisible ? eyeOpenIcon : eyeClosedIcon"
            alt="eye icon"
          />
        </i>
      </FlexItem>
      <!-- 에러 메시지 -->
      <FlexItem
        class="invalid-message-wrapper"
        h="1.1rem"
        w="35rem"
        fs="1.1rem"
        c="#FF6060"
      >
        <span v-if="props.invalid">{{ props.message }}</span>
      </FlexItem>
      <!-- 로그인 버튼 -->
      <ButtonItem class="login-btn" fs="1.8rem" @click="login"
        >로그인</ButtonItem
      >
    </ArticleItem>
  </SectionItem>
</template>

<script setup>
import FlexItem from '../../components/semantic/FlexItem.vue';
import SectionItem from '../../components/semantic/SectionItem.vue';
import ArticleItem from '../../components/semantic/ArticleItem.vue';
import ButtonItem from '../../components/semantic/ButtonItem.vue';
import CompanyLogo from '../../components/common/CompanyLogo.vue';
import CompanyName from '../../components/common/CompanyName.vue';

import eyeOpenIcon from '@/assets/icons/eye_open.png'; // 눈이 열린 아이콘
import eyeClosedIcon from '@/assets/icons/eye_closed.png'; // 눈이 감긴 아이콘

import { ref } from 'vue';

const passwordVisible = ref(false); // 비밀번호 표시 여부
const passwordInput = ref(null); // 비밀번호 입력창 참조

const props = defineProps({
  employeeNumber: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:id', 'update:password', 'login']);

const updateId = (newId) => emit('update:id', newId);
const updatePassword = (newPassword) => emit('update:password', newPassword);

const login = () => emit('login');

// 비밀번호 표시 토글 메서드
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// 비밀번호 입력창에 포커스 이동
const focusPassword = () => {
  passwordInput.value?.focus();
};
</script>

<style scoped>
.login-container {
  font-family: 'inter';
  font-weight: 400;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.company-info {
  align-items: center;
  gap: 1rem;
}

.login-article {
  align-items: center;
  gap: 1rem;
}

.id-input-wrapper {
  margin-top: 4rem;
}

.pwd-input-wrapper {
  margin-top: 0.5rem;
  position: relative; /* 눈 아이콘 배치를 위해 추가 */
}

.input-text {
  all: unset; /* 브라우저 기본 스타일 제거 */
  height: 100%;
  padding: 1rem;
  font-size: 1.7rem;
  font-weight: 300;
  color: #fff;
  width: calc(100% - 2rem); /* 눈 아이콘 영역 확보 */
  background-color: rgba(170, 167, 184, 0.25);
  border: none;
  border-radius: 1rem;
  transition: background-color 9999s ease-in-out 0s; /* 깜빡임 방지 */
}

.input-text::placeholder {
  color: #bfcedd;
}

.input-text:-webkit-autofill {
  background-color: rgba(
    170,
    167,
    184,
    0.25
  ) !important; /* 자동 완성 시 배경 색상 */
  color: #fff !important; /* 자동 완성 시 글자 색상 */
  -webkit-box-shadow: 0 0 0px 1000px rgba(170, 167, 184, 0.25) inset !important; /* 배경 덮어쓰기 */
  transition: background-color 9999s ease-in-out 0s;
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

.login-btn {
  margin-top: 1.8rem;
}
</style>
