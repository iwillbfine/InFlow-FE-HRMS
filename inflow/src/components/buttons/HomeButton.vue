<template>
  <ButtonItem
    class="home-btn"
    :h="props.h"
    :w="props.w"
    :br="props.br"
    :bgc="props.bgc"
    :fs="props.fs"
    :c="props.c"
    @click="goHome"
  >
    <HomeIcon></HomeIcon>
  </ButtonItem>
</template>

<script setup>
import HomeIcon from '../icons/HomeIcon.vue';
import ButtonItem from '../semantic/ButtonItem.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  h: { type: String, required: true },
  w: { type: String, required: true },
  br: { type: String, default: '0rem' },
  bgc: { type: String, default: '#003566' },
  fs: { type: String, default: '2.2rem' },
  c: { type: String, default: '#fff' },
});

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>
