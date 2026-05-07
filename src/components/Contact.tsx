'use client'

import { FormEvent, useState } from 'react'
import { FadeUp } from '@/components/ui/motion'

const contactItems = [
  { icon: '📍', text: 'اهواز – شهرک صنعتی شماره ۴، طبقه سوم، واحد ۴۰۱' },
  { icon: '📞', text: '09388656276  |  06132907644', ltr: true },
  { icon: '✉️', text: 'info@noxin.ir', ltr: true },
  { icon: '📱', text: '@noxinir', ltr: true },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-14 px-6 md:px-10 max-w-5xl mx-auto">
      <FadeUp>
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#0d9aa8' }}>
          ارتباط با ما
        </p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#0a3d6b' }}>همین امروز با ما تماس بگیرید</h2>
        <p className="text-sm mb-9 leading-relaxed" style={{ color: '#6b7f96' }}>
          برای دمو رایگان یا دریافت اطلاعات بیشتر، با تیم ما در تماس باشید
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <FadeUp delay={0.1}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#0a3d6b' }}>اطلاعات تماس</h3>
          <p className="text-sm leading-loose mb-6" style={{ color: '#4a6070' }}>
            اگر سوال یا نیاز به مشاوره دارید، تیم ما آماده پاسخگویی است.
          </p>
          <div className="flex flex-col gap-3">
            {contactItems.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                style={{ background: '#f0f6ff' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: '#1565a8' }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: '#2d4560', direction: item.ltr ? 'ltr' : 'rtl', textAlign: 'right' }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="bg-white rounded-2xl p-7 border" style={{ borderColor: '#e0eaf4' }}>
            <h4 className="text-base font-bold mb-5" style={{ color: '#0a3d6b' }}>درخواست دمو رایگان</h4>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-base" style={{ color: '#0a3d6b' }}>درخواست شما ثبت شد!</p>
                <p className="text-sm mt-1" style={{ color: '#6b7f96' }}>به‌زودی با شما تماس می‌گیریم.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {[
                  { label: 'نام و نام خانوادگی', name: 'name',  placeholder: 'نام شما' },
                  { label: 'شماره تماس',         name: 'phone', placeholder: '09xxxxxxxxx' },
                  { label: 'نام سازمان',          name: 'org',   placeholder: 'شرکت / کلینیک' },
                ].map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-xs mb-1.5" style={{ color: '#7a8fa6' }}>
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder={field.placeholder}
                      required
                      className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none border transition-colors"
                      style={{ border: '1px solid #d8e6f4', background: '#f8fbff', color: '#1a2332', fontFamily: 'var(--font-vazirmatn)' }}
                      onFocus={(e) => (e.target.style.borderColor = '#1565a8')}
                      onBlur={(e)  => (e.target.style.borderColor = '#d8e6f4')}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="block text-xs mb-1.5" style={{ color: '#7a8fa6' }}>توضیحات</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="سوال یا نیاز خود را بنویسید..."
                    rows={3}
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none border transition-colors resize-none"
                    style={{ border: '1px solid #d8e6f4', background: '#f8fbff', color: '#1a2332', fontFamily: 'var(--font-vazirmatn)' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1565a8')}
                    onBlur={(e)  => (e.target.style.borderColor = '#d8e6f4')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white text-sm font-bold py-3 rounded-xl transition-colors mt-1"
                  style={{ background: '#1565a8', fontFamily: 'var(--font-vazirmatn)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0f4f8a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#1565a8')}
                >
                  ارسال درخواست دمو ↗
                </button>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
