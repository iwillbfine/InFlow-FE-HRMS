<template>
  <HeaderItem class="main-header" fld="row" h="12rem" w="100%" fw="700">
    <SectionItem class="welcome-section" h="6rem" fs="3.4rem">
      <span>{{ userName }} 님, 안녕하세요!</span>
    </SectionItem>
    <NavItem class="top-nav" h="4rem">
      <SettingButton h="4rem" w="4rem" br="50%" bgc="#003566" fs="2.2rem" c="#fff"></SettingButton>
      <HomeButton h="4rem" w="4rem" br="50%" bgc="#003566" fs="2.2rem" c="#fff"></HomeButton>
      <EmployeeAccountToggle :userName="userName"/>
    </NavItem>
  </HeaderItem>
</template>

<script setup>
import HeaderItem from '../semantic/HeaderItem.vue';
import SectionItem from '../semantic/SectionItem.vue';
import NavItem from '../semantic/NavItem.vue';
import SettingButton from '../buttons/SettingButton.vue';
import HomeButton from '../buttons/HomeButton.vue';
import EmployeeAccountToggle from '../composite/EmployeeAccountToggle.vue';

const props = defineProps({
  userName: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.main-header {
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
