import Image from "next/image";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/motion";

const MEMBERS = [
  {
    name: "محسن تیموری رکعتی",
    role: "مدیرعامل و کارشناس ارشد عمران-سازه",
    photo: "/tarahAnzan/ceo.jpeg",
  },
  { name: "محمود تیموری رکعتی", role: "کارشناس کامپیوتر" },
  { name: "مسعود محمدی", role: "کارشناس حقوق" },
  { name: "محمد لجم اورک", role: "کارشناس نقشه‌برداری" },
  { name: "اسماعیل حیدری", role: "کارشناس حقوق و وکیل پایه یک دادگستری" },
];

export default function Team() {
  return (
    <section id="team" className="bg-[#0f2138] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <FadeUp className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-6 bg-[#e8b923] rounded-full" />
          <h2 className="text-white font-bold text-xl md:text-2xl">
            اعضای شرکت
          </h2>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {MEMBERS.map((m) => (
            <StaggerItem
              key={m.name}
              className="bg-[#14263f] border border-white/10 rounded-xl p-5 flex flex-col items-center text-center gap-3"
            >
              {m.photo ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#e8b923]">
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-white/15 flex items-center justify-center text-[#e8b923]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-9 h-9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
                  </svg>
                </div>
              )}
              <div>
                <p className="text-white font-bold text-sm">{m.name}</p>
                <p className="text-[#8ea0b5] text-xs mt-1 leading-5">
                  {m.role}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
