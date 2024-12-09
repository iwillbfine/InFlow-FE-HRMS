<template>
  <CommonNav :cur="2"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" h="calc(100vh - 10rem)">
    <SectionItem
      class="chatbot-section"
      :class="{ 'center-content': isInit }"
      h="100%"
      w="100%"
      fld="column"
    >
      <p v-if="isInit" class="help-text">무엇을 도와드릴까요?</p>
      <UlItem v-if="!isInit" class="chat-list" w="80rem">
        <li
          v-for="(item, index) in chatList"
          :key="index"
          class="chat-item"
          :class="{
            'user-chat': item.type === 'user',
            'bot-chat': item.type === 'bot',
          }"
        >
          <FlexItem
            v-if="item.type === 'bot'"
            class="item-header"
            fld="row"
            w="100%"
            bgc="transparent"
            c="#888"
            fs="2rem"
          >
            <RobotIcon></RobotIcon>
            <CheckButton
              v-if="isCopied"
              h="2rem"
              w="2rem"
              bgc="transparent"
              c="#888"
              fs="2rem"
            ></CheckButton>
            <CopyButton
              v-else
              h="2rem"
              w="2rem"
              bgc="transparent"
              c="#888"
              fs="2rem"
              @click="handleCopy(item.message)"
            ></CopyButton>
          </FlexItem>
          <span v-html="parseMarkdown(item.message)"></span>
          <!-- 키워드에 따른 라우팅 버튼 -->
          <div v-if="item.type === 'bot' && keywordLabel" class="keyword-navigation">
            <button
              @click="navigateToKeyword"
              class="keyword-button"
            >
              {{ keywordLabel }}
            </button>
          </div>
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
          <ArrowUpButton
            class="submit-btn"
            h="4rem"
            w="4rem"
            bgc="#003566"
            br="50%"
            @click="handleSubmit"
          ></ArrowUpButton>
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
import CopyButton from '@/components/buttons/CopyButton.vue';
import CheckButton from '@/components/buttons/CheckButton.vue';
import RobotIcon from '@/components/icons/RobotIcon.vue';
import { ref, onMounted, nextTick, computed  } from 'vue';

import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

import { chatbotQuery, getChatbotSessions, getSessionHistory } from '@/api/chatbot'; // 추가된 import

import { useRouter } from 'vue-router';

const router = useRouter();

const eid = ref(null);
const sessionId = ref('');
const employeeName = ref('');
const message = ref(''); // textarea 내용
const textarea = ref(null); // textarea DOM 참조
const isInit = ref(true);
const isCopied = ref(false);

const chatList = ref([]);

const selectedKeyword =ref([]);

