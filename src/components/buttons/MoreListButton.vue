<template>
  <ButtonItem
    class="more-list-btn"
    fld="row"
    h="2.4rem"
    w="6.4rem"
    bgc="#EEEEEE"
    b="0.8px solid #A1A1A1"
    br="0.35rem"
    c="#474747"
    fs="1.2rem"
  >
    더보기
    <ChevronRightIcon></ChevronRightIcon>
  </ButtonItem>
</template>

<script setup>
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
</script>

<style scoped>
.more-list-btn i {
  margin-top: 0.28rem;
}
</style>
