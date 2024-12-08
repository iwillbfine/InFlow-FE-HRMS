import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import ChatbotView from '@/views/chatbot/ChatbotView.vue';
import MyInfoView from '@/views/hr-basic/MyInfoView.vue';
import AttendanceView from '@/views/hr-basic/AttendanceView.vue';
import SalaryView from '@/views/hr-basic/SalaryView.vue';
import ContractView from '@/views/hr-basic/ContractView.vue';
import PersonalEvalView from '@/views/evaluation/PersonalEvalView.vue';
import PersonalEvalFindView from '@/views/evaluation/PersonalEvalFindView.vue';
import PersonalEvalCreateAndFindView from '@/views/evaluation/PersonalEvalCreateAndFindView.vue';
import FeedbackManageView from '@/views/evaluation/leader/FeedbackManageView.vue';
import LeaderEvalListView from '@/views/evaluation/leader/LeaderEvalListView.vue';
import LeaderEvalView from '@/views/evaluation/LeaderEvalView.vue';
import EvalTaskView from '@/views/evaluation/EvalTaskView.vue';
import EvalTypeManagementView from '@/views/evaluation/EvalTypeManagementView.vue';
import EvalPolicyView from '@/views/evaluation/EvalPolicyView.vue';
import EvalGradeView from '@/views/evaluation/EvalGradeView.vue';
import EmployeeInfoView from '@/views/hr-management/EmployeeInfoView.vue';
import EmployeeUploadView from '@/views/hr-management/EmployeeUploadView.vue';
import DepartmentManagementView from '@/views/hr-management/DepartmentManagementView .vue';
import AppointmentManagementView from '@/views/hr-management/AppointmentManagementView.vue';
import VacationManagementView from '@/views/hr-management/VacationManagementView.vue';
import EmployeeSearchView from '@/views/emp-search/EmployeeSearchView.vue';
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
import DisciplineRewardInfoView from '@/views/hr-basic/employee/DisciplineRewardInfoView.vue';
import EducationInfoView from '@/views/hr-basic/employee/EducationInfoView.vue';
import FamilyMemberInfoView from '@/views/hr-basic/employee/FamilyMemberInfoView.vue';
import LanguageTestInfoView from '@/views/hr-basic/employee/LanguageTestInfoView.vue';
import QualificationInfoView from '@/views/hr-basic/employee/QualificationInfoView.vue';
import QualificationInfoUpdateView from '@/views/hr-basic/employee/QualificationInfoUpdateView.vue';
import LanguageTestInfoUpdateView from '@/views/hr-basic/employee/LanguageTestInfoUpdateView.vue';
import FamilyMemberInfoUpdateView from '@/views/hr-basic/employee/FamilyMemberInfoUpdateView.vue';
import CareerInfoView from '@/views/hr-basic/employee/CareerInfoVIew.vue';
import CareerInfoUpdateView from '@/views/hr-basic/employee/CareerInfoUpdateVIew.vue';
import EducationInfoUpdateView from '@/views/hr-basic/employee/EducationInfoUpdateVIew.vue';

// 인사기본- 계약서
import ContractSignView from '@/views/hr-basic/document/ContractSignView.vue';
import CertificateView from '@/views/hr-basic/document/CertificateView.vue';
import EvalPolicyManagementView from '@/views/evaluation/EvalPolicyManagementView.vue';
import EmployeeSalaryListView from '@/views/hr-management/Salary/EmployeeSalaryListView.vue';
import IrregularAllowanceView from '@/views/hr-management/Salary/IrregularAllowanceView.vue';
import DeptTaskUploadView from '@/views/evaluation/leader/DeptTaskUploadView.vue';
import DeptTaskAssignView from '@/views/evaluation/leader/DeptTaskAssignView.vue';
import NonTaxableView from '@/views/hr-management/Salary/NonTaxableView.vue';

