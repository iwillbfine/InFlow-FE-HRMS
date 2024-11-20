<template>
  <FlexItem
    class="account-dropdown"
    fld="column"
    fw="700"
    @click="toggleDropdown"
  >
    <FlexItem class="dropdown-header" fld="row" fs="2rem">
      <span>{{ props.userName }} 님</span>
      <ChevronUpIcon v-if="isDropdownOpen"></ChevronUpIcon>
      <ChevronDownIcon v-else></ChevronDownIcon>
    </FlexItem>
    <UlItem
      v-if="isDropdownOpen"
      class="dropdown-list"
      w="14rem"
      br="0.6rem"
      bgc="#fff"
      fs="1.4rem"
    >
      <LiItem
        v-for="(item, index) in list"
        :key="index"
        class="dropdown-item"
        bgc="#fff"
        hc="#fff"
        hbgc="#003566"
        @click.stop="selectItem(item)"
      >
        {{ item.name }}
      </LiItem>
    </UlItem>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import UlItem from '../semantic/UlItem.vue';
import LiItem from '../semantic/LiItem.vue';
import ChevronUpIcon from '../icons/ChevronUpIcon.vue';
import ChevronDownIcon from '../icons/ChevronDownIcon.vue';
import { ref } from 'vue';

const props = defineProps({
  userName: {
    type: String,
    required: true,
  },
});

const list = ref([
  { id: 1, name: '비밀번호 재설정' },
  { id: 2, name: '로그아웃' },
]);

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectItem = (item) => {
  switch (item.id) {
    case 1:
      handleChangePassword();
      break;
    case 2:
      handleLogout();
      break;
    default:
      console.log('잘못된 요청입니다.');
  }
  isDropdownOpen.value = false;
};

const handleChangePassword = () => {
  console.log('비밀번호 재설정');
};

const handleLogout = () => {
  console.log('로그아웃.');
};
</script>

<style scoped>
.account-dropdown {
  position: relative;
  flex-direction: column;
  cursor: pointer;
}

.dropdown-header {
  margin-top: 0.4rem;
  align-items: center;
  gap: 1rem;
}

.dropdown-header i {
  font-size: 2rem;
}

.dropdown-list {
  position: absolute;
  top: 6rem;
  right: 0;
  overflow: hidden;
  box-shadow: 0 0.2rem 0.4rem 0.2rem rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.dropdown-item {
  padding: 1rem;
}
</style>
