"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";

import {
  getGalleryImages,
  getHistorySteps,
  type HistoryStep,
} from "@/components/site/home-content";
import type { SiteContent } from "@/lib/types";

type LightboxImage = { src: string; alt: string };

function SectionEyebrow({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.34em] text-[#9f8065] sm:text-[0.66rem]">
      {children}
    </p>
  );
}

function LightboxImageButton({
  image,
  onOpen,
  className,
  sizes,
  priority = false,
  children,
}: Readonly<{
  image: LightboxImage;
  onOpen: (image: LightboxImage) => void;
  className?: string;
  sizes: string;
  priority?: boolean;
  children?: React.ReactNode;
}>) {
  return (
    <button
      type="button"
      className={`relative block w-full cursor-zoom-in overflow-hidden ${className ?? ""}`}
      onClick={() => onOpen(image)}
      aria-label={`פתיחת התמונה ${image.alt || "בתצוגה מוגדלת"}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-700 hover:scale-[1.03]"
      />
      {children}
    </button>
  );
}

function ImageLightbox({
  image,
  onClose,
}: Readonly<{ image: LightboxImage | null; onClose: () => void }>) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!image) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  if (!image) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.85)] px-4 py-4"
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || "תמונה מוגדלת"}
    >
      <motion.div
        className="relative inline-flex items-center justify-center"
        initial={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={1600}
          height={1200}
          sizes="90vw"
          className="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-lg object-contain"
        />
      </motion.div>
    </motion.div>
  );
}

function RevealSection({
  children,
  className = "",
  amount = 0.25,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  amount?: number;
}>) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 36 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AboutSection({ content }: Readonly<{ content: SiteContent }>) {
  const lines = useMemo(
    () =>
      [
        content.about.cardEyebrow,
        content.about.cardTitle,
        content.about.cardBody.split(".")[0]?.trim() || content.about.cardBody,
      ].filter(Boolean),
    [content],
  );

  return (
    <section id="about" className="site-section py-12 sm:py-16">
      <div className="site-shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <RevealSection className="max-w-2xl">
          <SectionEyebrow>אודות</SectionEyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-[1.2] text-[#2e221a] sm:text-5xl">
            {content.about.title}
          </h2>
          <p className="mt-8 whitespace-pre-line text-lg leading-9 text-[#6a5747] sm:text-xl">
            {content.about.body}
          </p>
        </RevealSection>
        <div className="space-y-8">
          {lines.map((line, index) => (
            <RevealSection
              key={`${line}-${index}`}
              amount={0.45}
              className="border-t border-[#e4d6c8] pt-6"
            >
              <p className="font-serif text-2xl leading-9 text-[#4a3527] sm:text-[2rem]">
                {line}
              </p>
            </RevealSection>
          ))}
          <RevealSection amount={0.45} className="border-t border-[#e4d6c8] pt-6">
            <p className="text-sm tracking-[0.34em] text-[#977963]">
              {content.about.addressLabel}
            </p>
            <p className="mt-3 text-lg text-[#5b4738]">
              {content.about.addressText || content.meta.address}
            </p>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

function CommunityFlyerSection({
  content,
  onOpenImage,
}: Readonly<{
  content: SiteContent;
  onOpenImage: (image: LightboxImage) => void;
}>) {
  const track =
    content.community.tracks.find((item) => !item.hidden) ??
    content.community.tracks[0];
  const flyerImage = track?.flyerImage;

  if (!track || !flyerImage?.src) {
    return null;
  }

  return (
    <section id="community" className="site-section py-12 sm:py-16">
      <div className="site-shell">
        <p className="sticky mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-[#9f8065]">
          קהילה
        </p>
        <RevealSection className="grid items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex h-full min-h-[31rem] overflow-hidden rounded-[2.4rem] bg-white/80 p-4 shadow-[0_25px_60px_rgba(157,120,92,0.14)] sm:min-h-[34rem] sm:p-5"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_36%),linear-gradient(180deg,rgba(255,250,244,0.76),rgba(238,223,205,0.34))]" />
            <LightboxImageButton
              image={{ src: flyerImage.src, alt: flyerImage.alt }}
              onOpen={onOpenImage}
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="h-full min-h-[26rem] rounded-[1.9rem]"
            />
          </motion.div>

          <div className="relative flex h-full min-h-[31rem] items-center overflow-hidden rounded-[2.6rem] bg-[linear-gradient(135deg,rgba(255,251,246,0.92),rgba(247,238,227,0.86))] px-6 py-8 text-center shadow-[0_25px_70px_rgba(161,126,95,0.12)] sm:min-h-[34rem] sm:px-8 sm:py-10">
            <motion.div
              aria-hidden="true"
              className="absolute left-[-8%] top-[-14%] h-44 w-44 rounded-full bg-[#f6ddbe] blur-3xl"
              animate={{ scale: [1, 1.08, 1], opacity: [0.34, 0.52, 0.34] }}
              transition={{
                duration: 14,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute bottom-[-12%] right-[-6%] h-40 w-40 rounded-full bg-[#fff5e6] blur-3xl"
              animate={{ scale: [1, 1.06, 1], opacity: [0.26, 0.42, 0.26] }}
              transition={{
                duration: 16,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <div className="relative z-10 flex h-full min-w-0 flex-col items-center justify-center">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-[#9f8065]">
                קבוצת עדכונים
              </p>
              <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.15] text-[#2f2219] sm:text-5xl">
                {content.community.title}
              </h2>
              <p className="mt-6 max-w-2xl break-words text-lg leading-9 text-[#655243] sm:text-xl">
                {track.description}
              </p>
              <div className="mt-8 min-w-0 space-y-3 text-[#7b634f]">
                <p className="break-words text-sm tracking-[0.32em] text-[#a28267]">
                  {track.subtitle}
                </p>
                <p className="break-words font-serif text-2xl text-[#453225] sm:text-[2rem]">
                  {track.title}
                </p>
                <p className="break-words text-base sm:text-lg">
                  {track.schedule}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-center gap-4 pt-10">
                <Link
                  href={track.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#d9b28a] px-5 py-3 text-[0.94rem] font-bold text-[#3d2a1d] shadow-[0_18px_44px_rgba(178,138,102,0.18)] transition hover:-translate-y-0.5 hover:bg-[#e4c09b] sm:px-6 sm:text-base"
                >
                  <FaWhatsapp className="h-4 w-4 sm:h-[1.05rem] sm:w-[1.05rem]" />
                  {track.whatsappLabel}
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>
                <p className="text-sm leading-7 text-[#7a6654] sm:max-w-sm sm:text-base">
                  {content.community.footnote}
                </p>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function HistorySection({
  steps,
  content,
  onOpenImage,
}: Readonly<{
  steps: HistoryStep[];
  content: SiteContent;
  onOpenImage: (image: LightboxImage) => void;
}>) {
  return (
    <section id="history" className="site-section py-12 sm:py-16">
      <div className="site-shell">
        <RevealSection className="max-w-3xl">
          <SectionEyebrow>היסטוריה</SectionEyebrow>
          <h2 className="mt-5 font-serif text-4xl text-[#2e221a] sm:text-5xl">
            {content.history.title}
          </h2>
          <p className="mt-6 text-lg leading-9 text-[#6a5747]">
            {content.history.body}
          </p>
        </RevealSection>
        <RevealSection amount={0.15} className="mt-12">
          <div className="mx-auto grid max-w-[21rem] grid-cols-3 items-stretch justify-items-center gap-2 px-0.5 sm:max-w-[64rem] sm:grid-cols-3 sm:gap-10 sm:px-2">
            {steps.map((step, index) => (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.85,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex h-full w-full max-w-[6rem] flex-col items-center sm:max-w-[15.75rem]"
              >
                <div className="flex h-full min-h-[8.4rem] w-full flex-col rounded-[1rem] border border-[#eadfd4] bg-[linear-gradient(180deg,rgba(255,251,246,0.96),rgba(246,237,228,0.88))] p-1.5 shadow-[0_12px_28px_rgba(161,126,95,0.08)] sm:rounded-[1.95rem] sm:p-4">
                  <LightboxImageButton
                    image={{ src: step.image.src, alt: step.image.alt }}
                    onOpen={onOpenImage}
                    sizes="(max-width: 640px) 30vw, 280px"
                    className={`mx-auto w-full rounded-[0.8rem] sm:rounded-[1.5rem] ${step.href && step.hrefLabel ? "h-[4.8rem] sm:h-[11rem]" : "h-[6.4rem] sm:h-[13.6rem]"}`}
                  />
                  {step.href && step.hrefLabel ? (
                    <Link
                      href={step.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 block break-words text-center text-[0.62rem] font-semibold leading-4 text-[#6e4f38] underline decoration-[#c99a68]/60 underline-offset-4 transition hover:text-[#3e2b1d] sm:mt-3 sm:text-[1.02rem] sm:leading-6"
                    >
                      {step.hrefLabel}
                    </Link>
                  ) : null}
                </div>
                <span
                  aria-hidden="true"
                  className="mt-2 h-2.5 w-2.5 rounded-full border border-[#d3b08a] bg-[#b57841] shadow-[0_0_0_4px_rgba(251,246,239,1)] sm:mt-3 sm:h-3 sm:w-3"
                />
              </motion.article>
            ))}
          </div>
          <div className="relative mt-[-0.4rem] block sm:mt-[-0.45rem]">
            <div className="mx-auto h-[2px] w-full max-w-[18rem] rounded-full bg-[linear-gradient(90deg,rgba(206,177,148,0.14),rgba(181,120,65,0.95),rgba(206,177,148,0.14))] sm:max-w-[56rem]" />
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function GallerySection({
  content,
  onOpenImage,
}: Readonly<{
  content: SiteContent;
  onOpenImage: (image: LightboxImage) => void;
}>) {
  const images = useMemo(() => getGalleryImages(content), [content]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: "rtl",
    loop: images.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || images.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => emblaApi.scrollNext(), 4500);
    return () => window.clearInterval(interval);
  }, [emblaApi, images.length]);

  return (
    <section id="gallery" className="site-section py-12 sm:py-16">
      <div className="site-shell">
        <RevealSection className="max-w-3xl">
          <SectionEyebrow>גלריה</SectionEyebrow>
          <h2 className="mt-5 font-serif text-4xl text-[#2e221a] sm:text-5xl">
            {content.gallery.title}
          </h2>
          <p className="mt-6 text-lg leading-9 text-[#6a5747]">
            {content.gallery.description}
          </p>
        </RevealSection>
        <RevealSection amount={0.15} className="mt-14">
          <div className="overflow-hidden rounded-[2.2rem] px-1 sm:px-0">
            <div className="overflow-hidden px-[8%] sm:px-[6%]" ref={emblaRef}>
              <div className="-mr-4 flex">
                {images.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className="min-w-0 flex-[0_0_78%] pr-4 sm:flex-[0_0_58%] lg:flex-[0_0_38%]"
                  >
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="group relative overflow-hidden rounded-[2rem] shadow-[0_18px_44px_rgba(153,122,92,0.12)]"
                    >
                      <LightboxImageButton
                        image={{ src: image.src, alt: image.alt }}
                        onOpen={onOpenImage}
                        sizes="(max-width: 640px) 74vw, 34vw"
                        className="aspect-[5/4]"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.04),rgba(51,35,25,0.38))]" />
                        <div className="absolute inset-x-5 bottom-5 z-10 rounded-full bg-white/76 px-4 py-2 text-sm text-[#513c2e] backdrop-blur transition duration-500 group-hover:bg-white/90">
                          {image.alt}
                        </div>
                      </LightboxImageButton>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            {images.length > 1 ? (
              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {images.map((image, index) => (
                    <button
                      key={`${image.src}-dot`}
                      type="button"
                      aria-label={`מעבר לתמונה ${index + 1}`}
                      className={`h-2.5 rounded-full transition ${selectedIndex === index ? "w-8 bg-[#7a5334]" : "w-2.5 bg-[#d4b69a]"}`}
                      onClick={() => emblaApi?.scrollTo(index)}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e0d0c2] bg-white/90 text-[#6a4d39] transition hover:border-[#bea184]"
                    aria-label="הקודם"
                    onClick={() => emblaApi?.scrollPrev()}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e0d0c2] bg-white/90 text-[#6a4d39] transition hover:border-[#bea184]"
                    aria-label="הבא"
                    onClick={() => emblaApi?.scrollNext()}
                  >
                    ›
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function ClosingSection({ content }: Readonly<{ content: SiteContent }>) {
  return (
    <section className="site-section pb-8 pt-8 text-center">
      <div className="site-shell-narrow">
        <RevealSection>
          <SectionEyebrow>לבוא כמו שאתם</SectionEyebrow>
          <p className="mt-6 font-serif text-[2.2rem] leading-[1.55] text-[#302319] sm:text-[3rem]">
            &quot;עשו כתות כתות ועסקו בתורה לפי שאין התורה נקנית אלא בחבורה&quot;
            <br />
            <span className="text-[0.8em] text-[#7d624f]">
              ~מסכת ברכות סג ע&quot;ב~
            </span>
          </p>
          <p className="mt-5 text-[1rem] leading-8 text-[#6d5a49]">
            מוזמנים לקחת חלק בחבורה שלנו!
          </p>
          <p className="mt-8 text-[0.8rem] tracking-[0.3em] text-[#9c8068]">
            {content.meta.address}
          </p>
        </RevealSection>
      </div>
    </section>
  );
}

export function HomeDeferredSections({
  content,
}: Readonly<{ content: SiteContent }>) {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const steps = useMemo(() => getHistorySteps(content), [content]);

  return (
    <>
      <AboutSection content={content} />
      <CommunityFlyerSection content={content} onOpenImage={setLightboxImage} />
      <HistorySection
        steps={steps}
        content={content}
        onOpenImage={setLightboxImage}
      />
      <GallerySection content={content} onOpenImage={setLightboxImage} />
      <ClosingSection content={content} />
      <ImageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </>
  );
}
