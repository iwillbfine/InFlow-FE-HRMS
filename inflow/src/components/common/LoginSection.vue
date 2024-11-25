<template>
  <SectionItem class="login-container" fld="column" c="#fff">
    <FlexItem class="company-info" fld="column">
      <CompanyLogo></CompanyLogo>
      <CompanyName></CompanyName>
    </FlexItem>
    <ArticleItem class="login-article" fld="column" h="28rem" w="44rem" bgc="rgba(0, 34, 65, 0.74)" br="1.5rem">
      <FlexItem class="id-input-wrapper" h="5.6rem" w="35rem" bgc="rgba(170, 167, 184, 0.25)" br="1rem">
        <input
          type="text"
          class="input-text"
          name="id-input"
          placeholder="ID"
          :value="props.employeeNumber"
          @input="updateId($event.target.value)"
        />
      </FlexItem>
      <FlexItem class="pwd-input-wrapper" h="5.6rem" w="35rem" bgc="rgba(170, 167, 184, 0.25)" br="1rem">
        <input
          type="password"
          class="input-text"
          name="pwd-input"
          placeholder="PASSWORD"
          :value="props.password"
          @input="updatePassword($event.target.value)"
        />
      </FlexItem>
      <FlexItem class="invalid-message-wrapper" h="1.1rem" w="35rem" fs="1.1rem" c="#FF6060">
        <span v-if="props.invalid">{{ props.message }}</span>
      </FlexItem>
      <ButtonItem class="login-btn" fs="1.4rem" @click="login">로그인</ButtonItem>
    </ArticleItem>
  </SectionItem>
</template>

<script setup>
import FlexItem from '../../components/semantic/FlexItem.vue';
import SectionItem from '../../components/semantic/SectionItem.vue';
import ArticleItem from '../../components/semantic/ArticleItem.vue';
import ButtonItem from '../../components/semantic/ButtonItem.vue';
import CompanyLogo from '../../components/common/CompanyLogo.vue';
import CompanyName from '../../components/common/CompanyName.vue';

const props = defineProps({
  employeeNumber: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  }
});

const emit = defineEmits(['update:id', 'update:password', 'login']);

const updateId = (newId) => emit('update:id', newId);
const updatePassword = (newPassword) => emit('update:password', newPassword);

const login = () => emit('login');
</script>

<style scoped>
.login-container {
  font-family: 'inter';
  font-weight: 400;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.company-info {
  align-items: center;
  gap: 1rem;
}

.login-article {
  align-items: center;
  gap: 1rem;
}

.id-input-wrapper {
  margin-top: 4rem;
}

.pwd-input-wrapper {
  margin-top: 0.5rem;
}

.input-text {
  height: 100%;
  padding: 1rem;
  font-size: 1.7rem;
  font-weight: 300;
  color: #fff;
}

.input-text::placeholder {
  color: #BFCEDD;
}

.login-btn {
  margin-top: 1.5rem;
}
</style>
