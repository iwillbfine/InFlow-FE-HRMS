<template>
    <div class="container">
        <input class="search-input" placeholder="사원명/부서명/전화번호를 입력해주세요"></input>
        <button class="search-button">
            검색
        </button>

    </div>
    
</template>

<script setup>

</script>

<style scoped>
    .container{
        display: flex;
        width: 100%;
        height: 4rem;
        font-size: 2rem;
        font-weight: lighter;
    }

    .search-input{
        width: 95%;
        background-color: #F8F8F8;
        text-align: right;
        padding: 0 21px;

    }
    .search-input::placeholder{
        text-align: right;
        font-size: 1.8rem;
    }

    .search-button{
        width: 5%;
        background-color: #003566;
        color: white;
    }
    
</style>