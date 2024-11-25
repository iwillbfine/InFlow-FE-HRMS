<template>
  <CrudModal h="42rem" w="50rem">
    <CompanyName fw="500" c="#003566"></CompanyName>
      <FlexItem class="new-pwd-wrapper" h="5.6rem" w="35rem" br="1rem">
        <input
          type="password"
          class="input-text"
          name="new-pwd"
          placeholder="새 비밀번호"
        />
      </FlexItem>
      <FlexItem class="invalid-message-wrapper" w="35rem" fs="1.1rem" c="#FF6060">
        <span v-if="isNotValid">비밀번호: 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</span>
      </FlexItem>
      <FlexItem class="new-pwd-confirm-wrapper" h="5.6rem" w="35rem" br="1rem">
        <input
          type="password"
          class="input-text"
          name="new-pwd-confirm"
          placeholder="새 비밀번호 확인"
        />
      </FlexItem>
      <FlexItem class="invalid-message-wrapper" h="1.1rem" w="35rem" fs="1.1rem" c="#FF6060">
        <span v-if="isNotSame">비밀번호 확인: 비밀번호가 일치하지 않습니다.</span>
      </FlexItem>
      <ButtonItem class="reset-pwd-btn" fs="1.6rem" @click="reset-pwd">비밀번호 변경</ButtonItem>
  </CrudModal>
</template>

<script setup>
import CrudModal from './CrudModal.vue';
import CompanyName from '../../components/common/CompanyName.vue';
import FlexItem from '../../components/semantic/FlexItem.vue';
import ButtonItem from '../../components/semantic/ButtonItem.vue';
import { ref } from 'vue';

const isNotValid = ref(false);
const isNotSame = ref(false);

</script>

<style scoped>
.reset-pwd-modal {
  gap: 3rem;
}

.new-pwd-wrapper {
  margin-top: 4rem;
}

.new-pwd-confirm-wrapper {
  margin-top: 0.6rem;
}

.input-text {
  height: 100%;
  padding: 1rem;
  font-size: 1.7rem;
  font-weight: 300;
  border: 1px solid #1f1f1f;
  border-radius: 1rem;
  color: #003566;
}

.input-text::placeholder {
  color: #888;
}

.input-text:focus {
  border: 2px solid #0062be ;
  border-radius: 1rem;
}

.reset-pwd-btn {
  margin-top: 2.4rem;
}
</style>
