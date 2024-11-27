import apiClient from '@/api/axios';

/**
 * 양식 다운로드 함수
 * @param {string} fileType - 다운로드할 양식의 타입
 * @returns {Promise<any>} - 다운로드된 양식 데이터
 */
export const getDoc = async (fileType) => {
  try {
    const response = await apiClient.get(`/forms/download?file_type=${fileType}`);
    return response.data.content;
  } catch (error) {
    console.error('양식 다운로드 에러:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 사원 정보 등록 함수
 * @param {object} data - 등록할 사원 정보 데이터
 * @param {string} name - 등록할 이름을 포함한 URL 경로
 * @returns {Promise<any>} - 등록 결과
 */
export const saveData = async (data, name) => {
  try {
    let response;
    if (name !== null) {
      response = await apiClient.post(`/employees/${name}`, data);
    } else {
      response = await apiClient.post(`/employees`, data);
    }
    return response.data.content;
  } catch (error) {
    console.error('사원 정보 등록 에러:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 유효성 검사 데이터 조회 함수
 * @returns {Promise<any>} - 유효성 검사 데이터
 */
export const getValidData = async () => {
  try {
    const response = await apiClient.get(`/validations/`);
    return response.data.content;
  } catch (error) {
    console.error('유효성 검사 데이터 조회 에러:', error.response?.data || error.message);
    throw error;
  }
};
