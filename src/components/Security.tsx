'use client'

import { FadeUp, StaggerGrid, StaggerItem } from '@/components/ui/motion'

const items = [
  { icon: '🔒', title: 'رمزنگاری TLS',       desc: 'تمام داده‌ها در انتقال با TLS رمزنگاری می‌شوند' },
  { icon: '👤', title: 'کنترل دسترسی کامل',  desc: 'Role-Based Access Control و قابلیت اتصال به AD/LDAP' },
  { icon: '📋', title: 'لاگ و Audit کامل',   desc: 'ثبت ورود، خروج، مشاهده پرونده و تغییر داده‌های حساس' },
  { icon: '🔗', title: 'یکپارچگی سازمانی',   desc: 'قابل اتصال به HR، ERP و AD از طریق API امن' },
  { icon: '⚖️', title: 'Load Balancing',     desc: 'معماری Stateless با قابلیت توزیع بار و مانیتورینگ' },
  { icon: '🏢', title: 'نصب در DMZ',         desc: 'سازگار با سیاست‌های IT سازمان، قابل نصب در DMZ' },
]

export default function Security() {
  return (
    <section id="security" className="py-14 px-6 md:px-10" style={{ background: '#0a3d6b' }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#5dd9e0' }}>
            امنیت داده‌ها
          </p>
          <h2 className="text-2xl font-bold mb-2 text-white">حفاظت چندلایه از اطلاعات</h2>
          <p className="text-sm mb-9 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            امنیت پرونده‌های پزشکی کارکنان، اولویت اول ماست
          </p>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <div
                className="rounded-xl p-5 border h-full"
                style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="text-2xl mb-2.5">{item.icon}</div>
                <h4 className="text-sm font-bold mb-1.5 text-white">{item.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {item.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
