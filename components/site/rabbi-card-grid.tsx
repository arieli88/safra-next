"use client";
/* eslint-disable @next/next/no-img-element */

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type LecturerCardItem = {
  id: string;
  name: string;
  phone: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type RabbiCardProps = {
  lecturer: LecturerCardItem;
};

type RabbiCardGridProps = {
  items?: LecturerCardItem[];
  settings?: {
    imageBlurPx?: number;
    tiltStrength?: number;
    mobileColumns?: "1" | "2";
  };
};

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function RabbiCard({ lecturer, tiltStrength = 2, imageBlurPx = 8 }: Readonly<RabbiCardProps & { tiltStrength?: number; imageBlurPx?: number }>) {
  const reduceMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const rotateX = useTransform(pointerY, [0, 100], [tiltStrength, -tiltStrength]);
  const rotateY = useTransform(pointerX, [0, 100], [-tiltStrength, tiltStrength]);
  const imageRotateX = useTransform(pointerY, [0, 100], [tiltStrength * 0.75, -tiltStrength * 0.75]);
  const imageRotateY = useTransform(pointerX, [0, 100], [-tiltStrength * 0.75, tiltStrength * 0.75]);
  const softRotateX = useSpring(rotateX, { stiffness: 120, damping: 20, mass: 0.55 });
  const softRotateY = useSpring(rotateY, { stiffness: 120, damping: 20, mass: 0.55 });
  const softImageRotateX = useSpring(imageRotateX, { stiffness: 110, damping: 20, mass: 0.6 });
  const softImageRotateY = useSpring(imageRotateY, { stiffness: 110, damping: 20, mass: 0.6 });
  const glowX = useSpring(pointerX, { stiffness: 160, damping: 22, mass: 0.45 });
  const glowY = useSpring(pointerY, { stiffness: 160, damping: 22, mass: 0.45 });
  const spotlight = useMotionTemplate`radial-gradient(16rem circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.38), rgba(210,183,121,0.18) 28%, transparent 62%)`;
  const borderGlow = useMotionTemplate`radial-gradient(18rem circle at ${glowX}% ${glowY}%, rgba(209,179,99,0.88), rgba(92,108,150,0.3) 34%, rgba(92,74,140,0.14) 52%, transparent 72%)`;

  return (
    <motion.article
      dir="rtl"
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="mx-auto h-full w-full max-w-[24rem] self-stretch justify-self-stretch [perspective:1200px]"
      tabIndex={0}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
      }}
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => {
        setIsActive(false);
        pointerX.set(50);
        pointerY.set(50);
      }}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      <motion.div
        style={reduceMotion ? undefined : { rotateX: softRotateX, rotateY: softRotateY, transformStyle: "preserve-3d" }}
        className="relative h-full rounded-[1.35rem]"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.35rem] opacity-80 blur-xl"
          style={{ backgroundImage: borderGlow }}
        />

        <div className="relative rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(22,29,45,0.96),rgba(14,20,32,0.98))] p-[1px] shadow-[0_28px_70px_rgba(7,11,20,0.24)]">
          <div className="relative h-full overflow-hidden rounded-[calc(1.35rem-1px)] bg-[linear-gradient(180deg,rgba(248,246,241,0.96),rgba(242,238,231,0.93))]">
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-95"
              style={{ backgroundImage: spotlight }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,rgba(255,255,255,0.18),transparent)]" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="relative h-56 overflow-hidden rounded-t-[calc(1.35rem-1px)]">
                <img
                  src={lecturer.imageSrc}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-125 object-cover"
                  style={{ filter: `blur(${imageBlurPx}px)` }}
                />
                <motion.div
                  className="relative z-10 h-full w-full [transform-style:preserve-3d]"
                  style={reduceMotion ? undefined : { rotateX: softImageRotateX, rotateY: softImageRotateY }}
                  animate={reduceMotion ? undefined : isActive ? { y: -8, scale: 1.06 } : { y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <img
                    src={lecturer.imageSrc}
                    alt={lecturer.imageAlt}
                    className="h-full w-full object-contain"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,26,0.02),rgba(12,16,26,0.24))]" />
              </div>

              <div className="grid flex-1 grid-rows-[minmax(4.8rem,auto)_auto_1fr] px-5 pb-5 pt-4 sm:grid-rows-[minmax(5.2rem,auto)_auto_1fr]">
                <h3 className="flex items-start font-serif text-[1.55rem] font-bold leading-tight text-[#162133]">{lecturer.name}</h3>
                <Link
                  href={`tel:${normalizePhone(lecturer.phone)}`}
                  className="mt-3 inline-flex w-fit items-center gap-2 self-start text-[0.96rem] font-semibold text-[#2e4f7f] underline decoration-[#c5a257]/50 underline-offset-4 transition hover:text-[#755419]"
                >
                  <PhoneCall className="h-4 w-4" />
                  {lecturer.phone}
                </Link>
                <p className="mt-4 min-h-[8.4rem] whitespace-pre-line text-[0.98rem] leading-7 text-[#5b6170] sm:min-h-[9.2rem]">
                  {lecturer.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function RabbiCardGrid({ items = sampleLecturers, settings }: Readonly<RabbiCardGridProps>) {
  const lecturers = useMemo(() => items.slice(0, 2), [items]);
  const mobileColumns = settings?.mobileColumns ?? "2";
  const imageBlurPx = settings?.imageBlurPx ?? 8;
  const tiltStrength = settings?.tiltStrength ?? 2;

  return (
    <section dir="rtl" className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className={`mx-auto grid max-w-5xl auto-rows-fr items-stretch justify-items-stretch gap-4 sm:gap-6 ${mobileColumns === "1" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"}`}>
        {lecturers.map((lecturer) => (
          <RabbiCard key={lecturer.id} lecturer={lecturer} tiltStrength={tiltStrength} imageBlurPx={imageBlurPx} />
        ))}
      </div>
    </section>
  );
}

export const sampleLecturers: LecturerCardItem[] = [
  {
    id: "rabbi-1",
    name: "הרב אריאל בן דוד",
    phone: "050-123-4567",
    description: "לימוד פתוח שמחבר בין עומק, רגישות ושיחה בגובה העיניים. מלווה קבוצות לימוד ומפגשים אישיים סביב שבת, פרשה וחיים.",
    imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "הרב אריאל בן דוד",
  },
  {
    id: "rabbi-2",
    name: "הרבנית נועה מזרחי",
    phone: "052-987-6543",
    description: "מפגישה בין בית מדרש, קהילה ותהליך אישי. עוסקת בליווי משתתפים חדשים ובבניית מרחב לימוד רגוע, מזמין ומעמיק.",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "הרבנית נועה מזרחי",
  },
];

export default function RabbiCardGridDemo() {
  return <RabbiCardGrid items={sampleLecturers} />;
}
