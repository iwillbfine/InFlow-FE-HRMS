<template>
    <div class="container">
        <div class="one-content">
            <div class="profile-image">
                <img src="@/assets/Inflow_profile_img.png" alt="">
            </div>
            <div class="profile-detail">
                <div class="name-and-position">
                    <span>강호동</span>
                    <span>/</span>
                    <span>팀장</span>
                </div>
                <div class="department">
                    영업부/국내영업팀/영업1팀
                </div>
            </div>

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
</style>