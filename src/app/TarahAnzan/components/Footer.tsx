import { FadeUp } from '@/components/ui/motion'

const SOCIALS = [
  {
    name: 'اینستاگرام',
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z',
  },
  {
    name: 'لینکدین',
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z',
  },
  {
    name: 'تلگرام',
    path: 'M21.5 4.5 2.7 11.9c-.9.36-.9 1.66.02 1.98l4.6 1.6 1.8 5.8c.28.9 1.4 1.1 2 .35l2.4-2.9 4.7 3.5c.8.6 1.95.15 2.15-.83l3.3-15.7c.22-1.06-.85-1.9-1.85-1.5zM8.6 15l-1.1-.38-.3-1 9.9-8.9-8.5 10.28z',
  },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0a1420] border-t border-white/10">
      <FadeUp className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#e8b923] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#e8b923]" fill="currentColor">
                <path d="M12 2 3 6v2h18V6l-9-4zM5 10v9H3v2h18v-2h-2v-9h-2v9h-3v-9h-2v9H9v-9H7v9H5v-9z" />
              </svg>
            </div>
            <p className="text-white font-bold text-xl">پارس طراح انزان</p>
          </div>
          <p className="text-[#8ea0b5] text-sm leading-6">
            کارگزاری فنی، مهندسی و حقوقی، ثبت اسناد و املاک کشور. شرکت پارس طراح انزان با بهره‌گیری از
            دانش روز، تجربه متخصصان و تجهیزات پیشرفته، ارائه‌دهنده خدمات تخصصی در حوزه ثبتی، نقشه‌برداری،
            کاداستر و امور حقوقی و مهندسی می‌باشد.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href="#"
                title={s.name}
                aria-label={s.name}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#8ea0b5] hover:border-[#e8b923] hover:text-[#e8b923] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white font-bold mb-3">آدرس</p>
          <ul className="space-y-2 text-[#8ea0b5] text-sm mb-5">
            <li>استان خوزستان - بخش مرکزی شهر اهواز</li>
          </ul>
          <p className="text-white font-bold mb-3">تلفن</p>
          <ul className="space-y-2 text-[#8ea0b5] text-sm">
            <li dir="ltr" className="text-right">
              09372845511
            </li>
            <li dir="ltr" className="text-right">
              09166045386
            </li>
          </ul>
        </div>

        <div>
          <p className="text-white font-bold mb-3">مجوزها و افتخارات</p>
          <div className="flex gap-3">
            {['عضو کانون کارشناسان', 'مجوز کارگزاری فنی و مهندسی', 'ISO 9001:2015'].map((b) => (
              <div
                key={b}
                className="flex-1 border border-white/10 rounded-lg px-2 py-3 text-center text-[10px] text-[#8ea0b5]"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      <div className="border-t border-white/10 py-4 text-center text-[#5f7288] text-xs">
        تمامی حقوق این وب‌سایت متعلق به شرکت پارس طراح انزان می‌باشد.
      </div>
    </footer>
  )
}
