<template>
  <CommonArticle label="학력" class="ca" w="96%" fs="2rem">
    <ButtonItem
      v-if="props.employee_id === undefined"
      class="update-btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      :fs="'1.6rem'"
      @click="handleOnclick"
      >수정</ButtonItem
    >

    <FlexItem class="content-body" fld="column" h="calc(100% - 3rem)" w="100%">
      <div class="table-wrapper">
        <TableItem
          class="commute-table"
          gtc="0.3fr 1.5fr 1fr 1fr 1fr 1.5fr"
          br="0.5rem"
        >
          <TableRow>
            <TableCell th fs="1.6rem">No</TableCell>
            <TableCell th fs="1.6rem">학교명</TableCell>
            <TableCell th fs="1.6rem">학위</TableCell>
            <TableCell th fs="1.6rem">입학일</TableCell>
            <TableCell th fs="1.6rem">졸업일</TableCell>
            <TableCell th fs="1.6rem">전공</TableCell>
          </TableRow>
          <TableRow
            v-if="!isEmpty"
            v-for="(item, index) in educationList"
            :key="index"
          >
            <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['school_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{ item['degree'] }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['admission_date']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['graduation_date']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{ item['major'] }}</TableCell>
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
        학력 정보가 존재하지 않습니다.
      </FlexItem>
    </FlexItem>
  </CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import { getEducationsById } from '@/api/emp_attach';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const educationList = ref([]);
const isEmpty = ref(true);

const route = useRoute();
const router = useRouter();

const employeeId = ref('');

const props = defineProps({
  employee_id: {
    type: String,
    required: false,
  },
});

const sortByDate = (list) => {
  return list.sort((a, b) => {
    const dateA = new Date(a['admission_date']);
    const dateB = new Date(b['admission_date']);
    return dateA - dateB;
  });
};

const fetchDate = async (empId) => {
  const response = await getEducationsById(empId);

  if (response) {
    const sortedResponse = sortByDate(response);
    educationList.value = sortedResponse;
    isEmpty.value = educationList.value.length === 0;
  } else {
    educationList.value = [];
    isEmpty.value = true;
  }
};

const handleOnclick = () => {
  router.push({
    path: '/hr-basic/my-info/educations/update',
    query: {
      employee_id: employeeId.value,
    },
  });
};

onMounted(() => {
  employeeId.value =
    route.query.employee_id ||
    props.employee_id ||
    localStorage.getItem('employeeId');
  fetchDate(employeeId.value);
});

watch(
  () => props.employee_id,
  (newVal) => {
    employeeId.value =
      route.query.employee_id || newVal || localStorage.getItem('employeeId');
    fetchDate(employeeId.value);
  },
  { immediate: true }
);
</script>

<style scoped>
.common-article {
  position: relative;
  margin-top: 2rem;
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
