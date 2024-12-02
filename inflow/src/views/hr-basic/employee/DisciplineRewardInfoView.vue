<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="100%">
    <CommonArticle :label="'포상 및 징계'" class="ca" w="90%"></CommonArticle>
    <DisciplineRewardTypeDropDown @selected="getType" class="select-data"></DisciplineRewardTypeDropDown>
    <ButtonItem h="3rem" w="7rem" bgc="#003566" br="0.6rem" c="#fff" :fs="'1rem'" @click="handleOnclick">조회</ButtonItem>
  </FlexItem>

  <FlexItem class="content-body" fld="column" h="calc(100% - 3rem)" w="100%">
    <div class="table-wrapper">
      <TableItem class="commute-table" gtc="0.5fr 1fr 1fr 4fr" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.6rem">no</TableCell>
          <TableCell th fs="1.6rem">구분</TableCell>
          <TableCell th fs="1.6rem">등록일</TableCell>
          <TableCell th fs="1.6rem">내용</TableCell>
        </TableRow>
        <TableRow v-if="!isEmpty" v-for="(item, index) in showList" :key="index">
          <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['discipline_reward_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['created_at'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['content'] }}</TableCell>
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
      포상 및 징계 정보가 존재하지 않습니다.
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
import DisciplineRewardTypeDropDown from '@/components/dropdowns/DisciplineRewardTypeDropDown.vue';
import { getDisciplineReward } from '@/api/emp_attach';
import { ref, onMounted, watch } from 'vue';

const drList = ref([]);
const showList = ref([]);
const isEmpty = ref(true);

onMounted(() => {
  const employeeId = localStorage.getItem('employeeId');
  fetchDate(employeeId);
});

const sortByDate = (list) => {
  return list.sort((a, b) => {
    const dateA = new Date(a['created_at']);
    const dateB = new Date(b['created_at']);
    return dateB - dateA;
  });
};

const fetchDate = async (empId) => {
  const response = await getDisciplineReward(empId);

  if (response) {
    const sortedResponse = sortByDate(response[0].discipline_rewards.map(row => ({
        ...row, 
        created_at: row['created_at'].split('T')[0],
      })));
      drList.value = sortedResponse;
      showList.value = drList.value;
    isEmpty.value = drList.value.length === 0;
  } else {
    drList.value = [];
    isEmpty.value = true;
  }
};

const selectedType = ref('전체');

const getType = (type) => {
  selectedType.value = type;
};

const handleOnclick = () => {
  if (selectedType.value === '전체') {
    showList.value = drList.value;
  } else {
    showList.value = drList.value.filter(row => row.discipline_reward_name === selectedType.value);
  }
};

watch(showList, (newValue) => {
  isEmpty.value = newValue.length === 0;
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

.ca {
  margin-left: 2rem;
}

.content-header ::v-deep(.app-his-dropdown .dropdown .dropdown-header) {
  margin-top: 0.3rem;
  margin-right: 1rem;
  height: 3rem !important;
  align-items: center;
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
  