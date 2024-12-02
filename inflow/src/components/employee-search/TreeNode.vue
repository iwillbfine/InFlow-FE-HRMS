<template>
    <li class="tree-node">
        <div class="node"
            :style="{ marginLeft: `${level * 30}px` }">

            <!-- 화살표 아이콘 클릭했을때, 토글 상태 변경 -> 목록 보이고/숨기기-->
            <span 
                v-if="node.sub_departments.length > 0"
                @click="toggleExpand">
                <!-- 하위 부서가 존재하는 경우  -->
                <!-- <img :src="isExpanded ? '@/assets/icons/fold.png' : '@/assets/icons/unfold.png'" alt="">             -->
                {{isExpanded ? '&#8250;' : '⌵'}}
            </span>
            <span>&nbsp;</span>
            <span
                class="department-name"
                @click="selectDepartment(node.department_code)">
                {{ node.department_name }}
            </span>

        </div>

        <!-- 하위 부서가 존재하는 경우 + isExpended값이 true인 경우 -> 하위 부서 목록 쭉 보이기 -->
        <ul v-if="isExpanded && node.sub_departments.length > 0" class="sub-department">
            <TreeNode
                v-for="child in node.sub_departments"
                :key="child.department_code"
                :node="child"
                :level="level + 1" 
                @select="selectDepartment">
            </TreeNode>
        </ul>

    </li>
</template>

<script setup>
    import {ref} from 'vue';
    import TreeNode from '@/components/employee-search/TreeNode.vue';

    defineProps({
        node: {
            type: Object,
            required: true,
        },
        level: {
        type: Number,
        default: 0, // 기본 깊이 0
    }
    });

    // 토글 상태 관리 변수 -> 기본값은 false로 들어감
    const isExpanded = ref(false);
    // 클릭시 확장 또는 축소
    const toggleExpand = () => {
        isExpanded.value = !isExpanded.value;
        console.log("토글 상태 변동됨");
        // 클릭하면 isExpanded 상태 변화 
    }

    // 선택된 부서 이벤트 상위로 전달
    const emit = defineEmits(['select']);
    const selectDepartment = (department) => {
        console.log("selectDepartment이벤트 발생:", department);
        emit('select', department);
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
    transition: background-color 0.2s, color 0.2s; /* 부드러운 전환 효과 */
}

.node:hover {
    background-color: #e3f2fd; /* 밝은 파란색 배경 */
    color: #002d62; /* 어두운 파란색 텍스트 */
    border-radius: 4px; /* 약간 둥글게 */
    padding: 4px; /* 약간의 내부 여백 */
}

.department-name {
    flex-grow: 1;
    cursor: pointer;
}


</style>