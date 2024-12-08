<template>
  <div v-if="contractData" class="modal-overlay">
    <div class="modal-content">
      <!-- 로딩 오버레이 -->
      <LoadingOverlay
        :isVisible="isSubmitting"
        message="계약서를 등록 중입니다. 잠시만 기다려 주세요..."
      />

      <!-- 상단 버튼 컨트롤 -->
      <div class="viewer-controls">
        <div class="left-controls">
          <button
            class="btn save-btn"
            @click="saveContract"
            :disabled="isSubmitting"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            계약서 등록
          </button>
        </div>
        <div class="center-controls">
          <button @click="zoomIn" class="btn">
            <i class="fas fa-search-plus"></i> 확대
          </button>
          <button @click="zoomOut" class="btn">
            <i class="fas fa-search-minus"></i> 축소
          </button>
          <button @click="resetZoom" class="btn">
            <i class="fas fa-redo-alt"></i> 초기화
          </button>
        </div>
        <div class="right-controls">
          <button class="btn add-signature-btn" @click="openSignaturePad">
            <i class="fas fa-signature"></i> 서명 넣기
          </button>
          <button class="btn close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i> 닫기
          </button>
        </div>
      </div>

      <!-- 서약서 내용 -->
      <div class="contract-container" ref="contractViewer">
        <h2 class="contract-title">비밀유지서약서(입사자)</h2>
        <div class="contract">
          <p>
            <strong>소 속:</strong>
            <span class="highlight">{{ contractData.department_name }}</span>
          </p>
          <p>
            <strong>성 명:</strong>
            <span class="highlight">{{ contractData.employee_name }}</span>
          </p>
          <p>
            <strong>생년월일:</strong>
            <span class="highlight">{{ contractData.birth_date }}</span>
          </p>
          <br />
          <p class="intro">
            위 본인은
            <span class="highlight">{{ contractData.start_date }}</span
            >자로 <span class="highlight">{{ contractData.company_name }}</span
            >(이하 "회사")에 입사하여 회사의 영업비밀 및 영업자산의 중요성과
            관련한 규정을 충분히 이해하였기에, 다음 사항을 준수할 것을
            서약합니다.
          </p>
          <br />
          <ol>
            <li>
              1. 본인은, 아래와 같은 정보가 회사의 영업비밀에 해당함을 확인하며,
              회사의 관련 규정을 준수할 것을 서약합니다.
              <ul>
                <li>
                  ① 영업비밀 관리규정 기타 회사의 내부 규정에 기재된 영업비밀
                  보호대상
                </li>
                <li>
                  ② 영업비밀임이 표시된 기술자료, 공장 배치도, 제품 설계도면 등
                </li>
                <li>
                  ③ 통제구역, 시건장치, 패스워드 등으로 접근이 제한된 정보
                </li>
                <li>④ 회사가 영업비밀로 지정한 기타 비밀정보</li>
              </ul>
            </li>
            <li>
              2. 본인은, 회사 재직 중 및 퇴사 후에도 회사의 영업비밀을 비밀로
              유지하고 누설하지 않을 것을 서약합니다.
            </li>
            <li>
              3. 본인은, 회사에 재직 중 취득한 회사의 주요 정보 및 영업비밀에
              대한 모든 권리가 회사의 소유임을 인정합니다.
            </li>
            <li>
              4. 본인은, 회사의 승인을 받지 않고는 회사의 영업비밀을 복제하거나
              보관하지 않을 것을 서약합니다.
            </li>
            <li>
              5. 본인은, 타인의 영업비밀을 침해하지 않을 것이며, 필요한 경우
              회사와 상의할 것을 서약합니다.
            </li>
            <li>
              6. 본인은, 회사의 승인 없이 동종 또는 유사업체와 겸직하거나 자문을
              제공하지 않을 것을 서약합니다.
            </li>
            <li>
              7. 본인은, 회사의 컴퓨터 및 정보처리 장치를 업무 목적으로만 사용할
              것을 서약합니다.
            </li>
            <li>
              8. 본인은, 퇴사 시 회사의 자료를 반납하며 사본을 보유하지 않을
              것을 서약합니다.
            </li>
          </ol>

          <p class="date">
            <span>{{ formatDateTime(contractData.issue_date) }}</span>
          </p>

          <!-- 서명 섹션 -->
          <div class="signature-section">
            <table class="signature-table">
              <tbody>
                <tr>
                  <td class="signature-row">
                    <strong>서약자:</strong>
                    <span class="highlight">{{
                      contractData.employee_name
                    }}</span>
                    <div class="signature-image-container">
                      <img
                        :src="employeeSignature"
                        alt="서명"
                        v-if="employeeSignature"
                        class="signature-image"
                      />
                      <span class="signature-text">(서명)</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 서명 캔버스 모달 -->
      <div
        v-if="isSignaturePadOpen"
        class="signature-modal-overlay"
        @click.self="closeSignaturePad"
      >
        <div class="signature-modal-content">
          <h3>서명 입력</h3>
          <div class="signature-container">
            <canvas
              ref="signatureCanvas"
              class="signature-canvas"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart.prevent="startDrawing"
              @touchmove.prevent="draw"
              @touchend.prevent="stopDrawing"
            ></canvas>
          </div>
          <div class="modal-actions">
            <button @click="clearSignature" class="btn clear-btn">
              <i class="fas fa-eraser"></i> 초기화
            </button>
            <button @click="saveSignature" class="btn save-btn">
              <i class="fas fa-pen-nib"></i> 서명 등록하기
            </button>
            <button @click="closeSignaturePad" class="btn close-btn">
              <i class="fas fa-times"></i> 닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { registerEmployeeContract } from '@/api/emp_info';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';

