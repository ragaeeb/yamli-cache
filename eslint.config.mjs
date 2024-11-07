import pluginJs from '@eslint/js';
import parser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
    perfectionist.configs['recommended-natural'],
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        ignores: ['dist', 'node_modules'],
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    importX.flatConfigs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
            },
            parser,
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
