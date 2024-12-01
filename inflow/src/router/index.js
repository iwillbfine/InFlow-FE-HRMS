import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import ChatbotView from '@/views/chatbot/ChatbotView.vue';
import MyInfoView from '@/views/hr-basic/MyInfoView.vue';
import AttendanceView from '@/views/hr-basic/AttendanceView.vue';
import SalaryView from '@/views/hr-basic/SalaryView.vue';
import ContractView from '@/views/hr-basic/ContractView.vue';
import PersonalEvalView from '@/views/evaluation/PersonalEvalView.vue';
import LeaderEvalView from '@/views/evaluation/LeaderEvalView.vue';
import EvalTaskView from '@/views/evaluation/EvalTaskView.vue';
import EmployeeInfoView from '@/views/hr-management/EmployeeInfoView.vue';
import EmployeeUploadView from '@/views/hr-management/EmployeeUploadView.vue';
import DepartmentManagementView from '@/views/hr-management/DepartmentManagementView .vue';
import AppointmentManagementView from '@/views/hr-management/AppointmentManagementView.vue';
import EvalManagementView from '@/views/hr-management/EvalManagementView.vue';
import VacationManagementView from '@/views/hr-management/VacationManagementView.vue';
import EmployeeSearchView from '@/views/emp-search/EmployeeSearchView.vue';
import StatisticsView from '@/views/statistics/StatisticsView.vue';
import LoginView from '@/views/login/LoginView.vue';
import CommuteView from '@/views/hr-basic/attendance/CommuteView.vue';
import RemoteView from '@/views/hr-basic/attendance/RemoteView.vue';
import OvertimeView from '@/views/hr-basic/attendance/OvertimeView.vue';
import LeaveView from '@/views/hr-basic/attendance/LeaveView.vue';
import ReturnView from '@/views/hr-basic/attendance/ReturnView.vue';
import BusinessTripView from '@/views/hr-basic/attendance/BusinessTripView.vue';
import DispatchView from '@/views/hr-basic/attendance/DispatchView.vue';
import VacationView from '@/views/hr-basic/attendance/VacationView.vue';
import VacationPaymentView from '@/views/hr-management/vacation/VacationPaymentView.vue';
import VacationPolicyView from '@/views/hr-management/vacation/VacationPolicyView.vue';
import CareerInfoUploadView from '@/views/hr-management/employee-upload/CareerInfoUploadView.vue';
import EducationInfoUploadView from '@/views/hr-management/employee-upload/EducationInfoUploadView.vue';
import QualificationInfoUploadView from '@/views/hr-management/employee-upload/QualificationInfoUploadView.vue';
import LanguageTestInfoUploadView from '@/views/hr-management/employee-upload/LanguageTestInfoUploadView.vue';
import DisciplineRewardInfoUploadView from '@/views/hr-management/employee-upload/DisciplineRewardInfoUploadView.vue';
import FamilyMemberInfoUploadView from '@/views/hr-management/employee-upload/FamilyMemberInfoUploadView.vue';
import MyDepartmentView from '@/views/hr-basic/MyDepartmentView.vue';
import EmployeeInfoUploadView from '@/views/hr-management/employee-upload/EmployeeInfoUploadView.vue';
import RemoteRequestsView from '@/views/hr-basic/attendance/RemoteRequestsView.vue';
import OvertimeRequestsView from '@/views/hr-basic/attendance/OvertimeRequestsView.vue';
import VacationRequestsView from '@/views/hr-basic/attendance/VacationRequestsView.vue';
import LeaveRequestsView from '@/views/hr-basic/attendance/LeaveRequestsView.vue';
import ReturnRequestsView from '@/views/hr-basic/attendance/ReturnRequestsView.vue';
import BusinessTripRequestsView from '@/views/hr-basic/attendance/BusinessTripRequestsView.vue';
import DispatchRequestsView from '@/views/hr-basic/attendance/DispatchRequestsView.vue';
import SalaryManagementView from '@/views/hr-management/SalaryManagementView.vue';
import AppointmentsUploadView from '@/views/hr-management/appointment/AppointmentUploadView.vue';
import AppointmentsHistoryView from '@/views/hr-management/appointment/AppointmentHistoryView.vue';
import SalaryDetailView from '@/views/hr-basic/salary/SalaryDetailView.vue';
import SalaryListView from '@/views/hr-basic/salary/SalaryListView.vue';
import SeverancePayView from '@/views/hr-basic/salary/SeverancePayView.vue';

