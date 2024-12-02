// evaluation.js
import apiClient from '@/api/axios';

// 과제별 평가 조회 - ( 개인평가 내역 조회에 사용 )
export const getTaskEvaluation = async (empId, year, half) => {
  try {
    const response = await apiClient.get(`/evaluations/taskEval/find`, {
      params: {
        empId,
        year,
        half
      }
    });
    return response.data;
  } catch (error) {
    console.error('getTaskEvaluation 에러:', error);
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

// 개인 과제 항목 리스트 조회
export const getIndividualTaskItems = async (empId, year, half) => {
  try {
    const response = await apiClient.get(`/evaluations/taskItem/individualTasks`, {
      params: {
        empId,
        year,
        half,
      },
    });
    return response.data;
  } catch (error) {
    console.error('getIndividualTaskItems 에러:', error);
    throw error;
  }
};

// 과제 생성
export const createTaskItem = async (year, half, taskTypeId, createTaskItemRequestDTO) => {
  try {
    const response = await apiClient.post(`/evaluations/taskItem/taskItemCreation`, createTaskItemRequestDTO, {
      params: {
        year,
        half,
        taskTypeId,
      },
    });
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
        half
      }
    });
    return response.data;
  } catch (error) {
    console.error('findAllTaskItemsByEmpId 에러:', error);
    throw error;
  }
};

// 평가 항목별 평가 생성

export const createTaskEval = async (createTaskEvalRequestDTO, year, half, employeeId) => {
  try {
    const response = await apiClient.post('/evaluations/taskEval/taskEvalCreation', createTaskEvalRequestDTO, {
      params: {
        year,
        half,
        employeeId,
      },
    });
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

// 피드백 생성
export const createFeedback = async (createFeedbackRequestDTO) => {
  try {
    const response = await apiClient.post('/evaluations/feedback/feedbackCreation', createFeedbackRequestDTO);
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
    const response = await apiClient.patch(`/evaluations/feedback/${feedbackId}`, updateFeedbackRequestDTO);
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('updateFeedback 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 과제 유형 등록
export const createTaskType = async (createTaskTypeRequestDTO) => {
  try {
    const response = await apiClient.post(`/evaluations/taskType/create`, createTaskTypeRequestDTO);
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
    const response = await apiClient.post(`/evaluations/grade/gradeCreation`, createGradeRequestDTO, {
      params: {
        year,
        half,
      },
    });
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('createGrade 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};

// 등급 수정 함수
export const updateGrade = async (gradeId, updateGradeRequestDTO) => {
  try {
    const response = await apiClient.patch(`/evaluations/grade/${gradeId}`, updateGradeRequestDTO);
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error('updateGrade 에러:', error);
    throw error; // 에러를 다시 throw해서 호출한 쪽에서 처리할 수 있도록 함
  }
};