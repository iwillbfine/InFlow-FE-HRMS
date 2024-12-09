<template>
  <DropdownItem
    v-model:selected-item="selectedHalf"
    placeholder="반기"
    :list="halfList"
    w="8rem"
  ></DropdownItem>
</template>

<script setup>
import DropdownItem from './DropdownItem.vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['half-selected']);

const halfList = ref([
  { id: '1st', name: '상반기' },
  { id: '2nd', name: '하반기' },
]);

const selectedHalf = ref(null);

watch(
  () => selectedHalf.value,
  (id) => {
    emit('half-selected', id);
  }
);
</script>
