<template>
  <div v-if="certificateData" class="modal-overlay">
    <div class="modal-content">
  
      <!-- 증명서 다운 로딩 오버레이 -->
      <div v-if="isSubmitting" class="loading-overlay">
        <div class="spinner"></div>
        <p>재직 증명서를 발급 중 입니다. 잠시만 기다려 주세요...</p>
      </div>

      <!-- 증명서 인쇄 로딩 오버레이 -->
      <div v-if="isPrinting" class="loading-overlay">
        <div class="spinner"></div>
        <p>인쇄 중 입니다. 잠시만 기다려 주세요...</p>
      </div>

      <!-- 상단 버튼 컨트롤 -->
      <div class="viewer-controls">
        <div class="left-controls">

          <button class="btn download-btn" @click="downloadCertificate" :disabled="isSubmitting">
            <template v-if="isSubmitting">
              <i class="fas fa-spinner fa-spin"></i> 다운로드 중...
            </template>
            <template v-else>
              <i class="fas fa-download"></i> 다운로드
            </template>
          </button>

          <button class="btn print-btn" @click="printCertificate" :disabled="isPrinting">
            <template v-if="isPrinting">
              <i class="fas fa-spinner fa-spin"></i> 인쇄 중...
            </template>
            <template v-else>
              <i class="fas fa-print"></i> 인쇄
            </template>
          </button>
          
        </div>
        <div class="center-controls">
          <button class="btn zoom-in-btn" @click="zoomIn">
            <i class="fas fa-search-plus"></i> 확대
          </button>
          <button class="btn zoom-out-btn" @click="zoomOut">
            <i class="fas fa-search-minus"></i> 축소
          </button>
          <button class="btn reset-zoom-btn" @click="resetZoom">
            <i class="fas fa-redo-alt"></i> 초기화
          </button>
        </div>
        <div class="right-controls">
          <button class="btn close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i> 닫기
          </button>
        </div>
      </div>

      <!-- 재직증명서 내용 -->
      <div class="certificate-container" ref="certificateViewer">
        <h2 class="certificate-title">재직증명서</h2>
        <p><strong>사원명:</strong> <span class="highlight">{{ certificateData.employee_name }}</span></p>
        <p><strong>생년월일:</strong> <span class="highlight">{{ certificateData.birth_date }}</span></p>
        <p><strong>주소:</strong> <span class="highlight">{{ certificateData.address }}</span></p>
        <p><strong>부서:</strong> <span class="highlight">{{ certificateData.department_name }}</span></p>
        <p><strong>직위:</strong> <span class="highlight">{{ certificateData.position_name }}</span></p>
        <p><strong>발급 목적:</strong> <span class="highlight">{{ certificateData.purpose }}</span></p>
        <p><strong>회사명:</strong> <span class="highlight">{{ certificateData.company_name }}</span></p>
        <p><strong>회사 주소:</strong> <span class="highlight">{{ certificateData.company_address }}</span></p>
        <p><strong>대표자:</strong> <span class="highlight">{{ certificateData.ceo_name }}</span></p>
        <p><strong>사업자등록번호:</strong> <span class="highlight">{{ certificateData.business_registration_number }}</span></p>
        <p><strong>발급일:</strong> <span class="highlight">{{ formatDateTime(certificateData.issue_date) }}</span></p>
        <p class="certificate-content">
          {{ certificateData.content }}
        </p>
        <div class="stamp-container">
          <img :src="certificateData.company_stamp_url" alt="회사 직인" class="stamp-image" crossOrigin="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const isSubmitting = ref(false); // 로딩 상태를 관리하는 변수
const isPrinting = ref(false); // 로딩 상태를 관리하는 변수

// Props 정의
const props = defineProps({
  certificateData: {
    type: Object,
    required: true,
  },
});


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

// 확대/축소 상태
const zoomLevel = ref(1);
const certificateViewer = ref(null);

// 확대/축소/초기화 메서드
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
  if (certificateViewer.value) {
    certificateViewer.value.style.transform = `scale(${zoomLevel.value})`;
    certificateViewer.value.style.transformOrigin = 'center top';
  }
};

