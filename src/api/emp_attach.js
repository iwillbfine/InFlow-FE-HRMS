import apiClient from '@/api/axios';

export const getDoc = async (fileType) => {
  try {
    const response = await apiClient.get(
      `/forms/download?file_type=${fileType}`
    );
    return response.data;
  } catch (error) {
    console.error('양식 다운로드 에러:', error.response?.data || error.message);
    throw error;
  }
};

export const saveData = async (data, name) => {
  try {
    let response;
    if (name !== null) {
      if (name === 'appointments')
        response = await apiClient.post(`/appointments`, data);
      else response = await apiClient.post(`/employees/${name}`, data);
    } else {
      response = await apiClient.post(`/employees`, data);
    }
    return response.data.content;
  } catch (error) {
    console.error(
      '사원 정보 등록 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateData = async (list, data, name) => {
  try {
    let response;
    await apiClient.delete(`/employees/${name}`, {
      data: list,
    });
    response = await apiClient.post(`/employees/${name}`, data);
    return response.data.content;
  } catch (error) {
    console.error('수정 요청 에러:', error.response?.data || error.message);
    throw error;
  }
};

export const getValidData = async () => {
  try {
    const response = await apiClient.get(`/validations/`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllEmpId = async () => {
  try {
    const response = await apiClient.get(`/employees/`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEmpByNum = async (empNum) => {
  try {
    const response = await apiClient.get(`/employees/number/${empNum}`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEmpId = async (empCodes) => {
  try {
    const response = await apiClient.post(`/employees/numbers`, empCodes);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEducationsById = async (empId) => {
  try {
    const response = await apiClient.get(`/employees/educations/${empId}`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getQualifications = async () => {
  try {
    const response = await apiClient.get(`/employees/qualifications`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getQualificationsById = async (empId) => {
  try {
    const response = await apiClient.get(`/employees/qualifications/${empId}`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getLanguageTests = async () => {
  try {
    const response = await apiClient.get(`/employees/language-tests`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getLanguageTestsById = async (empId) => {
  try {
    const response = await apiClient.get(`/employees/language-tests/${empId}`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getLangCode = async () => {
  try {
    const response = await apiClient.get(`/employees/language-tests/languages`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getRelationships = async () => {
  try {
    const response = await apiClient.get(
      `/employees/family-members/relationships`
    );
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFamilyById = async (empId) => {
  try {
    const response = await apiClient.get(`/employees/family-members/${empId}`);
    return response.data;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAppHistoryByMonth = async (year, month) => {
  try {
    const response = await apiClient.get(
      `/appointments/history?year=${year}&month=${month}&appointment_item_code=all`
    );
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAppHistoryByPeriod = async (year, month, type) => {
  try {
    const response = await apiClient.get(
      `/appointments/history?year=${year}&month=${month}&appointment_item_code=${type}`
    );
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCareersById = async (empId) => {
  try {
    const response = await apiClient.get(`/employees/careers/${empId}`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDisciplineReward = async (empId) => {
  try {
    const response = await apiClient.get(`/employees/attached/${empId}`);
    return response.data.content;
  } catch (error) {
    console.error(
      '유효성 검사 데이터 조회 에러:',
      error.response?.data || error.message
    );
    throw error;
  }
};
