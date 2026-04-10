"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { ArrowUpLeft, Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { Footer } from "@/components/site/footer";
import TrueFocus from "@/components/site/true-focus";
import { getChronicleInfo, type ChronicleInfo } from "@/lib/calendar";
import type { SiteContent } from "@/lib/types";
import { AuroraText } from "@/registry/magicui/aurora-text";

type HomeLandingProps = { content: SiteContent; chronicle: ChronicleInfo };
type HistoryStep = {
  id: string;
  image: SiteContent["history"]["media"][number]["image"];
  href?: string;
  hrefLabel?: string;
};
type LightboxImage = { src: string; alt: string };

const particles = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  size: 4 + (index % 4) * 2,
  left: `${8 + index * 7}%`,
  top: `${12 + ((index * 9) % 70)}%`,
  duration: 18 + (index % 5) * 5,
  delay: (index % 4) * 1.2,
}));
const meteors = [
  { id: 1, top: "14%", left: "68%", delay: 2, duration: 9 },
  { id: 2, top: "38%", left: "18%", delay: 11, duration: 10 },
];

function getPrimaryCta(content: SiteContent) {
  if (
    content.hero.ctaLabel.trim() &&
    content.hero.ctaHref.trim() &&
    !content.hero.ctaHidden
  )
    return { label: content.hero.ctaLabel, href: content.hero.ctaHref };
  return { label: "בואו לפגוש את ספרא", href: "/contact" };
}

function getLiveUpdates(content: SiteContent) {
  const items = content.ticker
    .filter((item) => !item.hidden && item.text.trim())
    .map((item) => item.text.trim());
  return items.length > 0
    ? items
    : [
        "יום ראשון | 19:00 | ערב לימוד פתוח",
        "שיח, ארוחה ומפגש באמצע תל אביב",
        "פרשת השבוע נלמדת יחד, לאט ובלי רעש",
      ];
}

function getHeroImages(content: SiteContent) {
  return content.hero.images.filter(
    (image) => !image.hidden && image.src.trim(),
  );
}

function getHeroImage(content: SiteContent) {
  return (
    getHeroImages(content)[0] ??
    content.gallery.carousels
      .flatMap((carousel) => carousel.images)
      .find((image) => !image.hidden && image.src.trim()) ??
    content.history.media.find((media) => media.image.src.trim())?.image
  );
}

function getShortGregorianDate() {
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(new Date());
}

function splitHeroTitle(title: string) {
  const cleaned = title.trim();
  const lastSpace = cleaned.lastIndexOf(" ");
  return lastSpace > 0
    ? { lead: cleaned.slice(0, lastSpace), glow: cleaned.slice(lastSpace + 1) }
    : { lead: cleaned, glow: "להתחבר." };
}

function splitLeadWord(text: string) {
  const [first, ...rest] = text.trim().split(/\s+/);
  return { first: first ?? "", rest: rest.join(" ") };
}

function getGalleryImages(content: SiteContent) {
  return content.gallery.carousels
    .flatMap((carousel) => carousel.images)
    .filter((image) => !image.hidden && image.src.trim())
    .slice(0, 6);
}

function getHistorySteps(content: SiteContent): HistoryStep[] {
  return content.history.media
    .slice(0, 3)
    .map((media) => ({
      id: media.id,
      image: media.image,
      href: media.linkHref,
      hrefLabel: media.image.caption || media.linkLabel,
    }));
}

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
    if (!image) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  if (!image) return null;

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

