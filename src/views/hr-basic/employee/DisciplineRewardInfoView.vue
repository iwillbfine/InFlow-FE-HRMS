<template>
  <CommonArticle label="포상 및 징계" class="ca" w="96%" fs="2rem">
    <DisciplineRewardTypeDropDown
      @selected="getType"
      class="select-data"
    ></DisciplineRewardTypeDropDown>
    <ButtonItem
      class="read-btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      :fs="'1.6rem'"
      @click="handleOnclick"
      >조회</ButtonItem
    >
    <FlexItem class="content-body" fld="column" h="calc(100% - 3rem)" w="100%">
      <div class="table-wrapper">
        <TableItem class="commute-table" gtc="0.5fr 1fr 1fr 4fr" br="0.5rem">
          <TableRow>
            <TableCell th fs="1.6rem">No</TableCell>
            <TableCell th fs="1.6rem">구분</TableCell>
            <TableCell th fs="1.6rem">등록일</TableCell>
            <TableCell th fs="1.6rem">내용</TableCell>
          </TableRow>
          <TableRow
            v-if="!isEmpty"
            v-for="(item, index) in showList"
            :key="index"
          >
            <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['discipline_reward_name']
            }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{
              item['created_at']
            }}</TableCell>
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
  </CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import DisciplineRewardTypeDropDown from '@/components/dropdowns/DisciplineRewardTypeDropDown.vue';
import { getDisciplineReward } from '@/api/emp_attach';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const drList = ref([]);
const showList = ref([]);
const isEmpty = ref(true);

const route = useRoute();

const props = defineProps({
  employee_id: {
    type: String,
    required: false,
  },
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
    const sortedResponse = sortByDate(
      response[0].discipline_rewards.map((row) => ({
        ...row,
        created_at: row['created_at'].split('T')[0],
      }))
    );
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
    showList.value = drList.value.filter(
      (row) => row.discipline_reward_name === selectedType.value
    );
  }
};

const employeeId = ref('');

onMounted(() => {
  employeeId.value = props.employee_id || localStorage.getItem('employeeId');
  fetchDate(employeeId.value);
});

watch(
  () => props.employee_id,
  (newVal) => {
    employeeId.value = newVal || localStorage.getItem('employeeId');
    fetchDate(employeeId.value);
  },
  { immediate: true }
);

watch(showList, (newValue) => {
  isEmpty.value = newValue.length === 0;
});
</script>

<style scoped>
.common-article {
  position: relative;
  margin-top: 2rem;
}

.ca {
  align-self: center;
}

.select-data {
  position: absolute;
  top: 0;
  right: 8.6rem;
}

.read-btn {
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
