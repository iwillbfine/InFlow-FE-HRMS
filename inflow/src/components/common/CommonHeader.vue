<template>
  <HeaderItem
    class="common-header"
    fld="row"
    h="10rem"
    w="calc(100% - 12rem)"
    fw="700"
    bgc="#fff"
  >
    <SectionItem class="welcome-section" h="6rem" fs="2.8rem">
      <span>{{ props.userName }} 님, 안녕하세요!</span>
    </SectionItem>
    <NavItem class="top-nav" h="4rem">
      <FlexItem class="timer-wrapper" fld="row">
        <FlexItem
          v-if="remainingTime"
          class="timer"
          fld="row"
          fs="1.8rem"
          fw="500"
          c="#202020"
          :class="{ 'low-time': remainingTime <= 300 }"
        >
          <ClockIcon></ClockIcon>
          <span
            >{{ Math.floor(remainingTime / 60) }}분
            {{ remainingTime % 60 }}초</span
          >
        </FlexItem>
        <ButtonItem
          class="extend-btn"
          h="2.8rem"
          w="5.6rem"
          bgc="#aaa"
          br="0.6rem"
          fs="1.2rem"
          c="#fff"
          @click="extendSession"
          >연장
        </ButtonItem>
      </FlexItem>
      <SettingButton
        h="4rem"
        w="4rem"
        br="50%"
        @click="toggleSettingModalStatus"
      ></SettingButton>
      <HomeButton h="4rem" w="4rem" br="50%"></HomeButton>
      <AccountDropdown
        :user-name="userName"
        @reset-password="changeModalStatus"
      />
    </NavItem>
  </HeaderItem>
  <ResetPasswordModal
    v-if="isResetPwdModalOpen"
    class="reset-pwd-modal"
    @close="changeModalStatus"
  ></ResetPasswordModal>
  <SettingModal
    v-if="isSettingModalOpen"
    @close="toggleSettingModalStatus"
  ></SettingModal>
</template>

<script setup>
import HeaderItem from '@/components/semantic/HeaderItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import NavItem from '@/components/semantic/NavItem.vue';
import SettingButton from '@/components/buttons/SettingButton.vue';
import HomeButton from '@/components/buttons/HomeButton.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import SettingModal from '@/components/modals/SettingModal.vue';
import AccountDropdown from '@/components/dropdowns/AccountDropdown.vue';
import ResetPasswordModal from '@/components/modals/ResetPasswordModal.vue';
import ClockIcon from '@/components/icons/ClockIcon.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// Props 정의
const props = defineProps({
  userName: {
    type: String,
    required: true,
  },
});

// 모달 상태
const isResetPwdModalOpen = ref(false);
const isSettingModalOpen = ref(false);

// 남은 시간 상태
const remainingTime = ref(null);
const timer = ref(null);
const router = useRouter();

// 타이머 업데이트
const updateTimer = () => {
  const expireTime = localStorage.getItem('expireTime');
  if (expireTime) {
    const currentTime = new Date().getTime();
    const timeLeft = Math.max(0, expireTime - currentTime);
    remainingTime.value = Math.floor(timeLeft / 1000);

    if (timeLeft <= 0) {
      clearSession();
    }
  } else {
    clearSession();
  }
};

// 세션 연장
const extendSession = () => {
  const newExpireTime = new Date().getTime() + 1 * 60 * 60 * 1000;

  localStorage.setItem('expireTime', newExpireTime.toString());
  updateTimer(); // 즉시 타이머 업데이트
  alert('세션 만료 시간이 연장되었습니다.');
};

// 세션 초기화
const clearSession = () => {
  clearInterval(timer.value);
  localStorage.clear();
  alert('세션이 만료되었습니다. 다시 로그인해주세요.');
  router.push('/login');
};

// 모달 상태 변경
const changeModalStatus = () => {
  isResetPwdModalOpen.value = !isResetPwdModalOpen.value;
};

const toggleSettingModalStatus = () => {
  isSettingModalOpen.value = !isSettingModalOpen.value;
};

// 컴포넌트 마운트/언마운트 시 타이머 관리
onMounted(() => {
  updateTimer();
  timer.value = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped>
.common-header {
  position: fixed;
  top: 0;
  right: 0;
  justify-content: space-between;
  align-items: center;
  padding-left: 4rem;
  padding-right: 4em;
  padding-top: 2rem;
  z-index: 3;
}

.welcome-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.timer-wrapper {
  align-items: center;
  gap: 1rem;
  margin-right: 1rem;
}

.timer {
  gap: 0.7rem;
  align-items: center;
}

.timer i {
  margin-top: 0.4rem;
}

.timer.low-time {
  color: #ff4d4f !important; /* 빨간색 */
  font-weight: 700 !important; /* 강조 */
}

.extend-btn:hover {
  background-color: #003566 !important;
  transition: 0.2s ease-out;
}

.top-nav {
  align-items: center;
  gap: 2rem;
}

</style>
