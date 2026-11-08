"use client";

import { useRef } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/ui/motion";

const PROJECTS = [
  {
    title: "کاداستر و حدنگار",
    place: "اهواز",
    img: "/tarahAnzan/cadaster.png",
  },
  { title: "تهیه نقشه UTM", place: "اهواز", img: "/tarahAnzan/utm.png" },
  { title: "تفکیک اراضی", place: "اهواز", img: "/tarahAnzan/land divide.png" },
  {
    title: "صدور سند تک برگ",
    place: "اهواز",
    img: "/tarahAnzan/single document.png",
  },
  {
    title: "جانمایی و تعیین حدود",
    place: "اهواز",
    img: "/tarahAnzan/plate placement.png",
  },
  {
    title: "رفع تداخل ثبتی",
    place: "اهواز",
    img: "/tarahAnzan/resolve conflict.png",
  },
  { title: "امور حقوقی", place: "اهواز", img: "/tarahAnzan/legal matters.png" },
];

export default function Projects() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section id="projects" className="bg-[#0d1b2e] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <FadeUp className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e8b923] rounded-full" />
            <h2 className="text-white font-bold text-xl md:text-2xl">
              نمونه پروژه‌ها
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-[#e8b923] hover:text-[#e8b923] transition-colors"
              aria-label="قبلی"
            >
              ‹
            </button>
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-[#e8b923] hover:text-[#e8b923] transition-colors"
              aria-label="بعدی"
            >
              ›
            </button>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none]"
          >
            {PROJECTS.map((p) => (
              <div
                key={p.title}
                className="shrink-0 w-64 rounded-xl overflow-hidden border border-white/10 bg-[#14263f]"
              >
                <div className="relative aspect-[3/2] bg-[#0d1b2e]">
                  <Image
                    src={encodeURI(p.img)}
                    alt={p.title}
                    fill
                    className="object-contain"
                    sizes="256px"
                  />
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-bold">{p.title}</p>
                  <p className="text-[#8ea0b5] text-xs mt-0.5">{p.place}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="text-center mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#14263f] border border-white/10 text-white font-bold text-sm px-6 py-2.5 rounded-md hover:border-[#e8b923] hover:text-[#e8b923] transition-colors"
          >
            مشاهده همه پروژه‌ها
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
