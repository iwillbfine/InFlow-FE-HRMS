<template>
    <div class="department-attendance">
        <div class="title">
            <span>오늘의 부서 출근 상태</span>
        </div>
        <div class="detail">
            <span>13</span>명/
            <span>16</span>명
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.department-attendance{
    width: 100%;
    height: 100%;
    background-color: #003566;
    /* padding: 4rem 3.5rem; */
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    font-weight: 500;
}
.title{
    font-size: 2rem;
    color: white;
}
.detail{
    font-size: 2rem;
    color: white;
}
</style>