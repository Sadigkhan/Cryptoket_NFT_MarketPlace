import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

// Convert file URL to directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Apply Next.js core web vitals config
  ...compat.extends("next/core-web-vitals"),
  eslintPluginPrettier,
  // Add your custom ESLint configuration
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        browser: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    rules: {
      "no-console": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "no-nested-ternary": "off",
      "consistent-return": "off",
      "no-alert": "off",
      "react/jsx-no-constructed-context-values": "off",
      "import/extensions": "off",
      "react/prop-types": "off",
      "linebreak-style": "off",
      "react/state-in-constructor": "off",
      "import/prefer-default-export": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "max-len": ["error", 550],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      "no-underscore-dangle": [
        "error",
        {
          allow: ["_d", "_dh", "_h", "_id", "_m", "_n", "_t", "_text"],
        },
      ],
      "object-curly-newline": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-one-expression-per-line": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "react/no-array-index-key": "off",
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["to", "hrefLeft", "hrefRight"],
          aspects: ["noHref", "invalidHref", "preferButton"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

export default eslintConfig;
