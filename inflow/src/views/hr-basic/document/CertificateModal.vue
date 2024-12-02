<template>
  <div v-if="certificateData" class="modal-overlay">
    <div class="modal-content">
  
      <!-- 증명서 다운 로딩 오버레이 -->
      <LoadingOverlay :isVisible="isSubmitting" message="증명서를 발급 중입니다. 잠시만 기다려 주세요..." />

      <!-- 증명서 인쇄 로딩 오버레이 -->
      <LoadingOverlay :isVisible="isPrinting" message="인쇄 중 입니다. 잠시만 기다려 주세요..." />

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
      <div class="certificate-wrapper" ref="certificateViewer">
        <div class="certificate-print-wrapper">
          <h2 class="certificate-title">재직증명서</h2>
          <div class="certificate-details">
            <table class="certificate-table">
              <tbody>
                <tr>
                  <td class="label">소속</td>
                  <td class="value">{{ certificateData.department_name }}</td>
                  <td class="label">직위</td>
                  <td class="value">{{ certificateData.position_name }}</td>
                </tr>
                <tr>
                  <td class="label">성명</td>
                  <td class="value">{{ certificateData.employee_name }}</td>
                  <td class="label">생년월일</td>
                  <td class="value">{{ certificateData.birth_date }}</td>
                </tr>
                <tr>
                  <td class="label">입사일</td>
                  <td class="value">{{ certificateData.join_date }}</td>
                  <td class="label">주소</td>
                  <td class="value">{{ certificateData.address }}</td>
                </tr>
              </tbody>
            </table>
          </div>


          <div class="certificate-content">
            <p>{{ certificateData.content }}</p>
          </div>

          <div class="certificate-footer">
            <table class="footer-table">
              <tbody>
                <tr>
                  <td class="label">발급 목적</td>
                  <td class="value">{{ certificateData.purpose }}</td>
                </tr>
                <tr>
                  <td class="label">회사명</td>
                  <td class="value">{{ certificateData.company_name }}</td>
                </tr>
                <tr>
                  <td class="label">회사 주소</td>
                  <td class="value">{{ certificateData.company_address }}</td>
                </tr>
                <tr>
                  <td class="label">사업자등록번호</td>
                  <td class="value">{{ certificateData.business_registration_number }}</td>
                </tr>
                <tr>
                  <td class="label">대표자</td>
                  <td class="value">{{ certificateData.ceo_name }}</td>
                </tr>
              </tbody>
            </table>
            <div class="stamp-container">
              <img :src="certificateData.company_stamp_url" alt="회사 직인" class="stamp-image" crossOrigin="true" />
            </div>
          </div>
        </div>
      </div>






    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import LoadingOverlay from "@/components/common/LoadingOverlay.vue";


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
  try {
    const certificateElement = certificateViewer.value; // 증명서 HTML 요소 가져오기
    if (!certificateElement) {
      alert("증명서를 찾을 수 없습니다.");
      return;
    }

    // 로딩 상태 시작
    isPrinting.value = true;

    // HTML을 캡처하여 Canvas로 변환
    const canvas = await html2canvas(certificateElement, {
      scale: 2, // 고화질
      useCORS: true, // 크로스 도메인 이미지 해결
    });

    const imgData = canvas.toDataURL("image/png"); // Canvas 데이터를 이미지로 변환
    const pdf = new jsPDF("p", "mm", "a4"); // A4 용지 PDF 생성
    const pdfWidth = 210; // A4 너비 (단위: mm)
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // 비율 유지

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // PDF에 이미지 추가

    // PDF 파일 이름 설정
    const companyName = props.certificateData.company_name.replace(/[\s]/g, "_");
    const employeeName = props.certificateData.employee_name.replace(/[\s]/g, "_");
    const issueDate = props.certificateData.issue_date.replace(/-/g, "");
    const pdfFileName = `${companyName}_${employeeName}_재직증명서_${issueDate}.pdf`;

    // PDF Blob 생성 및 URL 변환
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);

    // 새 창에서 PDF 미리보기 열기
    const printWindow = window.open(pdfURL, "_blank");
    if (!printWindow) {
      alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
      isPrinting.value = false;
      return;
    }

    // 로딩 상태 종료
    printWindow.onload = () => {
      isPrinting.value = false; // 로딩 상태 종료
    };

    // 예비적으로 5초 뒤 로딩 상태 종료
    setTimeout(() => {
      isPrinting.value = false;
    }, 5000);
  } catch (error) {
    console.error("PDF 생성 실패:", error);
    alert("PDF 생성 중 문제가 발생했습니다.");
    isPrinting.value = false;
  }
};


</script>

<style scoped>



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
  padding: 1.5rem; /* 패딩 축소 */
  border-radius: 8px;
  width: 90%;
  max-height: 95vh; /* 세로 최대 높이 설정 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.center-controls {
  display: flex;
  justify-content: center; /* 버튼을 가운데 정렬 */
  align-items: center; /* 수직으로 정렬 */
  gap: 1rem; /* 버튼 간 간격 */
  margin-top: 1rem; /* 위쪽 여백 */
}

.viewer-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}



/* 재직 증명서 CSS */
.certificate-wrapper {
  padding: 1rem;
  font-family: "Arial", sans-serif;
  background: #f9f9f9;
}

.certificate-print-wrapper {
  border: 2px solid #333; /* 테두리 두께 조정 */
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 800px;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.certificate-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
  color: #333;
  text-decoration: underline;
}

.certificate-details,
.certificate-footer {
  margin-bottom: 2rem;
}

.certificate-table,
.footer-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.certificate-table td,
.footer-table td {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
}

.label {
  font-weight: bold;
  background: #e6f7ff;
  color: #00509e;
  text-align: center;
}

.value {
  text-align: left;
  color: #333;
}

.certificate-content {
  font-size: 1.4rem;
  line-height: 1.8;
  text-align: center;
  font-weight: bold;
  margin-bottom: 2rem;
  padding: 0 1rem;
  color: #444;
}

.stamp-container {
  text-align: right;
  margin-top: 2rem;
}

.stamp-image {
  width: 100px;
  height: auto;
}

/* 테이블과 텍스트 사이 여백 */
.certificate-details table,
.certificate-footer table {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

/* 전문적인 테두리 */
.certificate-wrapper::after {
  content: "";
  display: block;
  border: 1px dashed #aaa;
  margin-top: 20px;
}

/* 재직 증명서 css 끝 */

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
