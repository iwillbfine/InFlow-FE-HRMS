<template>
  <NavItem
    class="common-nav"
    fld="column"
    h="100%"
    w="12rem"
    fs="2rem"
    c="#fff"
    bgc="#003566"
  >
    <UlItem class="nav-list">
      <LiItem
        v-for="(item, index) in list"
        :key="index"
        class="nav-item"
        :active="props.cur === index"
        hc="#003566"
        hbgc="#fff"
        ac="#003566"
        abgc="#fff"
        @click.stop="selectItem(item)"
      >
        <component :is="item.icon"></component>
        <span>{{ item.name }}</span>
      </LiItem>
    </UlItem>
  </NavItem>
</template>

<script setup>
import NavItem from '../semantic/NavItem.vue';
import UlItem from '../semantic/UlItem.vue';
import LiItem from '../semantic/LiItem.vue';
import EvaluationIcon from '../icons/EvaluationIcon.vue';
import RobotIcon from '../icons/RobotIcon.vue';
import SearchIcon from '../icons/SearchIcon.vue';
import UserIcon from '../icons/UserIcon.vue';
import AddressBookIcon from '../icons/AddressBookIcon.vue';
import ChartIcon from '../icons/ChartIcon.vue';
import { ref, markRaw } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  cur: {
    type: Number,
    default: null,
  },
});

const list = ref([
  { name: '사원 찾기', icon: markRaw(SearchIcon), link: '/emp-search' },
  { name: '챗봇', icon: markRaw(RobotIcon), link: '/chatbot' },
  { name: '인사 기본', icon: markRaw(UserIcon), link: '/hr-basic' },
  { name: '인사 관리', icon: markRaw(AddressBookIcon), link: '/hr-management' },
  { name: '평가', icon: markRaw(EvaluationIcon), link: '/evaluation' },
]);

const router = useRouter();

const selectItem = (item) => {
  router.push(item.link);
};
</script>

<style scoped>
.common-nav {
  position: fixed;
  z-index: 1000;
}

.nav-list {
  padding-top: 6rem;
}

.nav-item {
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  gap: 0.6rem;
  cursor: pointer;
}

.nav-item i {
  font-size: 3.2rem;
}

.nav-item span {
  font-size: 1.2rem;
}
</style>
