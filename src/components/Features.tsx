const features = [
  {
    title: 'مدیریت کاربران و دسترسی‌ها',
    desc: 'تعریف سطح دسترسی نامحدود، نقش‌های متفاوت و مهر و امضای دیجیتال',
  },
  {
    title: 'داشبورد مدیریتی پویا',
    desc: 'پایش لحظه‌ای وضعیت پرونده‌ها و داشبورد متناسب با نقش هر کاربر',
  },
  {
    title: 'پذیرش سریع و ثبت گروهی',
    desc: 'ثبت گروهی از طریق اکسل، احراز هویت دقیق و پیشگیری از ویرایش غیرمجاز',
  },
  {
    title: 'هوشمندسازی و الگوسازی شغلی',
    desc: 'بانک جامع عوامل زیان‌آور شغلی و تکمیل سریع فرم‌ها بر اساس داده‌های قبلی',
  },
  {
    title: 'ثبت نتایج آزمایشگاهی',
    desc: 'ثبت فردی و گروهی آزمایش‌ها از طریق اکسل و ثبت واکسیناسیون افراد',
  },
  {
    title: 'سوابق سلامت و روند تغییرات',
    desc: 'نمایش روند تغییرات پارامترهای سلامت در پرونده‌های متوالی',
  },
  {
    title: 'تحلیل گرافیکی شاخص‌های بالینی',
    desc: 'نمودار BMI، فشار خون، دیابت و آزمایش‌ها با تفسیر رنگی و تحلیلی',
  },
  {
    title: 'ارزیابی بینایی و دید رنگی',
    desc: 'ثبت دقیق تست‌های بینایی، میدان دید و Field Test با استاندارد X/10',
  },
  {
    title: 'اودیومتری و تحلیل شنوایی',
    desc: 'نمایش خودکار اودیوگرام، ثبت Masked و NR برای هر گوش به‌صورت مجزا',
  },
  {
    title: 'اسپیرومتری و ارزیابی ریوی',
    desc: 'پیوست مستقیم فایل‌ها و ثبت دسته‌ای داده‌های اسپیرومتری',
  },
  {
    title: 'سلامت روان و آزمون‌های روانشناختی',
    desc: 'آزمون‌های OSIPOW، Neo، MMPI و تحلیل سلامت روان',
  },
  {
    title: 'نظردهی هوشمند پزشک',
    desc: 'نمایش خودکار موارد غیرنرمال و ابزارهای هوشمند تحلیل داده برای پزشک',
  },
  {
    title: 'خروجی PDF استاندارد',
    desc: 'تطابق کامل با فرمت ۵ صفحه‌ای مرکز سلامت محیط و کار وزارت بهداشت',
  },
  {
    title: 'ارزیابی ریسک سلامت',
    desc: 'محاسبه خطر سکته قلبی در بازه ۱۰ سال آینده و ریسک متابولیک فردی',
  },
  {
    title: 'گزارشات مدیریتی',
    desc: 'گزارشات گروهی، فردی و تحلیلی با داشبورد مدیریتی جامع',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-14 px-6 md:px-10 max-w-5xl mx-auto">
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#0d9aa8' }}>
        امکانات سامانه
      </p>
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#0a3d6b' }}>
        همه آنچه یک کلینیک طب کار نیاز دارد
      </h2>
      <p className="text-sm mb-9 leading-relaxed" style={{ color: '#6b7f96' }}>
        از پذیرش تا گزارش‌دهی — در یک پلتفرم یکپارچه و هوشمند
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-xl px-5 py-5 flex gap-4 items-start border transition-all duration-200"
            style={{ borderColor: '#e0eaf4' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = '#1565a8'
              el.style.boxShadow = '0 4px 16px rgba(21,101,168,0.08)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = '#e0eaf4'
              el.style.boxShadow = 'none'
            }}
          >
            <span
              className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: '#1565a8' }}
            />
            <div>
              <h4 className="text-sm font-bold mb-1" style={{ color: '#1a2332' }}>
                {f.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: '#7a8fa6' }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
