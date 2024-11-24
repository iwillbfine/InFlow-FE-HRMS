<template>
  <HeaderItem class="common-header" fld="row" h="12rem" w="100%" fw="700">
    <SectionItem class="welcome-section" h="6rem" fs="3.4rem">
      <span>{{ props.userName }} 님, 안녕하세요!</span>
    </SectionItem>
    <NavItem class="top-nav" h="4rem">
      <SettingButton h="4rem" w="4rem" br="50%"></SettingButton>
      <HomeButton h="4rem" w="4rem" br="50%"></HomeButton>
      <AccountDropdown :user-name="userName" />
    </NavItem>
  </HeaderItem>
</template>

<script setup>
import HeaderItem from '../semantic/HeaderItem.vue';
import SectionItem from '../semantic/SectionItem.vue';
import NavItem from '../semantic/NavItem.vue';
import SettingButton from '../buttons/SettingButton.vue';
import HomeButton from '../buttons/HomeButton.vue';
import AccountDropdown from '../dropdowns/AccountDropdown.vue';

const props = defineProps({
  userName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.common-header {
  justify-content: space-between;
  align-items: center;
  padding-left: 6rem;
  padding-right: 6rem;
  padding-top: 4rem;
}

.top-nav {
  gap: 2rem;
}
</style>
