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