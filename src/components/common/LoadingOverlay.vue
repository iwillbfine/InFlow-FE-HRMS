<template>
  <div v-if="isVisible" class="loading-overlay">
    <div class="spinner"></div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingOverlay',
  props: {
    isVisible: {
      type: Boolean,
      required: true, // 필수로 전달해야 함
    },
    message: {
      type: String,
      default: '처리 중입니다. 잠시만 기다려 주세요...',
    },
  },
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-size: 1.5rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
