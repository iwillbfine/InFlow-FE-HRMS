<template>
    <SectionItem class="feedback-section" w="calc(100% - 36rem)">
      <CommonArticle label="부서원 평가">
        <FlexItem class="year-half-section" fld="row" fs="1.6rem" fw="500" c="#003566">
          <YearDropDown @valid-date-selected="handleYearSelected" />
          <HalfDropdown @half-selected="handleHalfSelected" />
        </FlexItem>
        <FlexItem
          class="profile"
          fld="row"
          w="100%"
          h="14rem"
          bgc="#fff"
          br="0.6rem"
        >
          <FigureItem
            v-if="selectedEmployee"
            class="profile-img-wrapper"
            h="100%"
            w="10.5rem"
          >
            <img :src="selectedEmployee.profile_image_url" alt="Profile Image" />
          </FigureItem>
          <FlexItem
            v-if="selectedEmployee"
            class="emp-info"
            fld="column"
            h="100%"
          >
            <span class="emphasize">{{ selectedEmployee.employee_name }}</span>
            <span class="normal">{{ selectedEmployee.employee_number }}</span>
            <span class="normal">{{ selectedEmployee.department_path }}</span>
          </FlexItem>
          <FlexItem
            v-else
            class="empty-message"
            fld="row"
            h="100%"
            w="100%"
            fs="2rem"
          >
            사원을 선택해주세요.
          </FlexItem>
        </FlexItem>
        <TableItem class="emp-task"gtc="2fr 3fr 6fr 8fr 2fr 2fr">
          <TableRow>
            <TableCell th fs="1.6rem" topl>No</TableCell>
            <TableCell th fs="1.6rem">유형</TableCell>
            <TableCell th fs="1.6rem">과제명</TableCell>
            <TableCell th fs="1.6rem" topr>과제 내용</TableCell>
            <TableCell th fs="1.6rem">가중치</TableCell>
            <TableCell th fs="1.6rem">점수</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="mid" fs="1.6rem">1</TableCell>
            <TableCell class="mid" fs="1.6rem">개인 과제</TableCell>
            <TableCell class="mid" fs="1.6rem">과제 이름입니다.</TableCell>
            <TableCell class="mid" fs="1.6rem">과제 내용입니다.</TableCell>
            <TableCell class="mid" fs="1.6rem">0.5</TableCell>
            <TableCell class="mid" fs="1.6rem">
              <FlexItem class="input-wrapper" h="100%" w="100%" bgc="#F8F8F8" b="1px solid #DBDBDB" br="0.1rem">
                <input v-model="taskScore" name="task-grade-input" type="text" maxlength="3" @input="limitTaskScore">
              </FlexItem>
            </TableCell>
          </TableRow>
        </TableItem>
        <TableItem gtc="7fr">
          <TableRow>
            <TableCell class="h-8" th fs="1.6rem" topl>피드백 내용</TableCell>
          </TableRow>
          <TableRow h="100%">
            <TableCell class="h-12 pl-2" fs="1.6rem" botr>
              <textarea
                v-model="feedbackContent"
                class="feedback-input custom-scrollbar"
                placeholder="피드백 내용을 입력하세요"
              ></textarea>
            </TableCell>
          </TableRow>
        </TableItem>
        <ButtonItem
          class="submit-btn"
          h="3.6rem"
          w="7.2rem"
          bgc="#003566"
          br="0.6rem"
          c="#fff"
          fs="1.6rem"
          :disabled="isLoading"
          @click="handleOnclick"
        >
          {{ isLoading ? '처리중...' : buttonText }}
        </ButtonItem>
      </CommonArticle>
      <SearchEmployeeComponent @employee-selected="handleSelected"></SearchEmployeeComponent>
    </SectionItem>
  </template>

  <script setup>
  import { ref, watch, computed } from 'vue';
  import FlexItem from '@/components/semantic/FlexItem.vue';
  import FigureItem from '@/components/semantic/FigureItem.vue';
  import SectionItem from '@/components/semantic/SectionItem.vue';
  import CommonArticle from '@/components/common/CommonArticle.vue';
  import TableItem from '@/components/semantic/TableItem.vue';
  import TableRow from '@/components/semantic/TableRow.vue';
  import TableCell from '@/components/semantic/TableCell.vue';
  import ButtonItem from '@/components/semantic/ButtonItem.vue';
  import SearchEmployeeComponent from '@/components/common/SearchEmployeeComponent.vue';
  import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
  import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
  import { createFeedback, findFinalGrade, findFeedbacks, updateFeedback } from '@/api/evaluation';

  // 상태 관리
  const selectedEmployee = ref(null);
  const selectedYear = ref(null);
  const selectedHalf = ref(null);
  const feedbackContent = ref('');
  const isLoading = ref(false);
  const feedbackData = ref(null);
  const currentEvaluationId = ref(null);
  const taskScore = ref(null);

  const limitTaskScore = () => {
    const score = parseInt(taskScore.value);
    if (isNaN(score)) {
      taskScore.value = null;
      return;
    }

    if (score> 100) taskScore.value = 100;
    else if (score < 0) taskScore.value = 0;
    else taskScore.value = score;

    console.log(taskScore.value);
  };

  // 버튼 텍스트 계산
  const buttonText = computed(() => {
    return feedbackData.value?.feedback_id ? '수정' : '등록';
  });

  const handleSelected = (employee) => {
    selectedEmployee.value = employee;
  }

  const handleYearSelected = (year) => {
    selectedYear.value = year;
  };

  const handleHalfSelected = (half) => {
    selectedHalf.value = half;
  };

  // 피드백 조회
  watch([selectedEmployee, selectedYear, selectedHalf], async (newValues) => {
    const [employeeId, year, half] = newValues;

    if (employeeId && year && half) {
      try {
        isLoading.value = true;
        console.log('조회 시작:', { employeeId, year, half });

        // 평가 정보 조회
        const evaluationResponse = await findFinalGrade(employeeId, year, half);
        currentEvaluationId.value = evaluationResponse?.content?.evaluation_id;
        console.log('평가 ID:', currentEvaluationId.value);

        // 피드백 조회
        const response = await findFeedbacks(employeeId, year, half);
        feedbackData.value = response.content;
        console.log('조회된 피드백:', feedbackData.value);

        // 입력 필드 초기화
        feedbackContent.value = '';

      } catch (error) {
        console.error('데이터 조회 중 에러:', error);
        alert('데이터 조회 중 오류가 발생했습니다.');
      } finally {
        isLoading.value = false;
      }
    }
  });

  // 피드백 등록/수정 처리
  const handleOnclick = async () => {
    if (!selectedEmployee.value || !selectedYear.value || !selectedHalf.value || !feedbackContent.value.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      isLoading.value = true;

      if (feedbackData.value?.feedback_id) {
        console.log('수정 시작 - 기존 피드백:', feedbackData.value);

        // UpdateFeedbackRequestDTO 형식에 맞춰 데이터 구성
        const updateDTO = {
          feedback_id: parseInt(feedbackData.value.feedback_id),
          evaluation_id: parseInt(currentEvaluationId.value),
          content: feedbackContent.value.trim()
        };

        console.log('수정 요청 데이터:', updateDTO);

        try {
          const response = await updateFeedback(updateDTO.feedback_id, updateDTO);
          console.log('수정 응답:', response);

          if (response.success) {
            alert('피드백이 성공적으로 수정되었습니다.');
            feedbackData.value = response.content;
            feedbackContent.value = '';
          }
        } catch (updateError) {
          console.error('수정 중 에러:', updateError);
          throw updateError;
        }
      } else {
        // 새 피드백 등록
        if (!currentEvaluationId.value) {
          throw new Error('evaluation_id가 존재하지 않습니다.');
        }

        const createDTO = {
          evaluation_id: parseInt(currentEvaluationId.value),
          content: feedbackContent.value.trim(),
        };

        console.log('등록 요청 데이터:', createDTO);

        const response = await createFeedback(createDTO);
        if (response.success) {
          alert('피드백이 성공적으로 등록되었습니다.');
          feedbackData.value = response.content;
          feedbackContent.value = '';
        }
      }

      // 피드백 데이터 새로고침
      const refreshedFeedback = await findFeedbacks(
        selectedEmployee.value,
        selectedYear.value,
        selectedHalf.value
      );
      feedbackData.value = refreshedFeedback.content;

    } catch (error) {
      console.error('피드백 처리 중 에러:', error);
      if (error.response) {
        console.error('서버 응답:', error.response);
        alert(error.response.data.error || '서버에서 오류가 발생했습니다.');
      } else if (error.request) {
        console.error('요청 객체:', error.request);
        alert('서버로부터 응답을 받지 못했습니다.');
      } else {
        console.error('에러 객체:', error);
        alert('요청 처리 중 오류가 발생했습니다.');
      }
    } finally {
      isLoading.value = false;
    }
  };
  </script>

