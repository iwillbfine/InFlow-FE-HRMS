<template>
  <NavItem class="menu-nav" h="4.2rem" w="100%">
    <UlItem class="menu-list" h="100%" fld="row" fs="1.7rem" fw="700">
      <LiItem
        v-for="(item, index) in props.list"
        :key="index"
        class="menu-item"
        :active="props.cur === index"
        h="100%"
        w="15rem"
        br="1rem 1rem 0rem 0rem"
        bgc="#F2F2F2"
        c="#5A5A5A"
        hc="#fff"
        hbgc="#003566"
        ac="#fff"
        abgc="#003566"
        @click.stop="selectItem(item)"
      >
        <span>{{ item.name }}</span>
      </LiItem>
    </UlItem>
  </NavItem>
</template>

<script setup>
import UlItem from '../semantic/UlItem.vue';
import LiItem from '../semantic/LiItem.vue';
import NavItem from '../semantic/NavItem.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  cur: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

const selectItem = (item) => {
  router.push(item.link);
};
</script>

<style scoped>
.menu-item {
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

span {
  cursor: pointer;
}
</style>
