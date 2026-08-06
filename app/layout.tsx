import './globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Campus Marketplace',
  description: 'ตลาดนัดออนไลน์สำหรับนักศึกษา',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}