<template>
  <ModalBackground>
    <ModalItem :h="props.h" :w="props.w" fs="2rem" fw="500">
      <FlexItem class="modal-content-container" fld="column" h="100%" w="100%">
        <FlexItem class="modal-close" fld="row" h="4rem" w="100%">
          <XmarkButton
            h="3rem"
            w="3rem"
            fs="3rem"
            bgc="#fff"
            c="#003566"
            @click="closeModal"
          />
        </FlexItem>
        <FlexItem
          class="modal-content"
          fld="column"
          h="calc(100% - 4rem)"
          w="100%"
        >
          <slot></slot>
        </FlexItem>
      </FlexItem>
    </ModalItem>
  </ModalBackground>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import XmarkButton from '../buttons/XmarkButton.vue';
import ModalBackground from '../modals/ModalBackground.vue';
import ModalItem from '../modals/ModalItem.vue';
import FlexItem from '../semantic/FlexItem.vue';

const props = defineProps({
  h: {
    type: String,
    default: '58rem',
  },
  w: {
    type: String,
    default: '75rem',
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const preventScroll = (e) => {
  const modal = document.querySelector('.modal-background');

  // 모달이 존재하고, 이벤트의 타겟이 모달 내부에 있으면 스크롤 허용
  if (modal && modal.contains(e.target)) {
    return; // 모달 내부의 스크롤은 차단하지 않음
  }

  // 모달 외부에서는 스크롤 차단
  e.preventDefault();
};

const handlePreventScrollListener = (isModalOpen) => {
  if (isModalOpen) {
    // 스크롤 차단
    window.addEventListener('wheel', preventScroll, { passive: false }); // 마우스 휠
    window.addEventListener('touchmove', preventScroll, { passive: false }); // 모바일 터치
    document.body.style.overflow = 'hidden'; // 추가적으로 body 스크롤 차단
  } else {
    // 스크롤 활성화
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    document.body.style.overflow = ''; // body 스크롤 다시 활성화
  }
};

onMounted(() => {
  handlePreventScrollListener(true);
});

onBeforeUnmount(() => {
  handlePreventScrollListener(false);
});
</script>

<style scoped>
.modal-content-container {
  align-items: center;
  gap: 1rem;
  z-index: 999;
}

.modal-close {
  justify-content: flex-end;
}

.modal-content {
  gap: 0.5rem;
  align-items: center;
  overflow: auto;
}

.modal-label {
  font-size: 2.2rem;
  font-weight: 700;
}
</style>
