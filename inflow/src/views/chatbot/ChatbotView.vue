<template>
  <CommonNav :cur="1"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" h="calc(100vh - 10rem)">
    <SectionItem class="chatbot-section" :class="{ 'center-content': isInit }" h="100%" w="100%" fld="column">
      <p v-if="isInit" class="help-text">무엇을 도와드릴까요?</p>
      <UlItem v-if="!isInit" class="chat-list" w="80rem">
        <li
          v-for="(item, index) in chatList"
          :key="index"
          class="chat-item"
          :class="{'user-chat': item.type === 'user', 'bot-chat': item.type === 'bot'}"
        >
          <!-- 메시지에서 bold 처리 -->
          <span v-html="parseBoldText(item.message)"></span>
        </li>
      </UlItem>
      <div class="chat-container" :class="{ 'chat-bottom': !isInit }">
        <div class="chat-input-wrapper">
          <textarea
            class="chat-textarea"
            placeholder="메세지를 입력하세요."
            v-model="message"
            @input="adjustHeight"
            @keydown="handleKeydown"
            ref="textarea"
          ></textarea>
          <ArrowUpButton class="submit-btn" h="4rem" w="4rem" bgc="#003566" br="50%" @click="handleSubmit"></ArrowUpButton>
        </div>
      </div>
    </SectionItem>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import UlItem from '@/components/semantic/UlItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import ArrowUpButton from '@/components/buttons/ArrowUpButton.vue';
import { ref, onMounted, nextTick } from 'vue';
import { chatbotQuery } from '@/api/chatbot';

const eid = ref(null);
const sessionId = ref('');
const employeeName = ref('');
const message = ref(''); // textarea 내용
const textarea = ref(null); // textarea DOM 참조
const isInit = ref(true);

const chatList = ref([]);

const adjustHeight = () => {
  if (!textarea.value) return;

  const el = textarea.value; // 실제 DOM 요소 참조

  el.style.height = 'auto';

  const newHeight = el.scrollHeight;
  el.style.height = `${newHeight}px`;
};

const fetchAnswer = async (eid, sessionId, query) => {
  const formData = {
    query: query,
    employee_id: eid,
    session_id: sessionId,
  }

  try {
    const response = '우리 회사의 급여 계산 방식은 다음과 같은 주요 단계를 포함합니다:\n\n1. **무급 휴가 차감 계산**: 무급 휴가 사용에 따른 급여 차감액을 계산합니다. 공식은 다음과 같습니다:\n   - 차감액 = (월급 ÷ 실제 근무일수) x 무급 휴가 일수\n\n2. **세금 및 4대 보험 공제**: 소득세, 지방소득세 및 4대 보험료를 공제합니다.\n   - 소득세는 간이세액표를 기반으로 하며, 지방소득세는 소득세의 10%입니다.\n   - 4대 보험료는 다음과 같이 계산됩니다:\n     - 국민연금: 월급 x 4.5%\n     - 건강보험: 월급 x 3.545%\n     - 장기요양보험: 건강보험료 x 12.81%\n     - 고용보험: 월급 x 0.9%\n\n3. **최종 실수령액 산정**: 차감된 월급에서 모든 공제 금액을 반영하여 최종 지급될 금액을 계산합니다.\n   - 공식: 최종 실수령액 = 차감된 월급 - (소득세 + 지방소득세 + 4대 보험료)\n\n4. **초과근무 수당 계산**: 초과근무 시간에 대한 추가 지급 금액을 계산합니다.\n   - 공식: 초과근무 수당 = 통상 시급 x 1.5 x 초과근무 시간\n   - 통상 시급은 계약 월급 ÷ 209시간으로 계산됩니다.\n\n5. **퇴직금 계산**: 평균임금 또는 통상임금을 기준으로 퇴직금을 산출합니다.\n   - 평균임금 = (3개월 간의 총 급여) ÷ (3개월 간의 총 근무일수)\n\n이러한 방식으로 급여가 계산되며, 각 단계에서 필요한 공식과 예시가 제공됩니다.';

    chatList.value.push({
      type: 'bot',
      message: `${response}`,
    });

    // 응답 후 스크롤을 최하단으로 이동
    nextTick(() => {
      setTimeout(() => {
        scrollToBottom(); // 페이지 스크롤 최하단 이동
      }, 50); // 50ms 지연 후 스크롤 이동
    });
  } catch (error) {
    console.error(error);
  }
}

const generateSessionId = () => {
    const array = new Uint8Array(24); // 24바이트 랜덤값
    crypto.getRandomValues(array);  // 랜덤 값을 생성
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(''); // 16진수 문자열로 변환
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      // shift + enter일 경우 줄바꿈
      return;
    } else {
      // enter일 경우 submit
      event.preventDefault(); // 기본 enter 동작 방지 (줄바꿈 방지)
      handleSubmit(); // 메세지 제출
    }
  }
};

const handleSubmit = () => {
  if (!message.value) return;
  isInit.value = false;
  chatList.value.push({
    type: 'user',
    message: message.value,
  });
  fetchAnswer(eid.value, sessionId.value, message.value);
  message.value = '';
}

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth', // 부드럽게 스크롤
  });
};

// **로 감싸진 부분을 <strong> 태그로 변환하는 함수
const parseBoldText = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  // **...**을 <strong>...</strong>로 변환
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (!eid.value) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
  employeeName.value = localStorage.getItem('employeeName');
  sessionId.value = generateSessionId();
});
</script>

<style scoped>
.chatbot-section {
  align-items: center;
}

.center-content {
  justify-content: center;
  margin-top: -8rem;
}

.help-text {
  text-align: center;
  font-size: 3.2rem;
  font-weight: 500;
  margin-bottom: 4rem;
}

.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 70rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 4rem;
  z-index: 2;
}

.chat-list {
  gap: 2rem;
  padding: 0rem 1rem;
  padding-bottom: 20rem;
}

.chat-item {
  width: 38rem;
  min-height: 5rem;
  border-radius: 2.5rem;
  padding: 2rem;
  font-size: 1.4rem;
  font-weight: 500;
}

.bot-chat {
  align-self: flex-start;
  background-color: #f4f4f4;
}

.user-chat {
  align-self: flex-end;
  background-color: #d9ecfb;
}

.chat-item span {
  display: block;
  word-break: break-word; /* 긴 단어도 필요 시 줄바꿈 */
  overflow-wrap: break-word; /* 긴 단어도 줄바꿈 */
  white-space: pre-wrap;  /* 공백 및 줄바꿈 처리 */
}

.chat-bottom {
  position: fixed;
  width: 100rem;
  bottom: 0;
}

.chat-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 80rem;
  padding: 1rem;
  background-color: #f4f4f4;
  border: none;
  border-radius: 2.4rem;
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.1);
}

.chat-textarea {
  box-sizing: border-box;
  resize: none;
  padding: 1rem;
  font-size: 1.6rem;
  line-height: 2rem;
  max-height: 16rem; /* 최대 높이 */
}

.submit-btn {
  align-self: flex-end;
}
</style>
