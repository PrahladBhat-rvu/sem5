import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
export const metadata = { title: "Discord Clone", description: "Full-stack community chat" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>{children}</ThemeProvider></body></html>;
}