<template>
  <NavItem class="vertical-nav" fld="column" w="12rem" fs="2rem" c="#fff" bgc="#003566" >
    <UlItem class="nav-list">
      <LiItem
        class="nav-item"
        v-for="(item, index) in list"
        :key="index"
        :active="cur === index"
        hc="#003566"
        hbgc="#fff"
        ac="#003566"
        abgc="#fff"
        @click="selectItem(index)"
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
import { ref } from 'vue';

const props = defineProps({
  cur: {
    type: Number,
    default: 0,
  }
})

const list = [
  { name: '평가', icon: EvaluationIcon },
  { name: '챗봇', icon: RobotIcon },
  { name: '사원 찾기', icon: SearchIcon },
  { name: '인사 기본', icon: UserIcon },
  { name: '인사 관리', icon: AddressBookIcon },
  { name: '통계', icon: ChartIcon },
];
</script>

<style scoped>
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
