<template>
  <FlexItem class="content-header" fld="row" h="6rem" w="90%">
    <ChangeMonthComponent
      class="child1"
      :cur-month="curMonth"
      description="인사발령 내역"
      @go-prev-month="goPrevMonth"
      @go-next-month="goNextMonth"
    />
    <SelectAppTypeComponent
      :y="curMonth.split('-')[0]"
      :m="curMonth.split('-')[1]"
      class="select-data"
      @selected="goSelectedPoint"
    />
  </FlexItem>

  <FlexItem class="content-body" fld="column" h="calc(100% - 6rem)" w="90%">
    <div class="table-wrapper">
      <TableItem class="commute-table" gtc="repeat(9, 1fr)" br="0.5rem">
        <TableRow>
          <TableCell th fs="1.6rem">No</TableCell>
          <TableCell th fs="1.6rem">일자</TableCell>
          <TableCell th fs="1.6rem">유형</TableCell>
          <TableCell th fs="1.6rem">사원</TableCell>
          <TableCell th fs="1.6rem">부서</TableCell>
          <TableCell th fs="1.6rem">직무</TableCell>
          <TableCell th fs="1.6rem">직위</TableCell>
          <TableCell th fs="1.6rem">직책</TableCell>
          <TableCell th fs="1.6rem">담당자</TableCell>
        </TableRow>
        <TableRow v-if="!isEmpty" v-for="(item, index) in appointmentHistory" :key="index">
          <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['appointed_at'].split(' ')[0] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['appointment_item_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['employee_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['department_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['duty_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['position_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['role_name'] }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{ item['authorizer_name'] }}</TableCell>
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
      인사발령 내역이 존재하지 않습니다.
    </FlexItem>
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import SelectAppTypeComponent from '@/components/common/SelectAppTypeComponent.vue';
import ChangeMonthComponent from '@/components/common/ChangeMonthComponent.vue';
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAppHistoryByMonth } from '@/api/emp_attach';

const curMonth = ref('');
const appointmentHistory = ref([]);
const isEmpty = ref(true);

const router = useRouter();
const route = useRoute();
const selectedType = ref('전체');

const fetchDate = async (date) => {
  if (!date || typeof date !== 'string' || date.split('-').length < 3) {
    date = getCurMonth();
  }

  const [year, month, type = '전체'] = date.split('-');
  curMonth.value = `${year}-${month}`;
  selectedType.value = type;

  const response = await getAppHistoryByMonth(year, month);

  if (response) {
    appointmentHistory.value =
      type === '전체'
        ? response
        : response.filter((row) => row['appointment_item_name'] === type);
    isEmpty.value = appointmentHistory.value.length === 0;
  } else {
    appointmentHistory.value = [];
    isEmpty.value = true;
  }
};

const getCurMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-전체`;
};

const navigateTo = (path, data) => {
  router.push({ path, query: { data } });
};

const goPrevMonth = (prevMonth) => {
  navigateTo('/hr-management/appointment/history', `${prevMonth}-전체`);
};

const goNextMonth = (nextMonth) => {
  const [endYear, endMonth] = getCurMonth().split('-').slice(0,2);
  const [moveYear, moveMonth] = nextMonth.split('-');
  if(endYear>moveYear || endYear===moveYear && endMonth>=moveMonth){
    navigateTo('/hr-management/appointment/history', `${nextMonth}-전체`);
    return;
  }
  else return;
};

const goSelectedPoint = (selectedData) => {
  navigateTo('/hr-management/appointment/history', selectedData);
};

watch(
  () => route.query,
  (newData) => {
    curMonth.value = newData.data || getCurMonth();
    fetchDate(curMonth.value)
  },
  { immediate: true }
)

onMounted(() => {
  curMonth.value = getCurMonth();
  fetchDate(curMonth.value);
});

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
  position: relative;
  justify-content: center;
  align-items: center;
}

.select-data {
  position: absolute;
  right: 0;
  bottom: 0;
  gap: 1rem;
}
.select-data ::v-deep(.app-his-dropdown .dropdown .dropdown-header) {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  height: 3.6rem;
  align-items: center;
}

.content-body {
  width: 80%;
  margin-top: 2.5rem;
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
