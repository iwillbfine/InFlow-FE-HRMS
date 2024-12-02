<template>
    <div class="search-department-member">
        <div class="search-bar">
            <input v-model="searchKeyword" type="text" placeholder="사원명으로 검색">
            <button @click="filterMembers">검색</button>
        </div>
        <div>
            <p v-if="isLoading">데이터를 불러오는 중...</p>
            <div v-else>
                <div 
                    class="one-member-content"
                    v-for="employee in filteredMembers"
                    :key="employee.employee_number">
                    <div class="detail">
                        <div class="name">
                            <span>{{employee.employee_name}}</span> <!--{{ employee.employee_name}}-->
                        </div>
                        <div class="employee-number">
                            <span>{{ employee.employee_number }}</span>   <!--{{ employee.employee_number }}-->
                        </div>
                        <div class="department-path">
                            <span>{{employee.department_path}}</span> <!--{{ employee.department_path }}-->
                        </div>
                    </div>
                    <div class="attendance-status">
                        <span>{{employee.attendance_status_type_name}}</span>   <!-- {{employee.attenance_status_type_name}}-->
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
<script setup>



import { ref, watch , onMounted, defineProps} from 'vue';

// props 선언
const props = defineProps({
    departmentCode: {
        type: String,
        required: true,
    },
    members: Array
});


console.log('멤버스:', props.members);


// 상태 관리
const isLoading = ref(false);   // 기본값 false
const filteredMembers = ref([]); // 검색된 결과를 따로 저장

// 검색 기능
const searchKeyword = ref('');
const filterMembers = () => {
    if (!props.members ||props.members.length === 0) {
        console.error("members가 유효하지 않습니다.");
        filteredMembers.value = []; // 빈 배열로 초기화
        return;
    }

    const keyword = searchKeyword.value.toLowerCase();
    if (keyword === '') {
        filteredMembers.value = props.members; // 검색어가 없으면 전체 보여주기
    } else {
        filteredMembers.value = props.members.filter((member) =>
            member.employee_name.toLowerCase().includes(keyword)
        );
    }
};
// 검색어가 변경될 때 필터링 실행
watch(searchKeyword, filterMembers);


// watch(isLoading, (newVal) => {
//     console.log("isLoading 상태:", newVal);
// });

watch(
    () => props.members,
    (newVal) => {
        console.log("members 변경:", newVal);
        if (newVal && newVal.length > 0) {
            filteredMembers.value = newVal; // 변경된 데이터 반영
        }
    },
    { immediate: true }
);


// onMounted(() => {
//   console.log("부모로부터 전달된 members:", members); // 디버깅용 로그
//   filteredMembers.value = [...members]; // 초기화
// });

// watch(filteredMembers, (newVal) => {
//     console.log("filteredMembers 상태 변경:", newVal);
// });


// watch(
//     () => members,
//     (newVal) => {
//         console.log("members 변경:", newVal);
//         if (newVal && newVal.length > 0) {
//             filteredMembers.value = newVal; // 변경된 데이터 반영
//         }
//     },
//     { immediate: true }
// );


</script>

<style scoped>
.search-department-member{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.search-bar{
    background-color: white;
    border: 0.3px solid #CCCCCC;
    border-radius: 1px;
    width: 95%;
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
}

.search-bar input::placeholder {
    font-size: 13px;
}

.one-member-content{
    width: 95%;
    background-color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
}

.name{
    font-size: 2rem
}
.employee-number{
    font-size: 1rem;
}

.department-path{
    font-size: 1rem;
}

.attendance-status{
    font-size: 1.2rem;
}
</style>