const fetchAnswer = async (eid, sessionId, query) => {
  const formData = {
    query: query,
    employee_id: eid,
    session_id: sessionId,
  };

  try {
    const response = await chatbotQuery(formData);

    console.log('챗봇 응답:', response);

    if (response && response.content) {
      // 응답 메시지 추가
      chatList.value.push({
        type: 'bot',
        message: response.content.answer,
      });

      // 선택된 키워드가 있다면 로그 출력 (추가 활용 가능)
      if (response.content.selected_keyword) {
        selectedKeyword.value = response.content.selected_keyword;
        console.log('선택된 키워드:',  selectedKeyword.value);
      }
    } else {
      // 응답 데이터가 비어있을 경우 기본 메시지 추가
      chatList.value.push({
        type: 'bot',
        message: '챗봇에서 유효한 응답을 받지 못했습니다. 다시 시도해주세요.',
      });
    }

    // 응답 후 스크롤을 최하단으로 이동
    nextTick(() => {
      setTimeout(() => {
        scrollToBottom(); // 페이지 스크롤 최하단 이동
      }, 50); // 50ms 지연 후 스크롤 이동
    });
  } catch (error) {
    console.error('챗봇 응답 처리 중 오류:', error);

    // 에러 메시지 추가
    chatList.value.push({
      type: 'bot',
      message: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
};


// 챗봇 세션 목록 가져오기
const fetchChatbotSessions = async () => {
  try {
    const sessions = await getChatbotSessions(eid.value);
    console.log('챗봇 세션 목록:', sessions);
    // 세션 데이터를 활용한 추가 로직 작성
  } catch (error) {
    console.error('챗봇 세션 목록 조회 실패:', error);
  }
};

// 특정 세션의 대화 이력 가져오기
const fetchSessionHistory = async (sessionId) => {
  try {
    const history = await getSessionHistory(sessionId);
    console.log('대화 이력:', history);
    // 대화 이력을 활용한 추가 로직 작성
  } catch (error) {
    console.error('대화 이력 조회 실패:', error);
  }
};

// 키워드와 경로 매핑
const keywordRoutes = {
  commute: '/hr-basic/attendance/commute',
  remote: '/hr-basic/attendance/remote',
  overtime: '/hr-basic/attendance/overtime',
  vacation: '/hr-basic/attendance/vacation',
  leave: '/hr-basic/attendance/leave',
  return: '/hr-basic/attendance/return',
  business: '/hr-basic/attendance/business-trip',
  dispatch: '/hr-basic/attendance/dispatch',
  salary: '/hr-basic/salary',
  contract: '/hr-basic/document/contract',
  certificate: '/hr-basic/document/certificate',
  department: '/hr-basic/my-department/info/careers',
  evaluation: '/evaluation/leader',
};

// 영어 키워드 매핑 (반대로 변경)
const keywordDict = {
  commute: '근퇴',
  remote: '재택',
  overtime: '초과근무',
  vacation: '휴가',
  leave: '휴직',
  return: '복직',
  business: '출장',
  dispatch: '파견',
  salary: '급여',
  contract: '계약',
  certificate: '증명',
  department: '부서',
  evaluation: '평가',
};


// 버튼 라벨
const keywordLabel = computed(() => {
  const matchedKeyword = keywordDict[selectedKeyword.value];
  return matchedKeyword
    ? `${matchedKeyword}로 이동하기`
    : '알 수 없는 키워드';
});

// 라우팅 함수
const navigateToKeyword = () => {

  if (selectedKeyword.value) {
    const route = keywordRoutes[selectedKeyword.value];
    if (route) {
      router.push(route);
    } else {
      console.error('적절한 경로가 없습니다.');
    }
  } else {
    console.error('선택된 키워드가 매핑되지 않았습니다.');
  }
};

const adjustHeight = () => {
  if (!textarea.value) return;

  const el = textarea.value;

  el.style.height = 'auto';

  const newHeight = el.scrollHeight;
  el.style.height = `${newHeight}px`;
};



const generateSessionId = () => {
  const array = new Uint8Array(24); // 24바이트 랜덤값
  crypto.getRandomValues(array); // 랜덤 값을 생성
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  ); // 16진수 문자열로 변환
};

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

const handleCopy = (message) => {
  navigator.clipboard
    .writeText(message)
    .then(() => {
      isCopied.value = true;
      setTimeout(() => {
        handleReturn(); // 500ms 후 다시 초기 상태로
      }, 3000);
    })
    .catch((error) => {
      console.error('클립보드 복사 실패:', error);
    });
};

const handleReturn = () => {
  isCopied.value = false;
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

  nextTick(() => {
    adjustHeight(); // 메시지 제출 후 textarea 크기 조정
    setTimeout(() => {
      scrollToBottom(); // 페이지 스크롤 최하단 이동
    }, 50); // 50ms 지연 후 스크롤 이동
  });
};

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth', // 부드럽게 스크롤
  });
};

const decodeHtmlEntities = (text) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// 마크다운 파싱 함수
const parseMarkdown = (text) => {
  const html = marked(text); // 마크다운을 HTML로 변환

  // 하이라이팅 처리
  const highlightedHtml = html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, language, code) => {
      // HTML 엔티티를 디코딩
      const decodedCode = decodeHtmlEntities(code);

      // 디코딩된 코드에 하이라이팅 적용
      const highlightedCode = Prism.highlight(
        decodedCode,
        Prism.languages[language],
        language
      );
      return `<pre><code class="language-${language}">${highlightedCode}</code></pre>`;
    }
  );

  // 렌더링된 HTML을 삽입 후 하이라이팅
  nextTick(() => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      Prism.highlightElement(block); // 각 코드 블록에 하이라이팅 적용
    });
  });

  return highlightedHtml;
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }
  employeeName.value = localStorage.getItem('employeeName');
  sessionId.value = generateSessionId();

  // 챗봇 세션 목록 가져오기
  fetchChatbotSessions();

  // 특정 세션의 대화 이력 가져오기 (예: 초기 로딩 시 특정 세션 ID로 가져오기)
  fetchSessionHistory(sessionId.value);

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
  width: 100%;
  padding-bottom: 4rem;
  z-index: 2;
}

.chat-list {
  gap: 4rem;
  padding: 0rem 1rem;
  padding-bottom: 20rem;
}

.chat-item {
  display: flex;
  flex-direction: column;
  min-height: 5rem;
  border-radius: 2.5rem;
  padding: 2rem;
  font-size: 1.6rem;
  font-weight: 500;
}

.bot-chat {
  align-self: flex-start;
  width: 100%;
  background-color: #fff;
}

.user-chat {
  align-self: flex-end;
  width: 70%;
  background-color: #d9ecfb;
}

.chat-item span {
  display: block;
  word-wrap: break-word; /* 구버전 호환 */
  overflow-wrap: break-word; /* 긴 단어도 줄바꿈 */
  white-space: pre-wrap; /* 공백 및 줄바꿈 처리 */
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


/* 키워드 네비게이션 버튼 */
.keyword-navigation {
  margin-top: 1rem;
  text-align: center;
}

.keyword-button {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 1.2rem;
  background-color: #007bff;
  color: #fff;
  font-size: 1.6rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.keyword-button:hover {
  background-color: #0056b3;
}

.keyword-button:active {
  background-color: #003d80;
}
/* 키워드 네비게이션 버튼 끝 */

.submit-btn {
  align-self: flex-end;
}

.item-header {
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
}





</style>
