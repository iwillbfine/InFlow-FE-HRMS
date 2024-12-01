<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="100%">
    <CommonArticle :label="'자격증 정보'" class="ca" w="90%"></CommonArticle>
    <ButtonItem h="3rem" w="7rem" bgc="#003566" br="0.6rem" c="#fff" :fs="'1rem'" @click="handleOnclick">수정</ButtonItem>
  </FlexItem>


  <FlexItem class="content-body" fld="column" h="calc(100% - 3rem)" w="100%">
    <div class="table-wrapper">
      <TableItem class="commute-table" gtc="0.5fr 2fr 1fr 1fr 2fr 1fr" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.6rem">no</TableCell>
          <TableCell th fs="1.6rem">자격증</TableCell>
          <TableCell th fs="1.6rem">자격번호</TableCell>
          <TableCell th fs="1.6rem">취득일</TableCell>
          <TableCell th fs="1.6rem">발급기관</TableCell>
          <TableCell th fs="1.6rem">등급 및 점수</TableCell>
        </TableRow>
        <TableRow v-if="!isEmpty" v-for="(item, index) in qualList" :key="index">
          <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['qualification_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['qualification_number'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['qualified_at'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['issuer'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['grade_score'] }}</TableCell>
        </TableRow>
      </TableItem>
    </div>
    <FlexItem
      v-if="isEmpty"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.6rem"
    >
      자격증 정보가 존재하지 않습니다.
    </FlexItem>
  </FlexItem>
</template>
  
<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue'
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import { getQualificationsById } from '@/api/emp_attach';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const qualList = ref([]);
const isEmpty = ref(true);

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const employeeId = localStorage.getItem('employeeId');
  fetchDate(employeeId);
});

const sortByDate = (list) => {
  return list.sort((a, b) => {
    const dateA = new Date(a['qualified_at']);
    const dateB = new Date(b['qualified_at']);
    return dateA - dateB;
  });
};

const fetchDate = async (empId) => {
  const response = await getQualificationsById(empId);

  if (response) {
    const sortedResponse = sortByDate(response);
    qualList.value = sortedResponse;
    isEmpty.value = qualList.value.length === 0;
  } else {
    qualList.value = [];
    isEmpty.value = true;
  }
};

const handleOnclick = () => {
  router.push('/hr-basic/my-info/qualifications/update');
};

</script>
  
<style scoped>
.content-header {
  width: 100%;
  position: relative;
  justify-content: space-between;
  align-items: end;
}

.content-header ::v-deep(article > div.article-label) {
  font-size: 2rem !important;
}

.content-body {
  width: 80%;
  margin-top: 1rem;
}

.mid {
  justify-content: center;
  align-items: center;
}

.empty-message {
  justify-content: center;
  align-items: center;
}
</style>
  