<template>
  <div class="page-container">
    <CommonNav :cur="2"></CommonNav>
    <FlexItem
      class="main-container"
      fld="column"
      h="100%"
      w="calc(100% - 12rem)"
    >
      <CommonHeader user-name="홍길동"></CommonHeader>
      <MainItem h="calc(100% - 12rem)" w="100%">
        <CommonWidget :cur="1" :list="menuList">
          <FlexItem class="widget-content" h="100%" w="100%">
            <SubMenuNav :cur="subIdx" :list="subMenuList" @clicked="handleClicked"></SubMenuNav>
            <router-view></router-view>
          </FlexItem>
        </CommonWidget>
      </MainItem>
    </FlexItem>
  </div>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonWidget from '@/components/common/CommonWidget.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import { ref } from 'vue';

const menuList = ref([
  { name: '개인신상관리', link: '/hr-basic/my-info' },
  { name: '근태 정보', link: '/hr-basic/attendance' },
  { name: '급여 및 수당', link: '/hr-basic/salary' },
  { name: '계약서 서명', link: '/hr-basic/contract' },
  { name: '내 부서 관리', link: '/hr-basic/my-department'},
]);

const subMenuList = ref([
  { name: '출퇴근 내역', link: '/hr-basic/attendance/commute' },
  { name: '재택 근무 관리', link: '/hr-basic/attendance/remote' },
  { name: '초과 근무 관리', link: '/hr-basic/attendance/overtime' },
  { name: '휴가 관리', link: '/hr-basic/attendance/vacation' },
  { name: '휴직 관리', link: '/hr-basic/attendance/leave' },
  { name: '복직 관리', link: '/hr-basic/attendance/return' },
  { name: '출장 관리', link: '/hr-basic/attendance/business-trip' },
  { name: '파견 관리', link: '/hr-basic/attendance/dispatch' },
]);

const subIdx = ref(0);

const handleClicked = (idx) => {
  subIdx.value = idx;
}

</script>

<style scoped>
.page-container {
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
