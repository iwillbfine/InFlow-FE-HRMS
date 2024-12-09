// evaluation.js
import apiClient from '@/api/axios';

// 과제별 평가 조회 - ( 자기평가&리더평가에 해당하는 과제별 평가 리스트 모두 조회 )
export const getTaskEvaluation = async (empId, year, half) => {
  try {
    const response = await apiClient.get(`/evaluations/taskEval/find`, {
      params: {
        empId,
        year,
        half,
      },
    });
    return response.data;
  } catch (error) {
    console.error('getTaskEvaluation 에러:', error);
    throw error;
  }
};

// 평가ID로 과제별 평가 List 조회 ( 개인평가 조회에 사용 )
export const findIndividualTaskListByEvaluationId = async (
  empId,
  year,
  half
) => {
  try {
    const response = await apiClient.get(
      '/evaluations/taskEval/individualTaskList',
      {
        params: {
          year: year,
          half: half,
          empId: empId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('자기평가 과제 리스트 조회 중 에러 발생:', error);
    throw error;
  }
};

// 평가ID로 과제별 평가 List 조회 ( 리더평가 조회에 사용 )
export const findTaskEvalByEvaluationId = async (evaluationId) => {
  try {
    const response = await apiClient.get(
      `/evaluations/taskEval/byEvaluationId/${evaluationId}`
    );
    return response.data;
  } catch (error) {
    console.error('평가ID로 과제별 평가 리스트 조회 중 에러 발생:', error);
    throw error;
  }
};

// 과제별 평가 수정
export const updateTaskEval = async (taskEvalId, updateTaskEvalRequestDTO) => {
  try {
    const response = await apiClient.patch(
      `/evaluations/taskEval/${taskEvalId}`,
      updateTaskEvalRequestDTO
    );
    return response.data;
  } catch (error) {
    console.error('과제별 평가 수정 중 에러 발생:', error);
    throw error;
  }
};

// 모든 과제 유형 조회
export const getAllTaskTypes = async () => {
  try {
    const response = await apiClient.get(`/evaluations/taskType/allTaskType`);
    return response.data;
  } catch (error) {
    console.error('getAllTaskTypes 에러:', error);
    throw error;
  }
};

// 과제 유형 삭제 함수
export const deleteTaskTypeById = async (taskTypeId) => {
  try {
    const response = await apiClient.delete(
      `/evaluations/taskType/${taskTypeId}`
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('deleteTaskTypeById 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 개인 과제 항목 리스트 조회
export const getIndividualTaskItems = async (empId, year, half) => {
  try {
    const response = await apiClient.get(
      `/evaluations/taskItem/individualTasks`,
      {
        params: {
          empId,
          year,
          half,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('getIndividualTaskItems 에러:', error);
    throw error;
  }
};

// 부서 과제 항목 리스트 조회
export const findDepartmentTaskItems = async (year, half, empId) => {
  try {
    const response = await apiClient.get(
      '/evaluations/taskItem/departmentTasks',
      {
        params: {
          year,
          half,
          empId,
        },
      }
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findDepartmentTaskItems 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 과제 생성
export const createTaskItem = async (
  year,
  half,
  taskTypeId,
  createTaskItemRequestDTO
) => {
  try {
    const response = await apiClient.post(
      `/evaluations/taskItem/taskItemCreation`,
      createTaskItemRequestDTO,
      {
        params: {
          year,
          half,
          taskTypeId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('createTaskItem 에러:', error);
    throw error;
  }
};

// 모든 과제 유형에 대한 과제 리스트 조회
export const findAllTaskItemsByEmpId = async (empId, year, half) => {
  try {
    const response = await apiClient.get(`/evaluations/taskItem/AllTaskItems`, {
      params: {
        empId,
        year,
        half,
      },
    });
    return response.data;
  } catch (error) {
    console.error('findAllTaskItemsByEmpId 에러:', error);
    throw error;
  }
};

// 과제 항목별 평가 생성
export const createTaskEval = async (
  createTaskEvalRequestDTO,
  year,
  half,
  employeeId
) => {
  try {
    const response = await apiClient.post(
      '/evaluations/taskEval/taskEvalCreation',
      createTaskEvalRequestDTO,
      {
        params: {
          year,
          half,
          employeeId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('createTaskEval 에러:', error);
    throw error;
  }
};

// 최종 평가 조회
export const findFinalGrade = async (empId, year, half) => {
  try {
    const response = await apiClient.get('/evaluations/evaluation/leader', {
      params: {
        empId,
        year,
        half,
      },
    });
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findFinalGrade 에러:', error);
    throw error;
  }
};

// 자기 평가 조회
export const findEvaluationByEmpIdAndYearAndHalf = async (
  year,
  half,
  empId
) => {
  try {
    const response = await apiClient.get('/evaluations/evaluation/mine', {
      params: {
        year: year,
        half: half,
        empId: empId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('자기 평가 조회 중 에러 발생:', error);
    throw error;
  }
};

// 피드백 생성
export const createFeedback = async (createFeedbackRequestDTO) => {
  try {
    const response = await apiClient.post(
      '/evaluations/feedback/feedbackCreation',
      createFeedbackRequestDTO
    );
    return response.data;
  } catch (error) {
    console.error('피드백 생성 중 에러 발생:', error);
    throw error;
  }
};

// 피드백 조회
export const findFeedbacks = async (empId, year, half) => {
  try {
    const response = await apiClient.get('/evaluations/feedback/find', {
      params: {
        empId,
        year,
        half,
      },
    });
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findFeedbacks 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 피드백 수정
export const updateFeedback = async (feedbackId, updateFeedbackRequestDTO) => {
  try {
    const response = await apiClient.patch(
      `/evaluations/feedback/${feedbackId}`,
      updateFeedbackRequestDTO
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('updateFeedback 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 과제 유형 등록
export const createTaskType = async (createTaskTypeRequestDTO) => {
  try {
    const response = await apiClient.post(
      `/evaluations/taskType/create`,
      createTaskTypeRequestDTO
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('createTaskType 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 모든 과제 유형 조회
export const findAllTaskTypes = async () => {
  try {
    const response = await apiClient.get(`/evaluations/taskType/allTaskType`);
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findAllTaskTypes 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 년도 및 반기별 평가 등급 리스트 조회
export const findGradeByYearAndHalf = async (year, half) => {
  try {
    const response = await apiClient.get(`/evaluations/grade/find`, {
      params: {
        year,
        half,
      },
    });
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findGradeByYearAndHalf 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 등급 생성 함수
export const createGrade = async (createGradeRequestDTO, year, half) => {
  try {
    const response = await apiClient.post(
      `/evaluations/grade/gradeCreation`,
      createGradeRequestDTO,
      {
        params: {
          year,
          half,
        },
      }
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('createGrade 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 등급 수정 함수
export const updateGrade = async (gradeId, updateGradeRequestDTO) => {
  try {
    const response = await apiClient.patch(
      `/evaluations/grade/${gradeId}`,
      updateGradeRequestDTO
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('updateGrade 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 평가 정책 생성 함수
export const createEvaluationPolicy = async (
  createEvaluationPolicyRequestDTO
) => {
  try {
    const response = await apiClient.post(
      '/evaluations/evaluationPolicy/policyCreation',
      createEvaluationPolicyRequestDTO
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('createEvaluationPolicy 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 평가 정책 리스트 조회
export const findEvaluationPolicyByYearAndHalf = async (year, half) => {
  try {
    const response = await apiClient.get('/evaluations/evaluationPolicy/find', {
      params: {
        year,
        half,
      },
    });
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findEvaluationPolicyByYearAndHalf 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 평가 정책 단건 조회 함수
export const findEvaluationPolicyById = async (evaluationPolicyId) => {
  try {
    const response = await apiClient.get(
      `/evaluations/evaluationPolicy/${evaluationPolicyId}`
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findEvaluationPolicyById 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 평가 정책 수정 함수
export const updateEvaluationPolicy = async (
  evaluationPolicyId,
  updateEvaluationPolicyRequestDTO
) => {
  try {
    const response = await apiClient.patch(
      `/evaluations/evaluationPolicy/${evaluationPolicyId}`,
      updateEvaluationPolicyRequestDTO
    );
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('updateEvaluationPolicy 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 평가등급 단건 조회 함수
export const findGradeByGradeId = async (gradeId) => {
  try {
    const response = await apiClient.get(`/evaluations/grade/${gradeId}`);
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('findGradeByGradeId 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};
