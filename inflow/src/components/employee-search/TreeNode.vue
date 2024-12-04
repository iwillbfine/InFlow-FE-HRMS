<template>
    <li class="tree-node">
      <div class="node" :style="{ marginLeft: `${level * 30}px` }">
        <span v-if="node.sub_departments.length > 0" @click="toggleExpand">
          {{ isExpanded ? '&#8250;' : '⌵' }}
        </span>
        <span>&nbsp;</span>
        <span
          class="department-name"
          @click="selectDepartment(node.department_code)"
        >
          {{ node.department_name }}
        </span>
      </div>
  
      <!-- 트랜지션을 사용하여 하위 부서 목록 애니메이션 -->
      <transition
        name="expand"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <ul
          v-if="isExpanded && node.sub_departments.length > 0"
          class="sub-department"
        >
          <TreeNode
            v-for="child in node.sub_departments"
            :key="child.department_code"
            :node="child"
            :level="level + 1"
            @select="selectDepartment"
          />
        </ul>
      </transition>
    </li>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import TreeNode from '@/components/employee-search/TreeNode.vue';
  
  defineProps({
    node: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  });
  
  const isExpanded = ref(false);
  
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
  };
  
  const emit = defineEmits(['select']);
  const selectDepartment = (department) => {
    emit('select', department);
  };
  
  // 트랜지션 훅
  const beforeEnter = (el) => {
    el.style.height = '0';
    el.style.opacity = '0';
  };
  
  const enter = (el, done) => {
    const height = el.scrollHeight; // 실제 높이 측정
    el.style.height = `${height}px`;
    el.style.opacity = '1';
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    setTimeout(() => {
      el.style.height = null; // 애니메이션 완료 후 초기화
      done();
    }, 300);
  };
  
  const leave = (el, done) => {
    el.style.height = `${el.scrollHeight}px`; // 현재 높이 설정
    el.style.opacity = '1'; // 현재 불투명도 설정
    el.style.transition = 'height 0.4s ease, opacity 0.2s ease'; // 트랜지션 설정
  
    // 애니메이션 시작
    requestAnimationFrame(() => {
      el.style.height = '0';
      el.style.opacity = '0';
    });
  
    // 트랜지션 완료 후 초기화
    setTimeout(() => {
      done();
    }, 400); // `height` 트랜지션 시간과 동일하게 설정
  };
  </script>
  
  <style scoped>
  .node {
    font-size: 2rem;
    color: #003566;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.2s ease-in-out;
  }
  
  .node:hover {
    background-color: #e3f2fd;
    color: #002d62;
    border-radius: 4px;
    padding: 4px;
  }
  
  .department-name {
    flex-grow: 1;
    cursor: pointer;
  }
  
  .sub-department {
    overflow: hidden;
  }
  </style>