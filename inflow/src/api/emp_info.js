// 사원 기본 관련 api 모음

import apiClient from '@/api/axios'; // Axios 설정이 적용된 apiClient 사용

// 설명. 홈 화면 일정 조회
export const getHomeInfo = async (employeeId, month) => {
  try {
    const response = await apiClient.get(
      `/home?employeeId=${employeeId}&month=${month}`
    );
    return response.data;
  } catch (error) {
    console.error('getHomeInfo 에러:', error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 설명. 1. 사원 ID로 사원 정보 조회하기
export const getEmployeeById = async (employeeId, token) => {
  try {
    const response = await apiClient.get(`/employees/id/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
      },
    });
    return response.data.content; // 사원 정보를 반환
  } catch (error) {
    console.error('getEmployeeById 에러:', error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 설명. 1.1. 사원 ID로 사원 정보 조인해서 상세 조회하기
export const getEmployeeDetailById = async (employeeId, token) => {
  try {
    const response = await apiClient.get(`/employees/detail/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
      },
    });
    return response.data.content; // 상세 사원 정보 반환
  } catch (error) {
    console.error('getEmployeeDetailById 에러:', error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 설명. 2. 비밀번호 재설정하기
export const resetEmployeePassword = async (employeeId, newPassword, token) => {
  try {
    const response = await apiClient.patch(
      '/employees/re-password',
      {
        employee_id: employeeId, // 사원 ID
        new_password: newPassword, // 새 비밀번호
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
        },
      }
    );

    return response.data; // API 응답 데이터를 반환
  } catch (error) {
    console.error('resetEmployeePassword 에러:', error.response || error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 설명. 3. 사원 리스트 전체 조회하기
export const getAllEmployees = async (token) => {
  try {
    const response = await apiClient.get('/employees/', {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
      },
    });
    return response.data.content; // 사원 리스트 반환
  } catch (error) {
    console.error('getAllEmployees 에러:', error);
    throw error;
  }
};

// 설명. 4. 이름으로 사원 리스트 조회하기
export const getEmployeesByName = async (name, token) => {
  try {
    const response = await apiClient.get(`/employees/name`, {
      params: { name }, // 이름을 파라미터로 추가
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.content; // 사원 리스트 반환
  } catch (error) {
    console.error('getEmployeesByName 에러:', error);
    throw error;
  }
};

// 설명. 5. 사번으로 사원 정보 조회하기
export const getEmployeeByNumber = async (employeeNumber, token) => {
  try {
    const response = await apiClient.get(
      `/employees/number/${employeeNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.content; // 사원 정보 반환
  } catch (error) {
    console.error('getEmployeeByNumber 에러:', error);
    throw error;
  }
};

// 설명. 6. 재직증명서 정보 조회하기
export const getEmploymentCertificate = async (employeeId, purpose, token) => {
  try {
    const response = await apiClient.post(
      '/employees/employment-certificate',
      {
        employee_id: employeeId, // 사원 id
        purpose: purpose, // 증명서 용도
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.content; // 재직증명서 정보 반환
  } catch (error) {
    console.error('getEmploymentCertificate 에러:', error);
    throw error;
  }
};

// 설명. 7. 근로 계약서 정보 조회하기
export const getEmploymentContract = async (employeeId, token) => {
  try {
    const response = await apiClient.get(
      `/employees/${employeeId}/employment-contract`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.content; // 근로 계약서 정보 반환
  } catch (error) {
    console.error('getEmploymentContract 에러:', error);
    throw error;
  }
};

// 설명. 8. 비밀 유지 서약서 정보 조회하기
export const getSecurityAgreement = async (employeeId, token) => {
  try {
    const response = await apiClient.get(
      `/employees/${employeeId}/security-agreement`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.content; // 비밀 유지 서약서 정보 반환
  } catch (error) {
    console.error('getSecurityAgreement 에러:', error);
    throw error;
  }
};

// 설명. 9. 서명된 계약서 리스트 조회하기
export const getContractList = async (employeeId, token) => {
  try {
    const response = await apiClient.get(`/employees/${employeeId}/contracts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.content; // 계약서 리스트 반환
  } catch (error) {
    console.error('getContractList 에러:', error);
    throw error;
  }
};

// 설명. 10. 특정 계약서 정보 조회하기
export const getContract = async (contractId, token) => {
  try {
    const response = await apiClient.get(`/employees/contracts/${contractId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.content; // 계약서 정보 반환
  } catch (error) {
    console.error('getContract 에러:', error);
    throw error;
  }
};

// 설명. 11. 사원 정보 수정하기
export const updateEmployeeInfo = async (employeeId, formData, token) => {
  try {
    const response = await apiClient.patch(
      `/employees/employee-id/${employeeId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
          'Content-Type': 'multipart/form-data', // form-data 처리
        },
      }
    );
    return response.data.content; // 수정된 사원 정보 반환
  } catch (error) {
    console.error('updateEmployeeInfo 에러:', error.response || error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// 설명. 12. 사원별 계약서 등록
export const registerEmployeeContract = async (contractId, file, token) => {
  try {
    const formData = new FormData();
    formData.append('contract_id', contractId); // 계약서 ID
    formData.append('contract_file', file); // 파일

    const response = await apiClient.post('/employees/contracts', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // form-data 처리
      },
    });

    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error('registerEmployeeContract 에러:', error.response || error);
    throw error; // 에러 전달
  }
};
