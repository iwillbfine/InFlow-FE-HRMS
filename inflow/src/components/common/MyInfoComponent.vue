<template>
  <SectionItem class="content-section" w="100%">
    <ProfileView></ProfileView>
    <SubMenuNav
      :cur="subIdx"
      :list="subMenuList"
      @clicked="handleClicked"
    ></SubMenuNav>
    <router-view></router-view>
  </SectionItem>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import SectionItem from '@/components/semantic/SectionItem.vue';
import SubMenuNav from '@/components/nav/SubMenuNav.vue';

import ProfileView from '@/views/hr-basic/employee/ProfileView.vue';

const router = useRouter();
const route = useRoute();
const subIdx = ref(0);

const subMenuList = ref([
  { name: '경력', link: '/hr-management/employee/info/careers' },
  { name: '학력', link: '/hr-management/employee/info/educations' },
  { name: '자격증', link: '/hr-management/employee/info/qualifications' },
  { name: '어학', link: '/hr-management/employee/info/languagetests' },
  { name: '가족', link: '/hr-management/employee/info/familymembers' },
  {
    name: '포상 및 징계',
    link: '/hr-management/employee/info/disciplinerewards',
  },
]);

const handleClicked = (idx) => {
  subIdx.value = idx;
  localStorage.setItem('subIdx', subIdx.value);
};

onMounted(() => {
  if (subIdx.value === null) {
    const matchedIndex = subMenuList.value.findIndex(
      (item) => item.link === route.path
    );
    if (matchedIndex !== -1) {
      subIdx.value = matchedIndex;
    } else {
      subIdx.value = 0;
    }
  }
});

watch(
  () => route.path,
  (newPath) => {
    const matchedIndex = subMenuList.value.findIndex(
      (item) => item.link === newPath
    );
    if (matchedIndex !== -1) {
      subIdx.value = matchedIndex;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.content-section {
  position: absolute;
  top: 5.4rem;
  right: 0;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 2rem;
  padding-bottom: 5rem;
  flex-grow: 1;
  align-items: center;
}
</style>
