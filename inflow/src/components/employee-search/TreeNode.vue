<template>
    <li class="tree-node">
        <div 
            class="node"
            :style="{ marginLeft: `${level * 20}px` }"
            @click="toggleExpand">
            <span v-if="node.sub_departments.length > 0">
                <!-- 하위 부서가 존재하는 경우  -->
                <!-- <img :src="isExpanded ? '@/assets/icons/fold.png' : '@/assets/icons/unfold.png'" alt="">             -->
                ({{isExpanded ? '접기' : '펼치기'}})

            </span>
            <span>{{ node.department_name }}</span>

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
        default: 0, // 기본 깊이는 0
    }
    });

    // 토글 상태 관리 변수 -> 기본값은 false로 들어감
    const isExpanded = ref(false);

    // 클릭시 확장 또는 축소
    const toggleExpand = () => {
        isExpanded.value = !isExpanded.value;
        // 클릭하면 isExpanded 상태 변화 
    }

    // 선택된 부서 이벤트 상위로 전달
    const emit = defineEmits(['select']);
    const selectDepartment = (department) => {
    emit('select', department);
    };

</script>

<style scoped>
.node{
    font-size:2rem;
    color: #003566;
    font-weight: bold;
}
.tree-node{

}
.sub-department{
}
</style>