import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import prettierConfig from '@vue/eslint-config-prettier';

export default [
  // 파일 지정 및 무시 규칙
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'], // JavaScript와 Vue 파일만 검사
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'], // dist 및 coverage 폴더 무시
  },

  // ESLint 기본 추천 규칙
  js.configs.recommended,

  // Vue 플러그인 규칙 (필요에 따라 essential, strongly-recommended, recommended 선택 가능)
  ...pluginVue.configs['flat/recommended'],

  // Prettier와 충돌하는 규칙 비활성화
  prettierConfig,
];