const props = defineProps({
  contractData: {
    type: Object,
    required: true,
  },
});

// 상위 컴포넌트로 이벤트 전달을 위해 defineEmits 사용
const emit = defineEmits(['close']); // 'close' 이벤트 정의

const zoomLevel = ref(1); // 줌 레벨
const contractViewer = ref(null); // ref 초기화

const employeeSignature = ref(''); // 근로자 서명 데이터
const isSignaturePadOpen = ref(false); // 서명 모달 열림 여부
const signatureCanvas = ref(null); // 캔버스 참조
let canvasContext = null; // 캔버스 드로잉 컨텍스트

const isSubmitting = ref(false); // 로딩 상태를 관리하는 변수

// 서명 캔버스 열기
const openSignaturePad = async () => {
  isSignaturePadOpen.value = true;
  // DOM 렌더링 후 캔버스 초기화
  await nextTick();
  const canvas = signatureCanvas.value;
  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvasContext = canvas.getContext('2d');
    canvasContext.strokeStyle = 'black';
    canvasContext.lineWidth = 4;
  }
};

// 서명 캔버스 닫기
const closeSignaturePad = () => {
  isSignaturePadOpen.value = false;
};

// 서명 캔버스 초기화
const clearSignature = () => {
  if (canvasContext && signatureCanvas.value) {
    canvasContext.clearRect(
      0,
      0,
      signatureCanvas.value.width,
      signatureCanvas.value.height
    );
  }
};

// 서명 저장
const saveSignature = () => {
  if (signatureCanvas.value) {
    employeeSignature.value = signatureCanvas.value.toDataURL('image/png');
    closeSignaturePad();
  }
};

// 드로잉 이벤트
let isDrawing = false;
const startDrawing = (event) => {
  isDrawing = true;
  const { offsetX, offsetY } = getEventPosition(event);
  canvasContext.beginPath();
  canvasContext.moveTo(offsetX, offsetY);
};

const draw = (event) => {
  if (!isDrawing) return;
  const { offsetX, offsetY } = getEventPosition(event);
  canvasContext.lineTo(offsetX, offsetY);
  canvasContext.stroke();
};

const stopDrawing = () => {
  isDrawing = false;
  if (canvasContext) {
    canvasContext.closePath();
  }
};