const HeroVisual = memo(function HeroVisual({
  heroImages,
  heroImage,
}: Readonly<{
  heroImages: SiteContent["hero"]["images"];
  heroImage?:
    | SiteContent["hero"]["images"][number]
    | SiteContent["gallery"]["carousels"][number]["images"][number];
}>) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroImages.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [heroImages]);

  return (
    <div className="relative">
      <div className="relative mx-auto aspect-[4/4] w-full overflow-hidden rounded-[2.2rem] bg-[#f4eadf] shadow-[0_30px_80px_rgba(142,110,84,0.15)] sm:max-w-none sm:aspect-[4/5] sm:rounded-[2.4rem]">
        {heroImages.length > 0 ? (
          heroImages.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              className="absolute inset-0 transform-gpu"
              initial={false}
              animate={{
                opacity: index === activeHeroIndex ? 1 : 0,
                scale: index === activeHeroIndex ? 1 : 1.02,
              }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                quality={82}
                sizes="(max-width: 1024px) 76vw, 42vw"
                className="object-cover"
              />
            </motion.div>
          ))
        ) : heroImage?.src ? (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            fetchPriority="high"
            quality={82}
            sizes="(max-width: 1024px) 76vw, 42vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.62),transparent_34%),linear-gradient(180deg,rgba(255,249,241,0.02),rgba(65,44,30,0.22))]" />
      </div>
    </div>
  );
});

const MobileHeroBackdrop = memo(function MobileHeroBackdrop({
  heroImages,
  heroImage,
}: Readonly<{
  heroImages: SiteContent["hero"]["images"];
  heroImage?:
    | SiteContent["hero"]["images"][number]
    | SiteContent["gallery"]["carousels"][number]["images"][number];
}>) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const mobileHeroImage = heroImages[0] ?? heroImage;

  useEffect(() => {
    if (heroImages.length < 2) return;
    const interval = window.setInterval(
      () => setActiveHeroIndex((current) => (current + 1) % heroImages.length),
      7000,
    );
    return () => window.clearInterval(interval);
  }, [heroImages.length]);

  if (!mobileHeroImage?.src) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[-1rem] -top-10 bottom-[-2.5rem] -z-10 overflow-hidden rounded-[2rem] opacity-30 sm:hidden"
    >
      {heroImages.length > 0 ? (
        heroImages.map((image, index) => (
          <motion.div
            key={`${image.src}-mobile-${index}`}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: index === activeHeroIndex ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={image.src}
              alt=""
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              quality={74}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        ))
      ) : (
        <Image
          src={mobileHeroImage.src}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={74}
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,246,239,0.94),rgba(251,246,239,0.58),rgba(251,246,239,0.96))]" />
    </div>
  );
});

