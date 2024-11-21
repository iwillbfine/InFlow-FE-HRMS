<template>
  <div class="test">
    <CommonNav></CommonNav>
    <FlexItem
      class="main-container"
      fld="column"
      h="100%"
      w="calc(100% - 12rem)"
    >
      <CommonHeader user-name="홍길동"></CommonHeader>
      <MainItem h="calc(100% - 12rem)" w="100%">
        <CommonWidget :cur="0" :list="menuList">
          <FlexItem class="widget-content" h="100%" w="100%">
            <SubMenuNav :list="menuList"></SubMenuNav>
            <CommonArticle label="휴가 신청서" h="50rem" w="90%" minh="50rem">
            </CommonArticle>
            <CommonArticle
              label="휴직 신청서"
              h="50rem"
              w="90%"
              minh="50rem"
            ></CommonArticle>
          </FlexItem>
        </CommonWidget>
      </MainItem>
    </FlexItem>
    <CrudModal v-if="isModalOpen" label="신청 정보" @close="closeModal"></CrudModal>
  </div>
</template>

<script setup>
import CommonNav from './components/common/CommonNav.vue';
import CommonHeader from './components/common/CommonHeader.vue';
import CommonWidget from './components/common/CommonWidget.vue';
import MainItem from './components/semantic/MainItem.vue';
import FlexItem from './components/semantic/FlexItem.vue';
import CommonArticle from './components/common/CommonArticle.vue';
import SubMenuNav from './components/nav/SubMenuNav.vue';
import { ref } from 'vue';
import CrudModal from './components/modals/CrudModal.vue';

const menuList = ref([
  { name: '과제 등록 및 조회', link: '/1' },
  { name: '사원 정보 등록', link: '/2' },
  { name: '부서 관리', link: '/3' },
  { name: '인사 발령', link: '/4' },
  { name: '계약서 서명', link: '/5' },
  { name: '휴가 관리', link: '/6' },
]);

const isModalOpen = ref(true);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.test {
  display: flex;
  height: 100vh;
  width: 100%;
}

.widget-content {
  align-items: center;
  padding: 2rem;
  overflow: auto;
}
</style>
