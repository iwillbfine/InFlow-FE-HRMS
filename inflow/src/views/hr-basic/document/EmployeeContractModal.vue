<template>
    <div v-if="contractData" class="modal-overlay">
      <div class="modal-content">
        <!-- 상단 버튼 컨트롤 -->
        <div class="viewer-controls">
          <div class="left-controls">
            <button class="btn save-btn" @click="saveContract">
              <i class="fas fa-save"></i> 계약서 등록
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
  
        <!-- 계약서 내용 -->
        <div class="contract-container" ref="contractViewer">
          <h2 class="contract-title">표준 근로계약서</h2>
          <div class="contract">
            <p class="intro">
              <span class="highlight">{{ contractData.ceo_name }}</span> (이하 “사업주”라 함)과(와) <span class="highlight">{{ contractData.employee_name }}</span> (이하 “근로자”라 함)은 다음과 같이 근로계약을 체결한다.
            </p>
            <p><strong>1. 근로계약기간:</strong> <span class="highlight">{{ contractData.contract_start_date }}</span>부터 <span class="highlight">{{ contractData.contract_end_date }}</span>까지</p>
            <p><strong>2. 근 무 장 소:</strong> <span class="highlight">{{ contractData.work_location }}</span></p>
            <p><strong>3. 업무의 내용:</strong> <span class="highlight">{{ contractData.job_description }}</span></p>
            <p><strong>4. 소정근로시간:</strong> <span class="highlight">{{ contractData.work_start_time }}</span>부터 <span class="highlight">{{ contractData.work_end_time }}</span></p>
            <p><strong>5. 근무일/휴일:</strong> 매주 <span class="highlight">{{ contractData.work_days }}</span>일 근무</p>
            <p><strong>6. 임 금:</strong> <span class="highlight">{{ contractData.salary_amount }}원</span></p>
            <p><strong>7. 연차유급휴가:</strong> 연차유급휴가는 근로기준법에서 정하는 바에 따라 부여함</p>
            <p><strong>8. 사회보험 적용여부:</strong></p>
            <ul class="insurance-list">
              <li>☑ 고용보험</li>
              <li>☑ 산재보험</li>
              <li>☑ 국민연금</li>
              <li>☑ 건강보험</li>
            </ul>
            <p><strong>9. 근로계약서 교부:</strong></p>
            <p>- 사업주는 근로계약을 체결함과 동시에 본 계약서를 사본하여 근로자에게 교부함</p>
            <p><strong>10. 근로계약, 취업규칙 등의 성실한 이행의무:</strong></p>
            <p>- 사업주와 근로자는 각자가 근로계약, 취업규칙, 단체협약을 성실히 이행하여야 함</p>
            <p><strong>11. 기타:</strong></p>
            <p>- 이 계약에 정함이 없는 사항은 근로기준법령에 의함</p>
            <p class="date"><span>{{ formatDateTime(contractData.issue_date) }}</span></p>
  
            <!-- 서명 섹션 -->
            <div class="signature-section">
              <table class="signature-table">
                <tr>
                  <td class="label"><strong>(사업주)</strong></td>
                  <td>
                    <p>사업체명: <span class="highlight">{{ contractData.company_name }}</span></p>
                    <p>주소: <span class="highlight">{{ contractData.company_address }}</span></p>
                    <p>전화: <span class="highlight">{{ contractData.company_phone_number }}</span></p>
                    <div class="signature-row">
                      <span>대표자:</span>
                      <span class="highlight">{{ contractData.ceo_name }}</span>
                      <div class="signature-image-container">
                        <img :src="contractData.ceo_signature" alt="서명" class="signature-image" />
                        <span class="signature-text">(서명)</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="label"><strong>(근로자)</strong></td>
                  <td>
                    <p>주소: <span class="highlight">{{ contractData.employee_address }}</span></p>
                    <p>연락처: <span class="highlight">{{ contractData.employee_phone_number }}</span></p>
                    <p>
                        <div class="signature-row">
                            <span>성명:</span>
                       <span class="highlight">{{ contractData.employee_name }}</span>
                      <div class="signature-image-container">
                        <img :src="employeeSignature" alt="서명" v-if="employeeSignature" class="signature-image" />
                        <span class="signature-text">(서명)</span>
                      </div>
                    </div>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
  
     <!-- 서명 캔버스 모달 -->
     <div v-if="isSignaturePadOpen" class="signature-modal-overlay" @click.self="closeSignaturePad">
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

const props = defineProps({
  contractData: {
    type: Object,
    required: true,
  },
});

const zoomLevel = ref(1); // 줌 레벨
const contractViewer = ref(null); // ref 초기화

const employeeSignature = ref(""); // 근로자 서명 데이터
const isSignaturePadOpen = ref(false); // 서명 모달 열림 여부
const signatureCanvas = ref(null); // 캔버스 참조
let canvasContext = null; // 캔버스 드로잉 컨텍스트

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
    canvasContext.lineWidth = 2;
  }
};

// 서명 캔버스 닫기
const closeSignaturePad = () => {
  isSignaturePadOpen.value = false;
};

// 서명 캔버스 초기화
const clearSignature = () => {
  if (canvasContext && signatureCanvas.value) {
    canvasContext.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height);
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
    contractViewer.value.style.transformOrigin = "center top";
  }
};

// 날짜 포맷 함수
const formatDateTime = (datetime) => {
  if (!datetime) return '미등록';
  const date = new Date(datetime);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).replace(/년|월|일/g, match => match.trim() + ' ');
};

onMounted(() => {
  if (contractViewer.value) {
    // 초기 설정 또는 디버깅용 로그
    console.log("contractViewer initialized", contractViewer.value);
  }
});

</script>

<style scoped>.modal-overlay {
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
    max-height: 60vh;
    padding: 5rem;
    border: 1px solid #ddd;
  }
  
  .contract {
    font-family: "Arial", sans-serif;
    line-height: 1.8;
    font-size: 2rem;
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

  
  .signature-section {
    margin-top: 2rem;
  }
  
  .signature-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  .signature-table .label {
    width: 10%;
    text-align: left;
    vertical-align: top;
    padding-right: 10px;
    font-weight: bold;
  }
  
  .signature-table td {
    padding: 8px 0;
  }
  
  .signature-table p {
    margin: 0.5rem 0;
    font-size: 1.4rem;
  }
  
  .signature-row {
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 1rem;
  }
  
  .signature-image-container {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 40px;
  }
  
  .signature-image {
    position: absolute;
    top: 6px;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 1;
  }
  
  .signature-text {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 1.4rem;
    z-index: 0;
    color: #333;
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
  background-color: #00509e;; /* 청색 */
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
