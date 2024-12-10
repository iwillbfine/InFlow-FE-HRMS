import apiClient from '@/api/axios';

// 챗봇 질문
export const chatbotQuery = async (formData) => {
  try {
    const response = await apiClient.post(`/chatbot/query`, formData);
    return response.data;
  } catch (error) {
    console.error('chatbotQuery 에러:', error);
    throw error;
  }
};

// 사원별 챗봇 세션 목록 조회
export const getChatbotSessions = async (employeeId) => {
  try {
    const response = await apiClient.get(`/chatbot/sessions/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('getChatbotSessions 에러:', error);
    throw error;
  }
};

// 특정 세션의 대화 이력 조회
export const getSessionHistory = async (sessionId) => {
  try {
    const response = await apiClient.get(`/chatbot/session/${sessionId}/history`);
    return response.data;
  } catch (error) {
    console.error('getSessionHistory 에러:', error);
    throw error;
  }
};
