<template>
  <FlexItem
    class="dropdown"
    fld="column"
    :w="props.w"
    fs="1.6rem"
    fw="500"
    c="#003566"
    @click="toggleDropdown"
  >
    <FlexItem class="dropdown-header" fld="row" br="0.6rem" bgc="#fff">
      {{ selectedItem ? selectedItem.name : props.placeholder }}
      <CaretUpIcon v-if="isDropdownOpen"></CaretUpIcon>
      <CaretDownIcon v-else></CaretDownIcon>
    </FlexItem>
    <UlItem
      v-if="isDropdownOpen"
      class="dropdown-list"
      w="100%"
      br="0.6rem"
      bgc="#fff"
    >
      <LiItem
        v-for="(item, index) in props.list"
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
import CaretUpIcon from '../icons/CaretUpIcon.vue';
import CaretDownIcon from '../icons/CaretDownIcon.vue';
import { ref } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  list: {
    type: Array, // id와 name을 key값으로 갖는 map 배열
    required: true,
  },
  w: {
    type: String,
    required: true,
  },
});

const selectedItem = ref(null);
const isDropdownOpen = ref(false);

const emit = defineEmits(['update:selectedItem']);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectItem = (item) => {
  selectedItem.value = item;
  emit('update:selectedItem', item.id);
  isDropdownOpen.value = false;
};
</script>

<style scoped>
.dropdown {
  position: relative;
  flex-direction: column;
  cursor: pointer;
}

.dropdown-header {
  justify-content: space-between;
  padding: 1rem;
  box-shadow: 0 0.2rem 0.4rem 0.2rem rgba(0, 0, 0, 0.15);
}

.dropdown-header i {
  font-size: 2rem;
}

.dropdown-list {
  position: absolute;
  top: 6rem;
  left: 0;
  max-height: 15rem;
  overflow-y: auto;
  box-shadow: 0 0.2rem 0.4rem 0.2rem rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.dropdown-item {
  padding: 1rem;
}
</style>
