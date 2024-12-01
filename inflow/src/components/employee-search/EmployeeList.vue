<template>
    <div v-if="employees && employees.length > 0"class="container">
        <div class="one-content" 
                v-for="employee in employees"
                :key="employee.employee_number"
                @click="selectEmployee(employee.employee_number)">  <!-- 사원코드 상위에 전달 -->
            <div class="profile-image">
                <!-- <img :src="employee.profile_image_url || '@/assets/Inflow_profile_img.png'" alt=""> -->
                <!-- "@/assets/Inflow_profile_img.png"  -->
                <img src="@/assets/Inflow_profile_img.png" alt="">
            </div>
            <div class="profile-detail">
                <div class="name-and-position">
                    <span>{{employee.employee_name}}</span>
                    <span>/</span>
                    <span>{{employee.role_name }}</span>
                </div>
                <div class="department">
                    {{employee.department_path}}
                </div>
            </div>

        </div>
    </div>
    <div v-else class="container">
        <div class="no-list">
            <span>사원 정보가 없습니다. </span>
        </div>
    </div>

</template>

<script setup>
console.log("EmployeeList컴포넌트");

defineProps({
    employees: {
        type: Array,
        // required: true,
        default: () => ({}),

    },
});


// select 이벤트
const emit = defineEmits(['select'])
// selectEmployee 함수
const selectEmployee = (employeeCode) => {
    console.log("클릭됨");
    console.log("전달된 사원코드:", employeeCode);
    emit('select', employeeCode)
}

</script>

<style scoped>
.container {
    background-color: white;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    height: 100%;
    display: flex;           
    flex-direction: column;  
    align-items: center;  
    overflow-y: auto; /* 수직 스크롤 활성화 */
    overflow-x: hidden; /* 수평 스크롤 비활성화 */
    max-height: 100%; /* 부모 요소의 최대 높이에 맞추기 */
}
.one-content{
    width: 98%;
    height: auto;
    background-color: white;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    margin-top: 7px;
    display: flex;
    padding: 10px;
}
.profile-detail{
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-left: 20px;
    justify-content: center;
}
.profile-image{
    width: 15%;
    height: auto;
}
.attendance-status{
    display: flex;

}
.name-and-position {
    text-align: center; 
}
.name-and-position span{
    font-size: 2.1rem;
    font-weight: bold;
    margin-right: 4px ;
}
.department{
    font-size: 1.7rem;
}

.no-list{
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>