<style scoped>
.h-8 {
  height: 5rem !important;
}

.h-12 {
  height: 12rem !important;
}

.pl-2 {
  padding-left: 2rem;
}

.mid {
  justify-content: center;
  align-items: center;
}

.input-wrapper {
  padding: 1rem;
}

.input-wrapper input {
  height: 100%;
  width: 100%;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.profile {
  padding: 1rem;
  gap: 3rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
  margin-bottom: 4rem;
}

.profile-img-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.emp-info {
  justify-content: center;
  gap: 1rem;
}

.emp-task {
  margin-bottom: 5rem;
}

.feedback-input {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  resize: none;
  font-size: 1.4rem;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.feedback-section {
  margin-left: 36rem;
  padding: 1rem 2rem;
}

.common-article {
  position: relative;
}

.year-half-section {
position: absolute;
top: 0;
right: 0;
margin-top: -1rem;
gap: 1rem;
}

.created-feedback {
  margin-top: 2rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.1);
  height: 15rem !important;
}

.feedback-content {
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  word-wrap: break-word;  /* 긴 단어가 넘어갈 때 줄바꿈 */
  word-break: break-word;  /* 긴 단어가 컨테이너를 넘지 않도록 강제로 줄바꿈 */
  overflow-wrap: break-word;  /* 텍스트가 컨테이너를 넘지 않도록 줄바꿈 */
  white-space: pre-wrap;  /* 줄바꿈을 유지하면서 긴 텍스트가 자동으로 넘어가도록 함 */
  max-height: 100%;  /* 최대 높이를 부모 요소에 맞춤 */
  overflow-y: auto;
  padding: 1.5rem;  /* 내부 여백 추가*/
}
.center-message {
  text-align: center;
  color: #888;
  font-size: 1.6rem;
}

.created-feedback {
  margin-top: 2rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.1);
  height: 15rem;
  display: flex;  /* Flexbox 사용 */
  flex-direction: column;
  justify-content: center;  /* 세로 가운데 정렬 */
  align-items: center;  /* 가로 가운데 정렬 */
}
</style>
