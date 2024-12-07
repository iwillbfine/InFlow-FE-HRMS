<template>
  <ArticleItem
    class="search-emp"
    h="calc(100% - 23.6rem)"
    w="36rem"
    bgc="#f8f8f8"
  >
    <FlexItem
      class="search-bar"
      fld="row"
      w="100%"
      fs="1.5rem"
      bgc="#fff"
      b="0.6px solid #ccc"
      br="0.3rem"
    >
      <input
        v-model="keyword"
        name="search-emp-input"
        type="text"
        placeholder="사원명, 사번, 부서명, 전화번호로 검색"
        @keyup.enter="searchEmployee"
      />
      <SearchButton
        h="4rem"
        w="4rem"
        bgc="#E6E6E6"
        c="#5a5a5a"
        fs="1.7rem"
        br="0rem 0.3rem 0.3rem 0rem"
        @click="searchEmployee"
      ></SearchButton>
    </FlexItem>
    <UlItem
      v-if="!isEmpty"
      class="emp-list"
      fld="column"
      h="calc(100% - 4rem)"
      w="100%"
    >
      <LiItem
        v-for="(item, index) in employeeList"
        :key="index"
        class="emp-item"
        w="100%"
        h="10rem"
        bgc="#fff"
        b="0.6px solid #ccc"
        br="0.3rem"
        @click="handleSelected(item)"
      >
        <span class="emphasize">{{ item.employee_name }}</span>
        <span class="normal">{{ item.employee_number }}</span>
        <span class="normal">{{ item.department_path }}</span>
      </LiItem>
    </UlItem>
    <FlexItem
      v-if="isEmpty"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.4rem"
    >
      검색된 사원이 없습니다.
    </FlexItem>
  </ArticleItem>
</template>

<script setup>
import SearchButton from '@/components/buttons/SearchButton.vue';
import ArticleItem from '@/components/semantic/ArticleItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import LiItem from '@/components/semantic/LiItem.vue';
import UlItem from '@/components/semantic/UlItem.vue';
import {
  getAllDepartmentMembers,
  getEmployeesByKeywordOrDepartmentCode,
} from '@/api/department';
import { ref, onMounted } from 'vue';

const emit = defineEmits(['employee-selected']);

const employeeList = ref([]);
const isEmpty = ref(true);
const keyword = ref('');

const fetchSearchedEmployeeData = async (keyword) => {
  const response = await getEmployeesByKeywordOrDepartmentCode(keyword);

  if (response.success) {
    employeeList.value = response.content;
    isEmpty.value = employeeList.value.isEmpty ? true : false;
  } else {
    employeeList.value = [];
    isEmpty.value = true;
  }
};

const fetchAllEmployeeData = async () => {
  const response = await getAllDepartmentMembers();

  if (response.success) {
    employeeList.value = response.content;
    isEmpty.value = employeeList.value.isEmpty ? true : false;
  } else {
    employeeList.value = [];
    isEmpty.value = true;
  }
};

const searchEmployee = () => {
  if (!keyword.value) fetchAllEmployeeData();
  else fetchSearchedEmployeeData(keyword.value);
};

const handleSelected = (item) => {
  emit('employee-selected', item);
};

onMounted(() => {
  fetchAllEmployeeData();
});
</script>

<style scoped>
.search-emp {
  position: fixed;
  padding: 0.8rem;
  top: 23.6rem;
  left: 14rem;
  z-index: 2;
}

.search-bar input {
  height: 100%;
  width: calc(100% - 3.6rem);
  padding-left: 1rem;
  border-right: 0.6px solid #ccc;
  overflow: hidden;
}

.emp-list {
  margin-top: 1.5rem;
  gap: 1rem;
  overflow-y: auto;
}

.emp-item {
  padding: 1.2rem;
  gap: 0.3rem;
}

.emphasize {
  font-size: 2.2rem;
  font-weight: 500;
}

.normal {
  font-size: 1.2rem;
  font-weight: 400;
}

.empty-message {
  justify-content: center;
  align-items: center;
}
</style>
