<template>
  <div class="department-heirarchy">
    <div class="root">
      <BuildingIcon></BuildingIcon>
      <span>INFLOW</span>
    </div>
    <!-- 최상위 부서 목록 -->
    <!-- 재귀적으로 부서 조회 -->
    <ul>
      <TreeNode
        v-for="department in departments"
        :key="department.department_code"
        :node="department"
        :level="0"
        @select="selectDepartment"
      />
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 재귀적으로 호출되는 컴포넌트
import TreeNode from '@/components/employee-search/TreeNode.vue';
import BuildingIcon from '../icons/BuildingIcon.vue';

// 부모 컴포넌트에서 부서 코드가 넘어오는 경우

defineProps({
  departments: {
    type: Array,
    required: true,
  },
});

// 하나의 부서 컴포넌트가 선택되면, select 이벤트 호출 -> 상위로 선택된 부서 전달
// 이벤트 선언
const emit = defineEmits(['select']);
const selectDepartment = (department) => {
  emit('select', department);
};
</script>

<style scoped>
.root {
  display: flex;
  align-items: center;
  font-size: 2rem;
  color: #003566;
  gap: 0.7rem;
}

.root > span {
  font-weight: 500;
}

.department-heirarchy > ul {
  margin-left: 2rem;
  margin-top: 1rem;
}
</style>
