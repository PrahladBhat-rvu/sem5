import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { discord: { bg:"#313338", sidebar:"#2b2d31", darkest:"#1e1f22", hover:"#35373c", accent:"#5865f2", green:"#23a559", red:"#f23f42", text:"#f2f3f5", muted:"#b5bac1" } } } },
  plugins: []
};
export default config;