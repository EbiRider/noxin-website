import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'نوکسین | سامانه تخصصی طب کار',
  description:
    'نوکسین — سازنده سامانه ژینوس، پلتفرم هوشمند مدیریت سلامت شغلی کارکنان. از سال ۱۳۹۶ همراه صنایع ایران.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
