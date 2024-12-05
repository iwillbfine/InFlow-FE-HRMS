<!-- 부서 추가 컴포넌트 -->
<template>
    
    <div class="button-container">
        <button 
            class="button"
            @click="toggleAddMode">
            <!-- 추가 클릭하면 추가할 수 있도록 바뀜, 추가 버튼은 등록으로 바뀜, 등록 클릭하면 등록되었다는 팝업창 뜸-->
            {{ isEditMode ? '등록' : '추가' }}
        </button>
    </div>
    <div style="width: 100%; height: 100%; margin-top: 2rem;">

        <div v-if="!isEditMode" class="no-info">
            <span>
                <p>부서를 추가하려면 추가 버튼을 클릭해주세요</p>
            </span>
        </div>

        <TableItem gtc="5fr 20fr" style="height: 50%;" v-else>
            <TableRow>
                <TableCell class="h-7" th fs="1.6rem" topl>부서명</TableCell>
                <TableCell class="h-7 pl-2" fs="1.6rem" topr>
                    <div>
                        <input 
                        v-model="editableData.department_name" 
                        type="text" 
                        class="editable-input" 
                        placeholder="부서명을 입력하세요"
                        />
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell class="h-7" th fs="1.6rem" botl>부서 코드</TableCell>
                <TableCell class="h-7 pl-2" fs="1.6rem" botr>
                    <div>
                        <input 
                        v-model="editableData.department_code" 
                        type="text" 
                        class="editable-input" 
                        placeholder="부서 코드를 입력하세요"
                        />
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell class="h-7" th fs="1.6rem" botl>상워 부서명</TableCell>
                <TableCell class="h-7 pl-2" fs="1.6rem" botr>
                    <div>
                        <select v-model="editableData.upper_department_name" class="editable-select">
                            <option value="" disabled selected>상위 부서를 선택해주세요</option>
                            <option v-for="dept in upperDepartments" 
                                :key="dept.department_code" 
                                :value="dept.department_name">
                                {{ dept.department_name }}
                            </option>
                        </select>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell class="h-7" th fs="1.6rem" botl>최소 인원수</TableCell>
                <TableCell class="h-7 pl-2" fs="1.6rem" botr>
                    <div>
                        <input 
                        v-model="editableData.min_employee_num" 
                        type="number" 
                        class="editable-input" 
                        placeholder="최소 인원수를 입력하세요"
                        />
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell class="h-7" th fs="1.6rem" botl>부서장</TableCell>
                <TableCell class="h-7 pl-2" fs="1.6rem" botr>
                    <div>
                        <input 
                        v-model="editableData.department_head_name" 
                        type="text" 
                        class="editable-input" 
                        placeholder="부서장명을 입력하세요"
                        />
                    </div>
                </TableCell>
            </TableRow>

        </TableItem>
    </div>

    <!-- 성공 메시지 모달 -->
    <div v-if="savedButtonStatus" class="modal-alert">
        <div class="modal">
        <p>성공적으로 등록되었습니다!</p>
        </div>
    </div>

</template>


<script setup>
    import TableItem from '@/components/semantic/TableItem.vue';
    import TableRow from '@/components/semantic/TableRow.vue';
    import TableCell from '@/components/semantic/TableCell.vue';

    import apiClient from '@/api/axios';

    import { ref, watch, onMounted } from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const isEditMode = ref(false);
    const upperDepartments = ref([]); // 상위 부서 목록

    // 상태 관리
    const editableData = ref({
    });

    // 상위 부서 목록 가져오기
    const fetchUpperDepartments = async () => {
        try {
            const response = await apiClient.get('/departments/dropdown');
            upperDepartments.value = response.data.content;
            console.log("상위 부서 목록:", upperDepartments.value);
        } catch (error) {
            console.error('상위 부서 목록을 가져오는 데 실패했습니다.', error);
        }
    };

    // 추가/등록 버튼 핸들링
    const toggleAddMode = async () => {
        if (isEditMode.value) {
        // 저장 로직 실행
        try {
            // upper_department_name을 기반으로 upper_department_code 설정
            const selectedDepartment = upperDepartments.value.find(
                (dept) => dept.department_name === editableData.value.upper_department_name
            );
            editableData.value.upper_department_code = selectedDepartment
                ? selectedDepartment.department_code
                : null;



            const response = await apiClient.post('/departments/add-department', editableData.value);
            
            if (response.data.success) {
                savedButtonStatus.value = true;
                // 3초 후 모달창 닫기
                setTimeout(() => {
                    closeModal();
                }, 1200);
                console.log('부서 정보가 성공적으로 추가되었습니다.');
                console.log("추가된 부서 정보:", response.data.content)
            } else {
                console.error('추가 실패:', response.data.error.message);
                alert(`추가 실패: ${response.data.error.message}`); // 에러 메시지 표시
            }
        } catch (error) {
            console.error('부서 정보 추가에 실패했습니다.', error);
        }
    }
    isEditMode.value = !isEditMode.value; // 수정 모드 상태 토글
    };


    // 수정 저장 버튼 상태 
    const savedButtonStatus = ref(false);     // 기본값 false로 -> 저장 되고 나면 true로 바뀜
    // 모달창 닫기 핸들러
    const closeModal = () => {
        savedButtonStatus.value = false; // 상태 초기화
    };


    // 라우트 변경 감지
    watch(
        () => route.query.departmentCode,
        (newCode) => {
            if (newCode) fetchDepartmentInfo(newCode);
        },
        { immediate: true }
    );

    // 컴포넌트 마운트 시 데이터 초기화
    onMounted(() => {
        fetchUpperDepartments(); // 상위 부서 목록 호출
    });

</script>

<style scoped>
span{
    color: #003566;
    margin-left: 20px;
    font-size: 1.6rem;
    font-weight: 500;
}

.no-info{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; /* 부모 높이를 100%로 설정 */
    text-align: center; /* 텍스트 가운데 정렬 */
    font-size: 1.5rem; /* 폰트 크기 */
    color: #555; /* 텍스트 색상 */
}

.button-container{
    width: 100%; 
    display: flex; 
    justify-content: flex-end; 
    margin-bottom: 1rem;
}
.button{
    background-color: #003566;
    padding: 0.7rem 2rem;
    color: white;
    border-radius: 3px;
    font-size: 1.3rem;
    align-items: flex-end;
}


/* 입력 필드 스타일 */
.editable-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
    transition: border-color 0.3s ease;
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.25);
    background: #F8F8F8;
}

.editable-input:focus {
  border-color: #003566; /* 포커스 시 색상 */
}

/* 드롭다운 스타일 */
.editable-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    outline: none;
    transition: border-color 0.3s ease;
}

.editable-select:focus {
  border-color: #003566; /* 포커스 시 색상 */
}


/* 모달 css */
.modal-alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
}

.modal p {
    font-size: 1.2rem;
    margin: 0;
}

/* 모달 페이드 인/아웃 애니메이션 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10%);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-10%);
    }
}

</style>