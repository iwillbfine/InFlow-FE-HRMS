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