<template>
    <div class="container">
        <div class="profile">
            <div class="profile-image">
                <img src="@/assets/Inflow_profile_img.png" alt="">
            </div>
            <div class="name-and-position">
                <span>강호동</span>/
                <span>팀장</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="profile-detail">
            <table class="info-table">
                <tbody>
                <tr>
                    <td class="label">소속 부서</td>
                    <td>영업부 / 국내영업팀 / 영업1팀</td>
                </tr>
                <tr>
                    <td class="label">사내 메일</td>
                    <td>hodonggi@gmail.com</td>
                </tr>
                <tr>
                    <td class="label">휴대 번호</td>
                    <td>010-5533-1142</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
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
}
.profile {
    width: 90%;
    font-size: 2rem;
    display: flex;           
    flex-direction: column;  
    align-items: center;     
}

.profile-image {
    width: 50%;
    height: auto;
    margin-top: 50px;
    display: flex;
    justify-content: center; 
}

.name-and-position {
    font-size: 2.1rem;
    margin-top: 10px;
    text-align: center; 
    font-weight: bold;
}

.line {
    width: 90%;
    height: 1px; 
    background-color: #CBCBCB; 
    margin: 20px 0; 
}

.profile-detail {
    width: 90%;
    display: flex; 
    justify-content: center; 
}

.info-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #003566; 
    text-align: center;
}

.info-table td,
.info-table th {
    border: 1px solid #003566; 
    padding: 8px;
    font-size: 14px;
}

.info-table .label {
    background-color: #003566; 
    color: white;            
    text-align: center; 
    width: 30%;
}

.info-table tr:nth-child(2) .label,
.info-table tr:nth-child(3) .label {
    border-top: 1.5px solid white; /* 위쪽에 흰색 구분선 */
}
</style>