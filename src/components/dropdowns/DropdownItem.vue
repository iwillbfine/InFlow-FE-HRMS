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
    <FlexItem
      class="dropdown-header"
      fld="row"
      br="0.6rem"
      bgc="#fff"
      :style="{ color: selectedItem ? '#003566' : '#5a5a5a' }"
    >
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
        @click.stop="selectItem(item, index)"
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

const selectItem = (item, index) => {
  selectedItem.value = item;
  emit('update:selectedItem', item.id, index);
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
  align-content: center;
  justify-content: space-between;
  box-shadow: 0 0.2rem 0.4rem 0.2rem rgba(0, 0, 0, 0.15);
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  padding-right: 0.6rem;
  padding-left: 1rem;
}

.dropdown-header i {
  font-size: 2rem;
}

.dropdown-list {
  position: absolute;
  top: 5rem;
  left: 0;
  max-height: 15rem;
  overflow-y: auto;
  box-shadow: 0 0.2rem 0.4rem 0.2rem rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.dropdown-item {
  justify-content: center;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  padding-right: 0.6rem;
  padding-left: 1rem;
}
</style>
