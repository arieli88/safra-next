import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

import type { SiteContent } from "@/lib/types";

function getSocialIcon(href: string) {
  const lowered = href.toLowerCase();

  if (lowered.includes("instagram")) {
    return FaInstagram;
  }

  if (lowered.includes("facebook")) {
    return FaFacebookF;
  }

  if (lowered.startsWith("mailto:")) {
    return MdOutlineEmail;
  }

  return MdOutlineEmail;
}

export function Footer({ footer }: Readonly<{ footer: SiteContent["footer"] }>) {
  const navLinks = footer.quickLinks.some((link) => link.href === "/admin/login")
    ? footer.quickLinks
    : [
        ...footer.quickLinks,
        {
          label:
            "\u05db\u05e0\u05d9\u05e1\u05ea \u05de\u05e0\u05d4\u05dc\u05d9\u05dd",
          href: "/admin/login",
        },
      ];

  const socialLinks = footer.socialLinks.filter((link) => link.href.trim()).slice(0, 3);

  return (
    <>
      <footer className="border-t border-[#e6d8ca] bg-[#fbf6ef]">
        <div className="site-section site-shell grid gap-6 py-8 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="font-serif text-[1.45rem] text-[#3a2a1f]">{footer.title}</p>
            <p className="mt-2 text-[0.8rem] text-[#7e6653]">{footer.address}</p>
          </div>

          <nav
            className="flex flex-wrap gap-4 text-[0.8rem] text-[#6f5948]"
            aria-label="\u05e0\u05d9\u05d5\u05d5\u05d8 \u05ea\u05d7\u05ea\u05d5\u05df"
          >
            {navLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="transition hover:text-[#2e2219]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-center gap-2.5 md:justify-start">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.href);
              const external = link.href.startsWith("http");

              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  aria-label={link.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d4c5] bg-white/85 text-[#5b4739] transition hover:-translate-y-0.5 hover:border-[#ccb299] hover:text-[#33251c]"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </footer>

      <div className="bg-[#fbf6ef] py-4 text-center text-[0.8rem] text-[#8b715b]">
        {"\u00a9 2026 \u05d1\u05d9\u05ea \u05de\u05d3\u05e8\u05e9 \u05e1\u05e4\u05e8\u05d0. \u05db\u05dc \u05d4\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05e9\u05de\u05d5\u05e8\u05d5\u05ea."}
      </div>
    </>
  );
}
