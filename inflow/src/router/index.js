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
import ContractManagementView from '@/views/hr-management/ContractManagementView.vue';
import VacationManagementView from '@/views/hr-management/VacationManagementView.vue';
import EmployeeSearchView from '@/views/emp-search/EmployeeSearchView.vue';
import StatisticsView from '@/views/statistics/StatisticsView.vue';
import LoginView from '@/views/login/LoginView.vue';

const routes = [
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
    component: MyInfoView,
  },
  {
    path: '/hr-basic/my-info',
    name: 'hr-basic-my-info',
    component: MyInfoView,
  },
  {
    path: '/hr-basic/attendance',
    name: 'hr-basic-attendance',
    component: AttendanceView,
    children: [
      {
        path: '',
        name: 'hr-basic-attendance-default',
        component: null,
      },
      {
        path: 'commute',
        name: 'hr-basic-attendance-commute',
        component: null,
      },
      {
        path: 'remote',
        name: 'hr-basic-attendance-remote',
        component: null,
      },
      {
        path: 'overtime',
        name: 'hr-basic-attendance-overtime',
        component: null,
      },
      {
        path: 'leave',
        name: 'hr-basic-attendance-leave',
        component: null,
      },
      {
        path: 'return',
        name: 'hr-basic-attendance-return',
        component: null,
      },
      {
        path: 'business-trip',
        name: 'hr-basic-attendance-business-trip',
        component: null,
      },
      {
        path: 'dispatch',
        name: 'hr-basic-attendance-dispatch',
        component: null,
      },
    ]
  },
  {
    path: '/hr-basic/salary',
    name: 'hr-basic-salary',
    component: SalaryView,
  },
  {
    path: '/hr-basic/contract',
    name: 'hr-basic-contract',
    component: ContractView,
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
    component: EmployeeUploadView,
  },
  {
    path: '/hr-management/department',
    name: 'hr-management-department',
    component: DepartmentManagementView,
  },
  {
    path: '/hr-management/appointment',
    name: 'hr-management-appointment',
    component: AppointmentManagementView,
  },
  {
    path: '/hr-management/evaluation',
    name: 'hr-management-evaluation',
    component: EvalManagementView,
  },
  {
    path: '/hr-management/contract',
    name: 'hr-management-contract',
    component: ContractManagementView,
  },
  {
    path: '/hr-management/vacation',
    name: 'hr-management-vacation',
    component: VacationManagementView,
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
