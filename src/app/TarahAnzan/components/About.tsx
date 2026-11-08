import { FadeUp } from '@/components/ui/motion'

const PARAGRAPHS = [
  'ما با تکیه بر تخصص، تعهد و سال‌ها تجربه در حوزه‌های فنی، مهندسی و حقوقی، همواره در تلاش هستیم خدماتی دقیق، مطمئن و باکیفیت به همه متقاضیان حقیقی و حقوقی ارائه دهیم. بهره‌گیری از دانش روز، تجربه عملی و شناخت کامل ضوابط و مقررات، ما را در اجرای صحیح و اصولی همه خدمات یاری می‌کند.',
  'اعتماد و اطمینان متقاضیان، ارزشمندترین سرمایه ماست. از این‌رو، صداقت، مسئولیت‌پذیری، شفافیت در فرآیند انجام امور و حفظ منافع مردم، سازمان‌ها و ادارات، همواره سرلوحه فعالیت‌های ما خواهد بود.',
  'ما متعهد هستیم تمامی خدمات را با بالاترین کیفیت، در کوتاه‌ترین زمان ممکن و مطابق با ضوابط و مقررات اداره کل ثبت اسناد و املاک کشور و قوانین جاری جمهوری اسلامی ایران به انجام برسانیم. هدف ما ارائه راهکارهای تخصصی، تسهیل فرآیندها و کسب رضایت حداکثری مراجعه‌کنندگان از طریق ارائه خدماتی حرفه‌ای، دقیق و قابل اعتماد است.',
]

export default function About() {
  return (
    <section id="about" className="bg-[#0d1b2e] py-14 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <FadeUp className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-6 bg-[#e8b923] rounded-full" />
          <h2 className="text-white font-bold text-xl md:text-2xl">درباره ما</h2>
        </FadeUp>

        <FadeUp className="space-y-5" delay={0.1}>
          {PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-[#c7d2e0] text-sm md:text-base leading-8">
              {p}
            </p>
          ))}
        </FadeUp>
      </div>
    </section>
  )
}
