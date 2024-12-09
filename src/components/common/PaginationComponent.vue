<template>
  <div class="pagination">
    <button class="prev" @click="prevPage" :disabled="currentPage <= 1">
      <i class="fa-solid fa-caret-left"></i>
    </button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button
      class="next"
      @click="nextPage"
      :disabled="currentPage >= totalPages"
    >
      <i class="fa-solid fa-caret-right"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['changePage']);

// 페이지 계산을 위한 유효성 검사
const totalPages = computed(() => {
  return props.data.end_page;
});

const currentPage = computed(() => {
  return props.data.page_no;
});

// 페이지 이동 함수
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    emit('changePage', currentPage.value + 1); // 페이지를 변경하라는 이벤트를 emit
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    emit('changePage', currentPage.value - 1); // 페이지를 변경하라는 이벤트를 emit
  }
};
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  color: var(--red-color);
}

.prev,
.next {
  transform: translateY(0.3rem);
  border: none;
  background-color: transparent;
  color: var(--red-color);
  cursor: pointer;
}

.prev:disabled,
.next:disabled {
  cursor: text;
}

.pagination i {
  font-size: 2rem;
}

.pagination span {
  font-size: 2rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
