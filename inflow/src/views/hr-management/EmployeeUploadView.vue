<template>
  <div class="page-container">
    <CommonNav :cur="3"></CommonNav>
    <FlexItem
      class="main-container"
      fld="column"
      h="100%"
      w="calc(100% - 12rem)"
    >
      <CommonHeader user-name="홍길동"></CommonHeader>
      <MainItem h="calc(100% - 10rem)" w="100%">
        <CommonWidget :cur="1" :list="menuList">
          <FlexItem class="widget-content" h="100%" w="100%"> 
            <SubMenuNav :cur="subIdx" :list="subMenuList" @clicked="handleClicked"/>
            <CommonArticle :label="`${title}`" w="90%">
              <router-view :key="$route.fullPath" />
            </CommonArticle>
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
import CommonArticle from '@/components/common/CommonArticle.vue'
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const title = ref('기본 정보');

const resetValues = () => {
  title.value = '기본 정보';
  subIdx.value = 0;
}

const subIdx = ref(0);

const handleClicked = (idx) => {
  subIdx.value = idx;
  title.value = subMenuList.value[subIdx.value].name;
}


router.beforeEach((to, from, next) => {
  if (to.path === '/hr-management/employee/upload') {
    resetValues();

    if (to.path !== '/hr-management/employee/upload/employees') {
      next('/hr-management/employee/upload/employees');
    } else {
      next();
    }

    return;
  }
  next();
});

const menuList = ref([
  { name: '사원 정보 조회', link: '/hr-management/employee/info' },
  { name: '사원 정보 등록', link: '/hr-management/employee/upload' },
  { name: '부서 관리', link: '/hr-management/department' },
  { name: '인사발령', link: '/hr-management/appointment' },
  { name: '과제 및 평가', link: '/hr-management/evaluation' },
  { name: '계약서 서명', link: '/hr-management/contract' },
  { name: '휴가 관리', link: '/hr-management/vacation' },
]);

const subMenuList = ref([
  { name: '기본 정보', link: '/hr-management/employee/upload/employees' },
  { name: '경력', link: '/hr-management/employee/upload/careers' },
  { name: '학력', link: '/hr-management/employee/upload/educations' },
  { name: '자격증', link: '/hr-management/employee/upload/qualifications' },
  { name: '어학', link: '/hr-management/employee/upload/languagetests' },
  { name: '포상 및 징계', link: '/hr-management/employee/upload/disciplinerewards' },
  { name: '가구원', link: '/hr-management/employee/upload/familymembers' },
]);
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
