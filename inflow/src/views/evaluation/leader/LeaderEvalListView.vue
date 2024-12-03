<template>
  <FlexItem class="title-wrapper" w="90%" c="#003356" fs="2rem" fw="700">
    <span class="title">평가 내역</span>
  </FlexItem>
  <CommonArticle label="피드백" w="90%">
    <FlexItem class="article-content-container" fld="row" h="20rem">
      <FlexItem class="feedback-wrapper" w="70%" br="0.3rem" bgc="#EEF4FA" c="#0D0D0D" fs="1.5rem" fw="400">
        <span>dfasdfasdasdfsadffffffffffffffffffffffffffffffffasdfadsfsadfsadfsadfasdfasdfasdfdasf</span>
      </FlexItem>
      <FlexItem class="grade-wrapper" fld="column" w="30%" br="0.3rem" b="1px solid #003566" bgc="#fff" c="#003566">
        <span class="grade-label">최종 등급</span>
        <span class="grade">A</span>
      </FlexItem>
    </FlexItem>
  </CommonArticle>
  <CommonArticle label="평가 상세" w="90%">

  </CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
</script>

<style scoped>
.title-wrapper {
  margin-bottom: 2rem;
}

.article-content-container {
  gap: 1rem;
}

.feedback-wrapper {
  padding: 2rem;
  overflow-y: auto;
}

.grade-wrapper {
  align-items: center;
}

.grade-label {
  font-size: 2.4rem;
  font-weight: 700;
}
</style>