function TopBar({
  content,
  chronicle,
  updates,
}: Readonly<{
  content: SiteContent;
  chronicle: ChronicleInfo;
  updates: string[];
}>) {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const fallbackChronicle = useMemo(() => {
    if (chronicle.weekdayLabel && chronicle.hebrewDate && chronicle.parshaLabel) {
      return chronicle;
    }

    try {
      return getChronicleInfo(new Date());
    } catch {
      return chronicle;
    }
  }, [chronicle]);
  const [safeChronicle, setSafeChronicle] = useState(fallbackChronicle);

  useEffect(() => {
    setSafeChronicle(fallbackChronicle);
  }, [fallbackChronicle]);

  useEffect(() => {
    if (
      safeChronicle.weekdayLabel &&
      safeChronicle.hebrewDate &&
      safeChronicle.parshaLabel
    ) {
      return;
    }

    let attempts = 0;
    const tryRefresh = () => {
      try {
        const refreshed = getChronicleInfo(new Date());
        if (
          refreshed.weekdayLabel &&
          refreshed.hebrewDate &&
          refreshed.parshaLabel
        ) {
          setSafeChronicle(refreshed);
          return;
        }
      } catch {}

      attempts += 1;
      if (attempts < 3) {
        window.setTimeout(tryRefresh, 180 * attempts);
      }
    };

    const timeoutId = window.setTimeout(tryRefresh, 120);
    return () => window.clearTimeout(timeoutId);
  }, [safeChronicle]);

  const infoLineMobile = `${safeChronicle.weekdayLabel || "יום שישי"} | ${safeChronicle.hebrewDate || "כ״ז באדר תשפ״ו"} | ${getShortGregorianDate()} | ${safeChronicle.parshaLabel || "פרשת השבוע"}`;
  const infoLineDesktop = `${safeChronicle.weekdayLabel || "יום שישי"} | ${safeChronicle.hebrewDate || "כ״ז באדר תשפ״ו"} | ${getShortGregorianDate()} | פרשת: ${safeChronicle.parshaLabel || "פרשת השבוע"}`;
  const tickerItems = [...updates, ...updates];
  const links = [
    { label: "בית", href: "#home" },
    { label: "אודות", href: "#about" },
    { label: "קהילה", href: "#community" },
    { label: "היסטוריה", href: "#history" },
    { label: "גלריה", href: "#gallery" },
    { label: "צור קשר", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d9cabb]/70 bg-[#fbf6ef]/97 shadow-[0_10px_24px_rgba(137,105,80,0.06)]">
        <div className="site-section site-shell contents"> {/* size of navbar */}
          <div className="flex items-center justify-between py-2.5 px-5">
            <Link href="#home" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-transparent shadow-[0_12px_24px_rgba(134,101,74,0.08)] sm:h-[3.25rem] sm:w-[3.25rem]">
                <Image
                  src={content.meta.logoUrl}
                  alt={content.nav.title}
                  fill
                  sizes="52px"
                  className="object-contain p-1 transition duration-300 ease-out group-hover:scale-110"
                />
              </div>
              <div>
                <p className="font-serif text-[1.15rem] leading-none text-[#3f2b1f] sm:text-[1.28rem]">
                  {content.nav.title}
                </p>
                <p className="hidden text-[0.76rem] text-[#8a7461] sm:block">
                  {content.nav.subtitle}
                </p>
              </div>
            </Link>

            <nav
              className="hidden items-center gap-1.5 rounded-full border border-[#e6d8ca] bg-white p-1.5 text-[0.82rem] font-medium text-[#6e5848] shadow-[0_12px_24px_rgba(134,101,74,0.06)] md:flex"
              aria-label="ניווט ראשי"
            >
              {links.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition hover:bg-[#fffdf9] hover:text-[#2c2018]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d6ca] bg-white text-[#3f2b1f] shadow-[0_12px_24px_rgba(134,101,74,0.08)] md:hidden"
              aria-label={menuOpen ? "סגירת תפריט ניווט" : "פתיחת תפריט ניווט"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
          {menuOpen ? (
            <nav
              className="grid gap-2 border-t border-[#e6d8ca]/80 pb-4 pt-3 md:hidden"
              aria-label="תפריט ניווט"
            >
              {links.map((link) => (
                <Link
                  key={`${link.label}-${link.href}-mobile`}
                  href={link.href}
                  className="rounded-[1.1rem] bg-white px-3.5 py-2.5 text-[0.85rem] font-medium text-[#5f4b3d] transition hover:bg-[#fffdf9]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <div className="pt-[4.5rem] sm:pt-[5rem]">
        <div className="border-b border-[#d4a373] bg-[linear-gradient(180deg,#fff3df_0%,#f4dcc1_100%)] shadow-[0_10px_22px_rgba(137,105,80,0.1)]">
          <div className="site-section px-3 py-2 text-center font-black text-[#7a2f0b] sm:px-2">
            <p className="mx-auto max-w-full whitespace-nowrap text-[clamp(0.52rem,2.95vw,0.96rem)] leading-none tracking-[-0.034em] drop-shadow-[0_1px_0_rgba(255,248,240,0.72)] sm:hidden">
              {infoLineMobile}
            </p>
            <p className="mx-auto hidden max-w-full whitespace-nowrap text-[clamp(0.86rem,1.72vw,1.14rem)] leading-none tracking-[-0.018em] drop-shadow-[0_1px_0_rgba(255,248,240,0.72)] sm:block">
              {infoLineDesktop}
            </p>
          </div>
        </div>
        <div className="border-b border-[#e6d8ca]/70 bg-[#fbf6ef]/82">
          <div className="site-section site-shell py-2">
            <div className="live-strip-mask overflow-hidden rounded-full bg-white/75 px-3 py-2 shadow-[0_8px_24px_rgba(163,129,98,0.08)]">
              <motion.div
                className="flex w-max gap-8 whitespace-nowrap text-[0.74rem] text-[#7d6552] sm:text-[0.82rem]"
                initial={{ x: 0 }}
                animate={reduceMotion ? undefined : { x: ["0%", "42%"] }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {tickerItems.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="inline-flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d1a676]" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HeroSection({
  content,
  heroImage,
}: Readonly<{
  content: SiteContent;
  heroImage?:
    | SiteContent["hero"]["images"][number]
    | SiteContent["gallery"]["carousels"][number]["images"][number];
}>) {
  const reduceMotion = useReducedMotion();
  const cta = getPrimaryCta(content);
  const heroTitle = splitHeroTitle(content.hero.title);
  const leadWords = splitLeadWord(heroTitle.lead);
  const heroImages = useMemo(() => getHeroImages(content), [content]);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 28, damping: 22, mass: 0.82 });
  const smoothY = useSpring(mouseY, { stiffness: 28, damping: 22, mass: 0.82 });
  const auroraX = useTransform(smoothX, [-1, 1], [-24, 24]);
  const auroraY = useTransform(smoothY, [-1, 1], [-18, 18]);
  const particleX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const particleY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const haloX = useTransform(smoothX, [-1, 1], [-36, 36]);
  const haloY = useTransform(smoothY, [-1, 1], [-24, 24]);
  const glowPosX = useTransform(smoothX, [-1, 1], [42, 58]);
  const glowPosY = useTransform(smoothY, [-1, 1], [36, 54]);
  const dynamicGlow = useMotionTemplate`radial-gradient(circle at ${glowPosX}% ${glowPosY}%, rgba(255,245,225,0.92), rgba(247,223,189,0.48) 18%, rgba(255,255,255,0) 58%)`;
  const visibleParticles = useMemo(
    () => (isMobile ? particles.slice(0, 6) : particles),
    [isMobile],
  );
  const visibleMeteors = useMemo(
    () => (isMobile ? meteors.slice(0, 1) : meteors),
    [isMobile],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <section
      id="home"
      className="site-section relative isolate overflow-hidden pb-8 pt-7 sm:pb-12 sm:pt-9 lg:pb-[4rem]"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={isMobile ? undefined : { x: haloX, y: haloY }}
      >
        <motion.div
          className="absolute inset-x-[-10%] top-[-8%] h-[28rem] rounded-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(248,225,194,0.62),rgba(244,214,177,0.32)_28%,rgba(255,255,255,0)_70%)] blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.08, 1], rotate: [0, 4, 0] }
          }
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute left-[-6%] top-[12%] h-[23rem] w-[44rem] rounded-[50%] bg-[linear-gradient(90deg,rgba(248,221,193,0),rgba(242,208,170,0.42),rgba(234,198,160,0.16),rgba(255,255,255,0))] blur-3xl"
          style={{ x: auroraX, y: auroraY }}
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 28, -10, 0], y: [0, -10, 16, 0] }
          }
          transition={{
            duration: 28,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[-2%] top-[24%] h-[19rem] w-[36rem] rounded-[50%] bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,240,218,0.55),rgba(214,181,146,0.22),rgba(255,255,255,0))] blur-3xl"
          style={{
            x: useTransform(auroraX, (value) => value * -0.7),
            y: useTransform(auroraY, (value) => value * -0.7),
          }}
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -18, 12, 0], y: [0, 10, -12, 0] }
          }
          transition={{
            duration: 24,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-90"
          style={{ backgroundImage: dynamicGlow }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="landing-spotlight absolute left-[6%] top-6 z-0 h-[18rem] w-[18rem] rounded-full bg-[#f8d8b6] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 18, 0], y: [0, 22, 0], opacity: [0.28, 0.44, 0.28] }
        }
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ x: auroraX, y: auroraY }}
      />
      <motion.div
        aria-hidden="true"
        className="landing-spotlight absolute bottom-8 right-[10%] z-0 h-[22rem] w-[22rem] rounded-full bg-[#fff8ed] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -22, 0], y: [0, -18, 0], opacity: [0.36, 0.56, 0.36] }
        }
        transition={{
          duration: 26,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          x: useTransform(auroraX, (value) => value * -0.7),
          y: useTransform(auroraY, (value) => value * -0.55),
        }}
      />
      {!isMobile ? (
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-14%] top-[24%] z-0 h-28 bg-[linear-gradient(90deg,transparent,rgba(244,197,147,0.34),transparent)] blur-3xl"
          animate={reduceMotion ? undefined : { x: ["-8%", "8%", "-8%"] }}
          transition={{
            duration: 16,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ) : null}
      {!isMobile ? (
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-18%] z-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0),rgba(241,213,180,0.34),rgba(255,255,255,0),rgba(243,191,147,0.24),rgba(255,255,255,0))] opacity-60 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { rotate: [0, 10, 0], scale: [1, 1.05, 1] }
          }
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ) : null}
      {visibleParticles.map((particle) => (
        <motion.span
          key={particle.id}
          aria-hidden="true"
          className="absolute z-0 rounded-full bg-white/75 blur-[1px] transform-gpu"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            x: particleX,
            y: particleY,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -14, 0],
                  opacity: [0.12, 0.28, 0.12],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{
            duration: particle.duration + 4,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
      {visibleMeteors.map((meteor) => (
        <motion.span
          key={meteor.id}
          aria-hidden="true"
          className="absolute z-0 h-px w-24 rotate-[28deg] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(250,230,199,0.9),rgba(255,255,255,0))] opacity-0 blur-[0.5px] transform-gpu"
          style={{ top: meteor.top, left: meteor.left }}
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 52, 96], y: [0, 24, 46], opacity: [0, 0.26, 0] }
          }
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="site-shell relative z-10 grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <RevealSection amount={0.4} className="relative z-10">
          {isMobile ? <MobileHeroBackdrop heroImages={heroImages} heroImage={heroImage} /> : null}
          <SectionEyebrow>{content.hero.eyebrow || "בית מדרש"}</SectionEyebrow>
          <motion.h1
            initial={reduceMotion ? undefined : { opacity: 0, y: 32 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-4xl font-serif text-[3rem] font-bold leading-[1.02] text-[#2f2118] sm:text-[3.7rem] lg:text-[4.56rem]"
          >
            {leadWords.first ? (
              <span className="inline-block text-[1.3em] sm:text-[1.2em]">
                <AuroraText>{leadWords.first}</AuroraText>
              </span>
            ) : null}
            {leadWords.rest ? <> {leadWords.rest}</> : null}
            <span className="block">
              <AuroraText>{heroTitle.glow}</AuroraText>
            </span>
          </motion.h1>
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl"
          >
            <TrueFocus
              sentence="לימוד שיחה קהילה"
              manualMode={false}
              blurAmount={0}
              borderColor="#7a5334"
              glowColor="rgba(122, 83, 52, 0.24)"
              animationDuration={0.5}
              pauseBetweenAnimations={0.5}
            />
          </motion.div>
          <motion.p
            initial={reduceMotion ? undefined : { opacity: 0, y: 26 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: 1.15,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 max-w-2xl whitespace-pre-line text-[1rem] leading-8 text-[#6b5849] sm:text-[1.05rem] sm:leading-9"
          >
            {content.hero.body}
          </motion.p>
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#d7b390] px-5.5 py-3 text-[0.95rem] font-bold text-[#3c2a1e] shadow-[0_18px_44px_rgba(178,138,102,0.18)] transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#e2c3a4]"
            >
              {cta.label}
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </motion.div>
        </RevealSection>

        <div className="hidden sm:block">
          <HeroVisual heroImages={heroImages} heroImage={heroImage} />
        </div>
      </div>
    </section>
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
          <RevealSection
            amount={0.45}
            className="border-t border-[#e4d6c8] pt-6"
          >
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

  if (!track || !flyerImage?.src) return null;

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
  content,
  onOpenImage,
}: Readonly<{
  content: SiteContent;
  onOpenImage: (image: LightboxImage) => void;
}>) {
  const steps = getHistorySteps(content);
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
  const images = getGalleryImages(content);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: "rtl",
    loop: images.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || images.length < 2) return;
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
            "עשו כתות כתות ועסקו בתורה לפי שאין התורה נקנית אלא בחבורה"
             <br />
            <span className="text-[0.8em] text-[#7d624f]">~מסכת ברכות סג ע"ב~</span>
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

function AmbientBackground() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -120],
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0.95, 0.68]);
  const style: MotionStyle = { y, opacity };

  return (
    <motion.div
      ref={ref}
      style={style}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_34%),linear-gradient(180deg,#fdf9f3_0%,#f8f1e7_48%,#f5ecdf_100%)]" />
      <div className="landing-grain absolute inset-0 opacity-35" />
      <div className="absolute left-[-6%] top-[8rem] h-[18rem] w-[18rem] rounded-full bg-[#ffe7cb] blur-3xl" />
      <div className="absolute right-[-6%] top-[28rem] h-[24rem] w-[24rem] rounded-full bg-[#fff6e9] blur-3xl" />
    </motion.div>
  );
}

export function HomeLanding({
  content,
  chronicle,
}: Readonly<HomeLandingProps>) {
  const updates = getLiveUpdates(content);
  const heroImage = getHeroImage(content);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(
    null,
  );

  useEffect(() => {
    console.log(
      "%cנבנה על ידי\n%c😉%cאריאל פלישבסקי%c🔥",
      "font-size: 18px; color: #fff; padding: 4px 8px; border-radius: 4px;",
      "font-size: 18px; color: #f0c674;",
      "font-size: 20px; font-weight: bold; background: linear-gradient(90deg, #ff7e5f, #feb47b); -webkit-background-clip: text; color: transparent;",
      "font-size: 20px;",
    );

    const art = `
 _____                                             _____ 
( ___ )                                           ( ___ )
 |   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|   | 
 |   |    _           _         _   _   ___   ___  |   | 
 |   |   /_\\\\    _ _  (_)  ___  | | (_) ( _ ) ( _ ) |   | 
 |   |  / _ \\\\  | '_| | | / -_) | | | | / _ \\\\ / _ \\\\ |   | 
 |   | /_/ \\\\_\\\\ |_|   |_| \\\\___| |_| |_| \\\\___/ \\\\___/ |   | 
 |___|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|___| 
(_____)                                           (_____)
`;

    console.log(
      `%c${art}`,
      "color: orange; font-family: monospace; font-size:10px; font-weight: bold; line-height: 1;",
    );
  }, []);

  return (
    <div className="relative bg-[#fbf6ef] text-[#2d2118]">
      <AmbientBackground />
      <TopBar content={content} chronicle={chronicle} updates={updates} />
      <main className="relative z-10">
        <HeroSection content={content} heroImage={heroImage} />
        <AboutSection content={content} />
        <CommunityFlyerSection
          content={content}
          onOpenImage={setLightboxImage}
        />
        <HistorySection content={content} onOpenImage={setLightboxImage} />
        <GallerySection content={content} onOpenImage={setLightboxImage} />
        <ClosingSection content={content} />
      </main>
      <div className="relative z-10 bg-[#fbf6ef]">
        <Footer footer={content.footer} />
      </div>
      <ImageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
