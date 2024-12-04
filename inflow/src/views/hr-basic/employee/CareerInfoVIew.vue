<template>
  <CommonArticle :label="'경력'" class="ca" w="96%" fs="2rem">
    <ButtonItem class="update-btn" h="3.6rem" w="7.2rem" bgc="#003566" br="0.6rem" c="#fff" :fs="'1.6rem'" @click="handleOnclick">수정</ButtonItem>
    <FlexItem class="content-body" fld="column" h="calc(100% - 3rem)" w="100%">
      <div class="table-wrapper">
        <TableItem class="commute-table" gtc="0.3fr 1fr 1fr 1fr 1fr" br="0.5rem">
          <TableRow>
            <TableCell th fs="1.6rem">No</TableCell>
            <TableCell th fs="1.6rem">회사명</TableCell>
            <TableCell th fs="1.6rem">직책</TableCell>
            <TableCell th fs="1.6rem">입사일</TableCell>
            <TableCell th fs="1.6rem">퇴사일</TableCell>
          </TableRow>
          <TableRow v-if="!isEmpty" v-for="(item, index) in careerList" :key="index">
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
  </CommonArticle>
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

const careerList = ref([]);
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
    careerList.value = sortedResponse;
    isEmpty.value = careerList.value.length === 0;
  } else {
    careerList.value = [];
    isEmpty.value = true;
  }
};

const handleOnclick = () => {
  router.push('/hr-basic/my-info/careers/update');
};

</script>

<style scoped>
.common-article {
  position: relative;
  margin-top: 2rem;
}

::v-deep(article > div.article-label) {
  font-size: 2rem !important;
}

.ca {
  align-self: center;
}

.update-btn {
  position: absolute;
  top: 0;
  right: 0;
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