// 인사관리 - 부서
import DepartmentManagementInformationView from '@/views/hr-management/department/DepartmentManagementInformationView.vue';
import DepartmentManagementAddView from '@/views/hr-management/department/DepartmentManagementAddView.vue';
import PeriodicSalaryView from '@/views/hr-basic/salary/PeriodicSalaryView.vue';

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
        name: 'hr-basic-career',
        component: CareerInfoView,
      },
      {
        path: 'careers/update',
        name: 'hr-basic-career-update',
        component: CareerInfoUpdateView,
      },
      {
        path: 'disciplinerewards',
        name: 'hr-basic-discipline-reward',
        component: DisciplineRewardInfoView,
      },
      {
        path: 'educations',
        name: 'hr-basic-education',
        component: EducationInfoView,
      },
      {
        path: 'educations/update',
        name: 'hr-basic-education-update',
        component: EducationInfoUpdateView,
      },
      {
        path: 'familymembers',
        name: 'hr-basic-family-member',
        component: FamilyMemberInfoView,
      },
      {
        path: 'familymembers/update',
        name: 'hr-basic-family-member-update',
        component: FamilyMemberInfoUpdateView,
      },
      {
        path: 'languagetests',
        name: 'hr-basic-language-test',
        component: LanguageTestInfoView,
      },
      {
        path: 'languagetests/update',
        name: 'hr-basic-language-test-update',
        component: LanguageTestInfoUpdateView,
      },
      {
        path: 'qualifications',
        name: 'hr-basic-qualification',
        component: QualificationInfoView,
      },
      {
        path: 'qualifications/update',
        name: 'hr-basic-qualification-update',
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
    ],
  },
  {
    path: '/hr-basic/salary',
    name: 'hr-basic-salary',
    component: SalaryView,
    children: [
      {
        path: '',
        name: 'hr-basic-salary-default',
        component: SalaryListView,
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
        path: 'severance-pay/:employeeId',
        name: 'hr-basic-severance-pay',
        component: SeverancePayView,
      },
      {
        path: 'period',
        name: 'hr-basic-salary-period',
        component: PeriodicSalaryView,
      },
    ],
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
    ],
  },
  {
    path: '/hr-basic/my-department',
    name: 'hr-basic-my-department',
    props: true,
    redirect: '/hr-basic/my-department/info/careers',
    component: MyDepartmentView,
    children: [
      {
        path: 'info/careers',
        name: 'dept-mem-career',
        props: true,
        component: CareerInfoView,
      },
      {
        path: 'info/disciplinerewards',
        name: 'dept-mem-discipline-reward',
        props: true,
        component: DisciplineRewardInfoView,
      },
      {
        path: 'info/educations',
        name: 'dept-mem-education',
        props: true,
        component: EducationInfoView,
      },
      {
        path: 'info/familymembers',
        name: 'dept-mem-family-member',
        props: true,
        component: FamilyMemberInfoView,
      },
      {
        path: 'info/languagetests',
        name: 'dept-mem-language-test',
        props: true,
        component: LanguageTestInfoView,
      },
      {
        path: 'info/qualifications',
        name: 'dept-mem-qualification',
        props: true,
        component: QualificationInfoView,
      },
    ],
  },
  {
    path: '/hr-management',
    name: 'hr-management',
    redirect: '/hr-management/employee/info/careers',
    component: EmployeeInfoView,
  },
  {
    path: '/hr-management/employee/info',
    name: 'hr-management-employee-info',
    redirect: '/hr-management/employee/info/careers',
    component: EmployeeInfoView,
    children: [
      {
        path: 'careers',
        name: 'career',
        props: true,
        component: CareerInfoView,
      },
      {
        path: 'disciplinerewards',
        name: 'discipline-reward',
        props: true,
        component: DisciplineRewardInfoView,
      },
      {
        path: 'educations',
        name: 'education',
        props: true,
        component: EducationInfoView,
      },
      {
        path: 'familymembers',
        name: 'family-member',
        props: true,
        component: FamilyMemberInfoView,
      },
      {
        path: 'languagetests',
        name: 'language-test',
        props: true,
        component: LanguageTestInfoView,
      },
      {
        path: 'qualifications',
        name: 'qualification',
        props: true,
        component: QualificationInfoView,
      },
    ],
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
    redirect: '/hr-management/department/info',
    component: DepartmentManagementView,
    children: [
      {
        path: '',
        name: 'hr-management-department-default',
        component: DepartmentManagementInformationView,
        redirect: '/hr-management/department/info',
      },
      {
        path: 'info',
        name: 'hr-management-department-info',
        component: DepartmentManagementInformationView,
      },
      {
        path: 'add',
        name: 'hr-management-department-add',
        component: DepartmentManagementAddView,
      },
    ],
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
      },
      {
        path: 'history',
        name: 'history',
        component: AppointmentsHistoryView,
      },
    ],
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
    ],
  },
  {
    path: '/hr-management/salary',
    name: 'hr-management-salary',
    component: SalaryManagementView,
    children: [
      {
        path: '',
        name: 'hr-management-salary-default',
        component: EmployeeSalaryListView,
      },
      {
        path: 'salary-list',
        name: 'hr-management-salary-list',
        component: EmployeeSalaryListView,
      },
      {
        path: 'irregular-allowance',
        name: 'hr-management-salary-irregular-allowance',
        component: IrregularAllowanceView,
      },
      {
        path: 'non-taxable-payrolls',
        name: 'hr-management-salary-non-taxable-payrolls',
        component: NonTaxableView,
      },
    ],
  },
  {
    path: '/evaluation',
    name: 'evaluation',
    redirect: '/evaluation/personal',
  },
  {
    path: '/evaluation/personal',
    name: 'personal-evaluation',
    component: PersonalEvalView,
    children: [
      {
        path: '',
        name: 'evaluation-personal-default',
        component: PersonalEvalFindView,
      },
      {
        path: '1',
        name: 'self-evaluation-management',
        component: PersonalEvalFindView,
      },
      {
        path: '2',
        name: 'submenu2',
        component: PersonalEvalCreateAndFindView,
      },
    ],
  },
  {
    path: '/evaluation/leader',
    name: 'leader-evaluation',
    component: LeaderEvalView,
    children: [
      {
        path: '',
        name: 'leader-evaluation-default',
        component: LeaderEvalListView,
      },
      {
        path: 'eval-list',
        name: 'leader-evaluation-list',
        component: LeaderEvalListView,
      },
      {
        path: 'dept-task/upload',
        name: 'dept-task-upload',
        component: DeptTaskUploadView,
      },
      {
        path: 'dept-task/assign',
        name: 'dept-task-assign',
        component: DeptTaskAssignView,
      },
      {
        path: 'feedback',
        name: 'feedback-management',
        component: FeedbackManageView,
      },
    ],
  },
  {
    path: '/evaluation/task',
    name: 'evaluation-task',
    component: EvalTaskView,
    children: [
      {
        path: '',
        name: 'evaluation-task-default',
        component: PersonalEvalCreateAndFindView,
      },
      {
        path: 'register',
        name: 'TaskEvalCreate-view',
        component: PersonalEvalCreateAndFindView,
      },
    ],
  },
  {
    path: '/evaluation/policy',
    name: 'evaluation-policy',
    component: EvalPolicyView,
    children: [
      {
        path: '',
        name: 'eval-policy-default',
        component: EvalTypeManagementView,
      },
      {
        path: 'eval-type',
        name: 'eval-type-management',
        component: EvalTypeManagementView,
      },
      {
        path: 'eval-policy',
        name: 'eval-policy-management',
        component: EvalPolicyManagementView,
      },
      {
        path: 'eval-grade',
        name: 'eval-grade-management',
        component: EvalGradeView,
      },
    ],
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
