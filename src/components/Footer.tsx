import Image from 'next/image'

export default function Footer() {
  return (
    <footer
      className="px-6 md:px-10 py-7 flex justify-between items-center flex-wrap gap-3"
      style={{ background: '#061827' }}
    >
      <div className="flex items-center gap-2.5">
        <Image src="/logoIcon.svg" alt="نوکسین" width={28} height={28} />
        <span className="text-lg font-black" style={{ color: '#5dd9e0' }}>
          نوکسین
        </span>
      </div>

      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        سامانه تخصصی طب کار · info@noxin.ir
      </p>

      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
        © ۱۴۰۴ تمامی حقوق محفوظ است
      </p>
    </footer>
  )
}