// 입력 위치 계산
const getEventPosition = (event) => {
  const canvas = signatureCanvas.value;
  if (!canvas) return { offsetX: 0, offsetY: 0 };
  if (event.touches && event.touches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: event.touches[0].clientX - rect.left,
      offsetY: event.touches[0].clientY - rect.top,
    };
  }
  return { offsetX: event.offsetX, offsetY: event.offsetY };
};

//줌 관련
const zoomIn = () => {
  zoomLevel.value += 0.1;
  applyZoom();
};

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.1;
    applyZoom();
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
  applyZoom();
};

const applyZoom = () => {
  if (contractViewer.value) {
    contractViewer.value.style.transform = `scale(${zoomLevel.value})`;
    contractViewer.value.style.transformOrigin = 'center top';
  }
};

// 날짜 포맷 함수
const formatDateTime = (datetime) => {
  if (!datetime) return '미등록';
  const date = new Date(datetime);
  return date
    .toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .replace(/년|월|일/g, (match) => match.trim() + ' ');
};

// 계약서 등록 메서드
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const saveContract = async () => {
  try {
    const contractId = props.contractData.contract_id; // 계약서 ID 가져오기

    if (!employeeSignature.value) {
      alert('서명을 등록해야 계약서를 제출할 수 있습니다.');
      return;
    }

    // 계약서 HTML 엘리먼트 가져오기
    const contractElement = contractViewer.value;
    if (!contractElement) {
      alert('계약서 내용을 찾을 수 없습니다.');
      return;
    }

    // 로딩 상태 시작
    isSubmitting.value = true;

    // HTML 캡처 전 스타일 조정
    const originalOverflow = contractElement.style.overflow; // 기존 overflow 저장
    const originalMaxHeight = contractElement.style.maxHeight; // 기존 maxHeight 저장

    // 스크롤 제거
    contractElement.style.overflow = 'visible';
    contractElement.style.maxHeight = 'none';

    // HTML을 캡처하여 Canvas로 변환 (전체 영역 캡처)
    const canvas = await html2canvas(contractElement, {
      scale: 2, // 고화질을 위해 배율 설정
      useCORS: true, // 크로스 도메인 이미지 문제 해결
      scrollY: 0, // 스크롤 위치 무시
      windowHeight: contractElement.scrollHeight, // DOM 전체 높이를 기준으로 캡처
    });

    // 원래 스타일 복원
    contractElement.style.overflow = originalOverflow;
    contractElement.style.maxHeight = originalMaxHeight;

    const imgData = canvas.toDataURL('image/png'); // Canvas 데이터를 이미지로 변환

    // PDF에 이미지 추가
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 크기의 PDF 생성
    const pdfWidth = 210; // A4 너비 (단위: mm)
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // 비율 유지

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // PDF 파일 Blob 생성
    const pdfBlob = pdf.output('blob'); // PDF를 Blob 형태로 변환

    // S3에 업로드
    const accessToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기

    const response = await registerEmployeeContract(
      contractId,
      pdfBlob,
      accessToken
    );

    alert('비밀유지서약서가 성공적으로 업로드되었습니다!');
    console.log('업로드 결과:', response);

    // 모달 닫기
    emit('close'); // 상위 컴포넌트에 close 이벤트 전달
  } catch (error) {
    console.error('PDF 생성 및 업로드 실패:', error);
    alert('비밀유지서약서를 생성하거나 업로드하는 데 실패했습니다.');
  } finally {
    // 로딩 상태 종료
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* 로딩 오버레이 스타일 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-size: 1.5rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* 로딩 애니메이션 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fa-spinner {
  animation: spin 1s linear infinite; /* 기본 Font Awesome 스타일 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 로딩 오버레이 스타일 끝*/

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 95%;
  max-width: 1200px; /* 모달의 최대 크기 제한 */
  max-height: 900vh; /* 모달의 높이 제한 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden; /* 모달 콘텐츠가 넘치지 않도록 설정 */
}

.viewer-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.contract-title {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
  border-bottom: 2px solid #000;
  padding-bottom: 0.5rem;
}

.contract-container {
  overflow-y: auto;
  transform-origin: center top; /* 줌의 기준점을 설정 */
  max-height: 80vh;
  padding: 5rem;
  border: 1px solid #ddd;
}

.contract {
  font-family: 'Arial', sans-serif;
  line-height: 2.4;
  font-size: 1.6rem;
}

.highlight {
  font-weight: bold;
  color: #00509e;
}

.insurance-list {
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
}

.insurance-list li {
  margin-right: 10px;
}

.insurance-list li:last-child {
  margin-right: 0;
}

.date {
  text-align: center;
  font-size: 3rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* 서명 관련 css */
.left-controls,
.right-controls {
  display: flex;
}

.center-controls {
  display: flex;
  justify-content: center; /* 버튼을 가운데 정렬 */
  align-items: center; /* 수직으로 정렬 */
  gap: 1rem; /* 버튼 간 간격 */
  margin-top: 1rem; /* 위쪽 여백 */
}

.add-signature-btn {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-right: 0.5rem; /* 닫기 버튼과 간격 */
}

.add-signature-btn i {
  margin-right: 0.5rem;
}

.add-signature-btn:hover {
  background-color: #0056b3;
}

/* 서명 캔버스 모달 오버레이 */

.signature-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* 서명 캔버스 모달 콘텐츠 */
.signature-modal-content {
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* 서명 가능한 영역 컨테이너 */
.signature-container {
  border: 2px dashed #007bff; /* 테두리를 점선으로 설정 */
  background: #e9f5ff; /* 연한 파란색 배경 */
  border-radius: 4px;
  margin-bottom: 1rem;
  /* padding: 1rem; */
  display: flex;
  justify-content: center;
  align-items: center;
}

/*서명 파트*/
.signature-section {
  margin-top: 2rem;
}

.signature-table {
  width: 100%;
  border-collapse: collapse;
}

.signature-row {
  display: flex; /* 가로로 배치 */
  align-items: center; /* 수직 중앙 정렬 */
  gap: 1rem; /* 항목 간 간격 */
  font-size: 1.4rem;
}

.signature-image-container {
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  width: 100px; /* 컨테이너 너비 설정 */
  height: 50px; /* 컨테이너 높이 설정 */
}

.signature-image {
  position: absolute; /* 절대 위치로 텍스트 위에 겹침 */
  top: 0;
  left: 0;
  width: 100%; /* 컨테이너 크기에 맞춤 */
  height: 100%; /* 컨테이너 크기에 맞춤 */
  object-fit: contain; /* 이미지 비율 유지 */
  z-index: 1; /* 텍스트 위에 표시 */
}

.signature-text {
  position: absolute; /* 서명 텍스트를 컨테이너 안에 고정 */
  top: 50%; /* 컨테이너의 세로 가운데 */
  left: 50%; /* 컨테이너의 가로 가운데 */
  transform: translate(-50%, -50%); /* 완전한 중앙 정렬 */
  font-size: 1.4rem;
  color: #aaa;
  z-index: 0; /* 이미지 뒤에 표시 */
  pointer-events: none; /* 클릭 불가능 */
  pointer-events: none; /* 클릭 불가능 */
  white-space: nowrap; /* 줄바꿈 방지 */
  line-height: 1; /* 줄 간격 조정 */
  text-align: center; /* 텍스트 정렬 */
}

/* 서명 캔버스 */
.signature-canvas {
  cursor: crosshair;
}

.modal-actions {
  display: flex; /* 버튼을 가로로 배치 */
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 1.5rem; /* 버튼 간의 간격 */
  margin-top: 1.5rem; /* 상단 여백 */
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #003566;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
}

.btn i {
  margin-right: 0.5rem;
}

.btn:hover {
  background-color: #00509e;
}
.clear-btn {
  background-color: #ffc107; /* 노란색 */
  font-size: 12px;
  color: #000;
}

.clear-btn:hover {
  background-color: #e0a800;
}

.save-btn {
  background-color: #00509e; /* 청색 */
  font-size: 12px;
  color: #fff;
}

.save-btn:hover {
  background-color: #003566;
}

.close-btn {
  background-color: #dc3545; /* 빨간색 */
  font-size: 12px;
  color: #fff;
}

.close-btn:hover {
  background-color: #c82333;
}
</style>
