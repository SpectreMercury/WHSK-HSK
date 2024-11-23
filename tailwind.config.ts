import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nord Theme colors
        nord: {
          0: '#2E3440', // Polar Night (深背景)
          1: '#3B4252', // Polar Night (浅一点的背景)
          2: '#434C5E', // Polar Night
          3: '#4C566A', // Polar Night (最浅的背景)
          4: '#D8DEE9', // Snow Storm (浅色文字)
          5: '#E5E9F0', // Snow Storm (更浅的文字)
          6: '#ECEFF4', // Snow Storm (最浅的文字)
          7: '#8FBCBB', // Frost (主题色)
          8: '#88C0D0', // Frost (按钮主色)
          9: '#81A1C1', // Frost
          10: '#5E81AC', // Frost (hover状态)
          11: '#BF616A', // Aurora (红色警告)
          12: '#D08770', // Aurora (橙色)
          13: '#EBCB8B', // Aurora (黄色)
          14: '#A3BE8C', // Aurora (绿色成功)
          15: '#B48EAD', // Aurora (紫色)
        }
      },
      fontSize: {
        'heading': ['2rem', '2.5rem'],
        'subheading': ['1.5rem', '2rem'],
      },
    },
  },
  plugins: [],
} satisfies Config;