// 인사기본- 사원
import ProfileView from '@/views/hr-basic/employee/ProfileView.vue';
import CareerInfoView from '@/views/hr-basic/employee/CareerInfoView.vue';
import DisciplineRewardInfoView from '@/views/hr-basic/employee/DisciplineRewardInfoView.vue';
import EducationInfoView from '@/views/hr-basic/employee/EducationInfoView.vue';
import FamilyMemberInfoView from '@/views/hr-basic/employee/FamilyMemberInfoView.vue';
import LanguageTestInfoView from '@/views/hr-basic/employee/LanguageTestInfoView.vue';
import QualificationInfoView from '@/views/hr-basic/employee/QualificationInfoView.vue';
import CareerInfoUpdateView from '@/views/hr-basic/employee/CareerInfoUpdateView.vue';
import EducationInfoUpdateView from '@/views/hr-basic/employee/EducationInfoUpdateView.vue';
import QualificationInfoUpdateView from '@/views/hr-basic/employee/QualificationInfoUpdateView.vue';
import LanguageTestInfoUpdateView from '@/views/hr-basic/employee/LanguageTestInfoUpdateView.vue';

// 인사기본- 계약서
import ContractSignView from '@/views/hr-basic/document/ContractSignView.vue';
import CertificateView from '@/views/hr-basic/document/CertificateView.vue';

