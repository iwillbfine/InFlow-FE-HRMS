import apiClient from '@/api/axios';

apiClient.defaults.headers.common['Authorization'] =
  `Bearer ${localStorage.getItem('accessToken')}`;

/* 1. 사원별 연월별 급여 명세서 조회 */
export const getPaymentByEmployeeIdAndYearAndMonth = async (
  eid,
  year,
  month
) => {
  if (!eid || !year || !month) {
    throw new Error(
      `유효하지 않은 파라미터: eid=${eid}, year=${year}, month=${month}`
    );
  }
  try {
    const response = await apiClient.get(`/payrolls/details/${eid}`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error('getPaymentByEmployeeIdAndYearAndMonth 에러: ', error);
    throw error;
  }
};

export const getPeriodicPayments = async (employeeId, startDate, endDate) => {
  if (!employeeId || !startDate || !endDate) {
    throw new Error(
      `유효하지 않은 파라미터: employeeId=${employeeId}, startMonth=${startDate}, endMonth=${endDate}`
    );
  }
  try {
    const response = await apiClient.get('/payrolls/period', {
      params: { employeeId, startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('getPeriodicPayments 오류: ', error);
    throw error;
  }
};

export const getPaymentsByYear = async (employeeId, year) => {
  if (!employeeId || !year) {
    throw new Error(
      `유효하지 않은 파라미터: employeeId=${employeeId}, year=${year}`
    );
  }
  try {
    const response = await apiClient.get('/payrolls/list', {
      params: { employeeId, year },
    });
    return response.data;
  } catch (error) {
    console.error('getPaymentsByYear 오류: ', error);
    throw error;
  }
};

export const getAllPayments = async (employeeId, page) => {
  if (!employeeId || !page) {
    throw new Error(
      `유효하지 않은 파라미터: employeeId=${employeeId}, page=${page}`
    );
  }
  try {
    const response = await apiClient.get(`/payrolls/all/${employeeId}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('getAllPayments 에러: ', error);
    throw error;
  }
};

export const getEstimateWorkingDays = async (employeeId) => {
  if (!employeeId) {
    throw new Error(`유효하지 않은 파라미터: employeeId=${employeeId}`);
  }
  try {
    const response = await apiClient.get(
      `/severance-pay/estimate/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error('getEstimateWorkingDays 에러: ', error);
    throw error;
  }
};

export const calculateSeverancePay = async (employeeId) => {
  if (!employeeId) {
    throw new Error(`유효하지 않은 파라미터: employeeId=${employeeId}`);
  }
  try {
    const response = await apiClient.get(
      `/severance-pay/calculate/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error('calculateSeverancePay 에러: ', error);
    throw error;
  }
};

export const createIrregularAllowance = async (formData) => {
  try {
    const response = await apiClient.post('irregular-allowances', formData);
    return response.data;
  } catch (error) {
    console.error('createIrregularAllowance 오류: ', error);
  }
};

export const getIrregularAllowance = async (page) => {
  try {
    const response = await apiClient.get(`/irregular-allowances`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('getIrregularAllowance 오류: ', error);
  }
};

export const getNonTaxablePayrolls = async (page) => {
  try {
    const response = await apiClient.get('/non-taxable-payrolls', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('getNonTaxablePayrolls 오류: ', error);
  }
};

export const createNonTaxable = async (formData) => {
  try {
    const response = await apiClient.post('/non-taxable-payrolls', formData);
    return response.data;
  } catch (error) {
    console.error('createNonTaxable 오류: ', error);
  }
};
