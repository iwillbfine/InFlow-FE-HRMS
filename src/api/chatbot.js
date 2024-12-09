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