// PDF 다운로드
const downloadCertificate = async () => {
  try {
    // 재직증명서 HTML 요소 가져오기
    const certificateElement = certificateViewer.value;
    if (!certificateElement) {
      alert('증명서를 찾을 수 없습니다.');
      return;
    }
    // 로딩 상태 시작
    isSubmitting.value = true;

    // HTML 캡처 전 스타일 조정
    const originalOverflow = certificateElement.style.overflow; // 기존 overflow 저장
    const originalMaxHeight = certificateElement.style.maxHeight; // 기존 maxHeight 저장

    // 스크롤 제거
    certificateElement.style.overflow = 'visible';
    certificateElement.style.maxHeight = 'none';

    // HTML을 캡처하여 Canvas로 변환 (전체 영역 캡처)
    const canvas = await html2canvas(certificateElement, {
      scale: 2, // 고화질을 위해 배율 설정
      useCORS: true, // 크로스 도메인 이미지 문제 해결
      scrollY: 0, // 스크롤 위치 무시
      windowHeight: certificateElement.scrollHeight, // DOM 전체 높이를 기준으로 캡처
    });

    // 원래 스타일 복원
    certificateElement.style.overflow = originalOverflow;
    certificateElement.style.maxHeight = originalMaxHeight;

    const imgData = canvas.toDataURL('image/png'); // Canvas 데이터를 이미지로 변환

    // PDF 생성 및 이미지 추가
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 크기의 PDF 생성
    const pdfWidth = 210; // A4 너비 (단위: mm)
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // 비율 유지

    // `props.certificateData`로 접근
    const { company_name, employee_name, issue_date } = props.certificateData;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // PDF 파일 다운로드
    const pdfFileName = `${company_name}_${employee_name}_재직증명서_${issue_date}.pdf`;
    pdf.save(pdfFileName); // 파일 다운로드

    alert('재직 증명서를 성공적으로 발급 됐습니다.');
  } catch (error) {
    console.error('PDF 생성 실패:', error);
    alert('PDF를 생성하는 데 실패했습니다.');
  } finally {
    // 로딩 상태 종료
    isSubmitting.value = false;
  }
};



// 증명서 인쇄
const printCertificate = async () => {
  const certificateElement = certificateViewer.value;
  if (!certificateElement) {
    alert('증명서를 찾을 수 없습니다.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // 로딩 상태 시작
  isPrinting.value = true;

  // 새 창에 증명서 내용을 작성
  printWindow.document.write(`
    <html>
      <head>
        <title>재직증명서</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .certificate { max-width: 800px; margin: auto; }
        </style>
      </head>
      <body>
        ${certificateElement.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // DOM 렌더링 완료 후 인쇄
  printWindow.onload = async () => {
    try {
      printWindow.focus();
      printWindow.print();

      // 인쇄 완료 또는 취소 후 로딩 상태 종료
      printWindow.onafterprint = () => {
        isPrinting.value = false;
        printWindow.close();
      };
    } catch (error) {
      console.error('인쇄 중 오류:', error);
      isPrinting.value = false;
      printWindow.close();
    }
  };

  // 보조적으로 5초 뒤 로딩 상태 종료 및 창 닫기
  setTimeout(() => {
    if (!printWindow.closed) {
      isPrinting.value = false; // 로딩 상태 종료
      printWindow.close();
    }
  }, 5000);
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
  width: 90%;
  max-width: 1200px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.viewer-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.certificate-container {
  overflow-y: auto;
  transform-origin: center top;
  max-height: 80vh;
  padding: 2rem;
  border: 1px solid #ddd;
  font-family: 'Arial', sans-serif;
  line-height: 1.8;
  font-size: 1.4rem;
}

.certificate-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.highlight {
  font-weight: bold;
  color: #00509e;
}

.certificate-content {
  margin-top: 1rem;
  text-align: justify;
}

.stamp-container {
  text-align: center;
  margin-top: 2rem;
}

.stamp-image {
  max-width: 150px;
  height: auto;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #00509e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn:hover {
  background-color: #003566;
}
</style>
