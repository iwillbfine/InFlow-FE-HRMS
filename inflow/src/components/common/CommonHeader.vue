<template>
  <HeaderItem class="common-header" fld="row" h="10rem" w="calc(100% - 12rem)" fw="700" bgc="#fff">
    <SectionItem class="welcome-section" h="6rem" fs="2.8rem">
      <span>{{ props.userName }} 님, 안녕하세요!</span>
    </SectionItem>
    <NavItem class="top-nav" h="4rem">
      <SettingButton h="4rem" w="4rem" br="50%"></SettingButton>
      <HomeButton h="4rem" w="4rem" br="50%"></HomeButton>
      <AccountDropdown :user-name="userName" @reset-password="changeModalStatus" />
    </NavItem>
  </HeaderItem>
  <ResetPasswordModal v-if="isResetPwdModalOpen" class="reset-pwd-modal" @close="changeModalStatus"></ResetPasswordModal>
</template>

<script setup>
import HeaderItem from '../semantic/HeaderItem.vue';
import SectionItem from '../semantic/SectionItem.vue';
import NavItem from '../semantic/NavItem.vue';
import SettingButton from '../buttons/SettingButton.vue';
import HomeButton from '../buttons/HomeButton.vue';
import AccountDropdown from '../dropdowns/AccountDropdown.vue';
import ResetPasswordModal from '../modals/ResetPasswordModal.vue';
import { ref } from 'vue';

const props = defineProps({
  userName: {
    type: String,
    required: true,
  },
});

const isResetPwdModalOpen = ref(false);

const changeModalStatus = () => {
  isResetPwdModalOpen.value = !isResetPwdModalOpen.value;
}
</script>

<style scoped>
.common-header {
  position: fixed;
  top: 0;
  right: 0;
  justify-content: space-between;
  align-items: center;
  padding-left: 3rem;
  padding-right: 3em;
  padding-top: 2rem;
  z-index: 3;
}

.top-nav {
  gap: 2rem;
}

.reset-pwd-modal {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