const routes = [
  {
    path: '/changuk/profile',
    name: '인적사항',
    component: ProfileView,
  },

  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/emp-search',
    name: 'emp-search',
    component: EmployeeSearchView,
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    component: ChatbotView,
  },
  {
    path: '/hr-basic',
    name: 'hr-basic',
    redirect: '/hr-basic/my-info/careers',
    component: MyInfoView,
  },
  // 인사기본- 사원
  {
    path: '/hr-basic/my-info',
    name: 'hr-basic-my-info',
    redirect: '/hr-basic/my-info/careers',
    component: MyInfoView,
    children: [
      {
        path: 'careers',
        name: 'career',
        component: CareerInfoView,
      },
      {
        path: 'careers/update',
        name: 'career-update',
        component: CareerInfoUpdateView,
      },
      {
        path: 'disciplinerewards',
        name: 'discipline-reward',
        component: DisciplineRewardInfoView,
      },
      {
        path: 'educations',
        name: 'education',
        component: EducationInfoView,
      },
      {
        path: 'educations/update',
        name: 'education-update',
        component: EducationInfoUpdateView,
      },
      {
        path: 'familymembers',
        name: 'family-member',
        component: FamilyMemberInfoView,
      },
      {
        path: 'languagetests',
        name: 'language-test',
        component: LanguageTestInfoView,
      },
      {
        path: 'languagetests/update',
        name: 'language-test-update',
        component: LanguageTestInfoUpdateView,
      },
      {
        path: 'qualifications',
        name: 'qualification',
        component: QualificationInfoView,
      },
      {
        path: 'qualifications/update',
        name: 'qualification-update',
        component: QualificationInfoUpdateView,
      },
    ],
  },
  {
    path: '/hr-basic/attendance',
    name: 'hr-basic-attendance',
    component: AttendanceView,
    children: [
      {
        path: '',
        name: 'hr-basic-attendance-default',
        component: CommuteView,
      },
      {
        path: 'commute',
        name: 'hr-basic-attendance-commute',
        component: CommuteView,
      },
      {
        path: 'remote',
        name: 'hr-basic-attendance-remote',
        component: RemoteView,
      },
      {
        path: 'remote/requests',
        name: 'hr-basic-attendance-remote-requests',
        component: RemoteRequestsView,
      },
      {
        path: 'overtime',
        name: 'hr-basic-attendance-overtime',
        component: OvertimeView,
      },
      {
        path: 'overtime/requests',
        name: 'hr-basic-attendance-overtime-requests',
        component: OvertimeRequestsView,
      },
      {
        path: 'vacation',
        name: 'hr-basic-attendance-vacation',
        component: VacationView,
      },
      {
        path: 'vacation/requests',
        name: 'hr-basic-attendance-vacation-requests',
        component: VacationRequestsView,
      },
      {
        path: 'leave',
        name: 'hr-basic-attendance-leave',
        component: LeaveView,
      },
      {
        path: 'leave/requests',
        name: 'hr-basic-attendance-leave-requests',
        component: LeaveRequestsView,
      },
      {
        path: 'return',
        name: 'hr-basic-attendance-return',
        component: ReturnView,
      },
      {
        path: 'return/requests',
        name: 'hr-basic-attendance-return-requests',
        component: ReturnRequestsView,
      },
      {
        path: 'business-trip',
        name: 'hr-basic-attendance-business-trip',
        component: BusinessTripView,
      },
      {
        path: 'business-trip/requests',
        name: 'hr-basic-attendance-business-trip-requests',
        component: BusinessTripRequestsView,
      },
      {
        path: 'dispatch',
        name: 'hr-basic-attendance-dispatch',
        component: DispatchView,
      },
      {
        path: 'dispatch/requests',
        name: 'hr-basic-attendance-dispatch-requests',
        component: DispatchRequestsView,
      },
    ]
  },
  {
    path: '/hr-basic/salary',
    name: 'hr-basic-salary',
    component: SalaryView,
    children: [
      {
        path: '',
        name: 'hr-basic-salary-default',
        redirect: `/hr-basic/salary/detail/${localStorage.getItem('employeeId')}`,
      },
      {
        path: 'detail/:employeeId',
        name: 'hr-basic-salary-detail',
        component: SalaryDetailView,
      },
      {
        path: 'list/:employeeId',
        name: 'hr-basic-salary-list',
        component: SalaryListView,
      },
      {
        path: 'severance-pay',
        name: 'hr-basic-severance-pay',
        component: SeverancePayView,
      }
    ]
  },
   // 인사기본- 계약서서명 및 재직 증명서
  {
    path: '/hr-basic/document',
    name: 'hr-basic-document',
    component: ContractView,
    children: [
      {
        path: '',
        name: 'hr-basic-document-default',
        component: ContractSignView,
      },
      {
        path: 'contract',
        name: 'hr-basic-document-contract',
        component: ContractSignView,
      },
      {
        path: 'certificate',
        name: 'hr-basic-document-certificate',
        component: CertificateView,
      },
      ]
  }, 
  {
    path: '/hr-basic/my-department',
    name: 'hr-basic-my-department',
    component: MyDepartmentView,
  },
  {
    path: '/hr-management',
    name: 'hr-management',
    component: EmployeeInfoView,
  },
  {
    path: '/hr-management/employee/info',
    name: 'hr-management-employee-info',
    component: EmployeeInfoView,
  },
  {
    path: '/hr-management/employee/upload',
    name: 'hr-management-employee-upload',
    redirect: '/hr-management/employee/upload/employees',
    component: EmployeeUploadView,
    children: [
      {
        path: 'employees',
        name: 'EmployeeInfo',
        component: EmployeeInfoUploadView,
      },
      {
        path: 'careers',
        name: 'CareerInfo',
        component: CareerInfoUploadView,
      },
      {
        path: 'educations',
        name: 'EducationInfo',
        component: EducationInfoUploadView,
      },
      {
        path: 'qualifications',
        name: 'QualificationInfo',
        component: QualificationInfoUploadView,
      },
      {
        path: 'languagetests',
        name: 'LanguageTestInfo',
        component: LanguageTestInfoUploadView,
      },
      {
        path: 'disciplinerewards',
        name: 'DisciplineRewardInfo',
        component: DisciplineRewardInfoUploadView,
      },
      {
        path: 'familymembers',
        name: 'FamilyMemberInfo',
        component: FamilyMemberInfoUploadView,
      },
    ],
  },
  {
    path: '/hr-management/department',
    name: 'hr-management-department',
    component: DepartmentManagementView,
  },
  {
    path: '/hr-management/appointment',
    name: 'hr-management-appointment',
    redirect: '/hr-management/appointment/upload',
    component: AppointmentManagementView,
    children: [
      {
        path: 'upload',
        name: 'upload',
        component: AppointmentsUploadView,
      },{
        path: 'history',
        name: 'history',
        component: AppointmentsHistoryView,
      },
    ],
  },
  {
    path: '/hr-management/evaluation',
    name: 'hr-management-evaluation',
    component: EvalManagementView,
  },
  {
    path: '/hr-management/vacation',
    name: 'hr-management-vacation',
    component: VacationManagementView,
    children: [
      {
        path: '',
        name: 'hr-management-vacation-default',
        component: VacationPaymentView,
      },
      {
        path: 'payment',
        name: 'hr-management-vacation-payment',
        component: VacationPaymentView,
      },
      {
        path: 'policy',
        name: 'hr-management-vacation-policy',
        component: VacationPolicyView,
      },
    ]
  },
  {
    path: '/hr-management/salary',
    name: 'hr-management-salary',
    component: SalaryManagementView,
  },
  {
    path: '/evaluation',
    name: 'evaluation',
    component: PersonalEvalView,
  },
  {
    path: '/evaluation/personal',
    name: 'personal-evaluation',
    component: PersonalEvalView,
  },
  {
    path: '/evaluation/leader',
    name: 'leader-evaluation',
    component: LeaderEvalView,
  },
  {
    path: '/evaluation/task',
    name: 'evaluation-task',
    component: EvalTaskView,
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: StatisticsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
