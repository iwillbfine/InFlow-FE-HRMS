<template>
  <NavItem class="sub-menu-nav" h="4.2rem" w="100%" bgc="#fff">
    <UlItem
      class="menu-list"
      h="100%"
      fld="row"
      fs="1.7rem"
      :style="inactiveStyle"
    >
      <LiItem
        v-for="(item, index) in props.list"
        :key="index"
        class="menu-item"
        :active="props.cur === index"
        :style="props.cur === index ? activeStyle : {}"
        h="100%"
        c="#5A5A5A"
        hc="#003566"
        ac="#003566"
        @click.stop="selectItem(item, index)"
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

const emit = defineEmits(['clicked']);

const selectItem = (item, index) => {
  emit('clicked', index);
  router.push(item.link);
};

const activeStyle = {
  fontWeight: '700',
  borderBottom: '2px solid #003566',
};

const inactiveStyle = {
  fontWeight: '500',
  borderBottom: '1px solid #898989',
};
</script>

<style scoped>
.menu-item {
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 1.4rem;
}

.menu-item:before {
  content: '|';
  position: absolute;
  left: -0.2rem;
  font-size: 1.7rem;
  color: #dadada;
}

.menu-item:first-child:before {
  content: '';
}

span {
  cursor: pointer;
}
</style>
