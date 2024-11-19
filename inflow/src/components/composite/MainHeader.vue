<template>
  <HeaderItem class="main-header" fld="row" h="12rem" w="100%" fs="3.4rem" fw="700">
    <SectionItem class="welcome-section">
      <span>{{ userName }} 님, 안녕하세요!</span>
    </SectionItem>
    <NavItem class="top-nav">
      <SettingButton></SettingButton>
      <HomeButton></HomeButton>
    </NavItem>
  </HeaderItem>
</template>

<script setup>
import HeaderItem from '../semantic/HeaderItem.vue';
import SectionItem from '../semantic/SectionItem.vue';
import NavItem from '../semantic/NavItem.vue';
import SettingButton from '../buttons/SettingButton.vue';
import HomeButton from '../buttons/HomeButton.vue';

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
  padding-left: 4rem;
  padding-right: 4rem;
  padding-top: 4rem;
}

.top-nav {
  gap: 2rem;
}
</style>
