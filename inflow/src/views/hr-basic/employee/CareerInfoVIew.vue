<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="100%">
    <CommonArticle :label="'경력 정보'" class="ca" w="90%"></CommonArticle>
    <ButtonItem h="3rem" w="7rem" bgc="#003566" br="0.6rem" c="#fff" :fs="'1rem'" @click="handleOnclick">수정</ButtonItem>
  </FlexItem>


  <FlexItem class="content-body" fld="column" h="calc(100% - 3rem)" w="100%">
    <div class="table-wrapper">
      <TableItem class="commute-table" gtc="0.3fr 1fr 1fr 1fr 1fr" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.6rem">no</TableCell>
          <TableCell th fs="1.6rem">회사명</TableCell>
          <TableCell th fs="1.6rem">직책</TableCell>
          <TableCell th fs="1.6rem">입사일</TableCell>
          <TableCell th fs="1.6rem">퇴사일</TableCell>
        </TableRow>
        <TableRow v-if="!isEmpty" v-for="(item, index) in appointmentHistory" :key="index">
          <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['company_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['role_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['join_date'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['resignation_date'] }}</TableCell>
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
      경력 정보가 존재하지 않습니다.
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
import { getCareersById } from '@/api/emp_attach';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const appointmentHistory = ref([]);
const isEmpty = ref(true);

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const employeeId = localStorage.getItem('employeeId');
  fetchDate(employeeId);
});

const sortByDate = (list) => {
  return list.sort((a, b) => {
    const dateA = new Date(a['join_date']);
    const dateB = new Date(b['join_date']);
    return dateA - dateB;
  });
};

const fetchDate = async (empId) => {
  const response = await getCareersById(empId);

  if (response) {
    const sortedResponse = sortByDate(response);
    appointmentHistory.value = sortedResponse;
    isEmpty.value = appointmentHistory.value.length === 0;
  } else {
    appointmentHistory.value = [];
    isEmpty.value = true;
  }
};

const handleOnclick = () => {
  router.push('/hr-basic/my-info/careers/update');
};

const goSelectedPoint = (selectedData) => {
  navigateTo('/hr-management/appointment/history', selectedData);
};

defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
});
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
  