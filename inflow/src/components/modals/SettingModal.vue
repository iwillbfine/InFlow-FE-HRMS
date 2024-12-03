<template>
  <CrudModal class="setting-modal" h="54rem" w="60rem">
    <FlexItem class="modal-content-wrapper" fld="column" h="100%" w="100%" fs="3rem">
      <img src="/src/assets/admin_default_profile.png" alt="Admin Image">
      <span>열심히 개발중{{ typingText }}</span>
    </FlexItem>
  </CrudModal>
</template>

<script setup>
import CrudModal from '@/components/modals/CrudModal.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import { ref, onMounted } from 'vue';

const fullText = '...';
const typingText = ref('');
const typingSpeed = 500; // 타이핑 속도(ms)
const resetDelay = 500; // 타이핑 완료 후 대기 시간(ms)

const startTyping = () => {
  typingText.value = ''; // 초기화
  let currentIndex = 0;

  const typeChar = () => {
    if (currentIndex < fullText.length) {
      typingText.value += fullText[currentIndex];
      currentIndex++;
      setTimeout(typeChar, typingSpeed); // 다음 글자 입력
    } else {
      setTimeout(startTyping, resetDelay); // 완료 후 다시 시작
    }
  };

  typeChar();
};

onMounted(() => {
  startTyping();
});
</script>

<style scoped>
.modal-content-wrapper {
  align-items: center;
  margin-top: 8rem;
  gap: 3rem;
}

.modal-content-wrapper img {
  height: 20rem;
  width: 20rem;
}
</style>
