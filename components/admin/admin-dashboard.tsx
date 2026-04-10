"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

import type { SiteContent } from "@/lib/types";

const MATERIALS_LINK = "https://drive.google.com/drive/folders/1PCvW8fBPFVU8LrGnySftuCONQcJ8obf3?usp=sharing";
const MATERIALS_DRIVE_LINK = "https://drive.google.com/drive/folders/1PCvW8fBPFVU8LrGnySftuCONQcJ8obf3?usp=sharing";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function prettyJson(value: SiteContent) {
  return JSON.stringify(value, null, 2);
}

function syncMirrors(content: SiteContent): SiteContent {
  const next = structuredClone(content);

  next.hero.ctaHidden ??= false;
  next.hero.secondaryCtaHidden ??= false;
  next.contactPage.cardSettings ??= {
    imageBlurPx: 8,
    tiltStrength: 2,
    spotlightEnabled: true,
    mobileColumns: "2",
  };
  next.about.addressText ||= next.meta.address;
  next.hero.infoCards = next.hero.infoCards.map((card) => ({ ...card, hidden: card.hidden ?? false }));
  next.meta.resourcesLink ||= "https://drive.google.com/drive/folders/1VerAkXvv7LTz3SoGuzgo1dNwcm8GGoz2";

  if (!next.community.tracks[0]) {
    next.community.tracks[0] = {
      id: "community-primary",
      title: "",
      subtitle: "",
      schedule: "",
      description: "",
      flyerImage: { src: "", alt: "פלייר בית מדרש ספרא" },
      whatsappLabel: "",
      whatsappUrl: "",
    };
  }

  next.community.tracks[0].flyerImage = {
    src: next.community.tracks[0].flyerImage?.src ?? "",
    alt: "פלייר בית מדרש ספרא",
  };

  next.footer.quickLinks = next.nav.links
    .filter((link) => link.href !== "/admin/login")
    .map((link) => ({ label: link.label, href: link.href, external: link.external }));

  next.footer.socialLinks = [
    { label: "אינסטגרם", href: next.meta.instagramUrl, external: true },
    { label: "פייסבוק", href: next.meta.facebookUrl, external: true },
    { label: "מייל", href: next.meta.email },
  ].filter((link) => link.href.trim());

  return next;
}

const tabs = [
  { id: "main", label: "ראשי + קהילה" },
  { id: "gallery", label: "גלריה" },
  { id: "contact", label: "צור קשר" },
  { id: "ticker", label: "סרגל התראות" },
  { id: "dev", label: "לפיתוח" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminDashboard({ initialContent }: Readonly<{ initialContent: SiteContent }>) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => syncMirrors(initialContent));
  const [rawJson, setRawJson] = useState(() => prettyJson(syncMirrors(initialContent)));
  const [message, setMessage] = useState("אפשר לערוך, לבדוק ולשמור בזמן אמת.");
  const [activeTab, setActiveTab] = useState<TabId>("main");
  const [isPending, startTransition] = useTransition();

  const communityTrack = draft.community.tracks[0];
  const gallery = draft.gallery.carousels[0];

  function apply(next: SiteContent) {
    const normalized = syncMirrors(next);
    setDraft(normalized);
    setRawJson(prettyJson(normalized));
  }

  function update(mutator: (next: SiteContent) => void) {
    const next = structuredClone(draft);
    mutator(next);
    apply(next);
  }

  function save() {
    const payload = syncMirrors(draft);
    setMessage("שומר...");

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/site-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          setMessage("השמירה נכשלה.");
          return;
        }

        const saved = (await response.json()) as SiteContent;
        apply(saved);
        setMessage("נשמר בהצלחה והאתר עודכן.");
        router.refresh();
      })();
    });
  }

  function applyJson() {
    try {
      const parsed = JSON.parse(rawJson) as SiteContent;
      apply(parsed);
      setMessage("ה־JSON נטען. לחצו שמירה כדי לפרסם.");
    } catch {
      setMessage("ה־JSON אינו תקין.");
    }
  }

  function logout() {
    startTransition(() => {
      void (async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      })();
    });
  }

  return (
    <div className="grid gap-6">
      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">Admin UI</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-foreground">ניהול האתר</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
              הטפסים כאן מסודרים לפי המקטעים המרכזיים באתר. כל שינוי נשמר קודם בטיוטה, ורק בלחיצה על שמירה מתפרסם באתר.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="admin-button admin-button-secondary" onClick={logout}>
              התנתקות
            </button>
            <button type="button" className="admin-button admin-button-primary" onClick={save} disabled={isPending}>
              {isPending ? "שומר..." : "שמירת שינויים"}
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-muted">{message}</div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === tab.id ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-white/80 text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          <a
            href={MATERIALS_DRIVE_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-white"
          >
            חומרי האתר
          </a>
        </div>
      </section>

      {activeTab === "main" ? (
        <div className="grid gap-6">
          <EditorCard title="תמונות מתחלפות ראשי">
            <AccordionSection title="ניהול תמונות ראשיות" defaultOpen>
              <div className="grid gap-4">
                {draft.hero.images.map((image, index) => (
                  <AccordionSection key={`${image.src}-${index}`} title={`תמונה ${index + 1}`} defaultOpen={index === 0}>
                    <MediaRow
                      title={`תמונה ${index + 1}`}
                      hidden={Boolean(image.hidden)}
                      onHiddenChange={(hidden) =>
                        update((next) => {
                          next.hero.images[index].hidden = hidden;
                        })
                      }
                      onRemove={() =>
                        update((next) => {
                          next.hero.images.splice(index, 1);
                        })
                      }
                    >
                      <Field
                        label="קישור תמונה"
                        value={image.src}
                        previewSrc={image.src}
                        onChange={(value) =>
                          update((next) => {
                            next.hero.images[index].src = value;
                          })
                        }
                      />
                      <Field
                        label="תיאור תמונה"
                        value={image.alt}
                        onChange={(value) =>
                          update((next) => {
                            next.hero.images[index].alt = value;
                          })
                        }
                      />
                    </MediaRow>
                  </AccordionSection>
                ))}
              </div>

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() =>
                  update((next) => {
                    next.hero.images.push({ src: "", alt: "תמונת Hero חדשה" });
                  })
                }
              >
                הוספת תמונה
              </button>
            </AccordionSection>
          </EditorCard>

          <EditorCard title="קהילה">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="קישור WhatsApp"
                value={communityTrack.whatsappUrl}
                onChange={(value) =>
                  update((next) => {
                    next.community.tracks[0].whatsappUrl = value;
                  })
                }
              />
              <Field
                label="קישור לתמונת פלייר"
                value={communityTrack.flyerImage?.src ?? ""}
                previewSrc={communityTrack.flyerImage?.src ?? ""}
                onChange={(value) =>
                  update((next) => {
                    next.community.tracks[0].flyerImage = {
                      src: value,
                      alt: "פלייר בית מדרש ספרא",
                    };
                  })
                }
              />
            </div>
          </EditorCard>
        </div>
      ) : null}

      {activeTab === "gallery" ? (
        <div className="grid gap-6">
          {gallery ? (
            <EditorCard title="תמונות הקרוסלה">
              <AccordionSection title="ניהול גלריה" defaultOpen={false}>
                <div className="grid gap-4">
                  {gallery.images.map((image, index) => (
                    <MediaRow
                      key={`${image.src}-${index}`}
                      title={`תמונה ${index + 1}`}
                      hidden={Boolean(image.hidden)}
                      onHiddenChange={(hidden) =>
                        update((next) => {
                          next.gallery.carousels[0].images[index].hidden = hidden;
                        })
                      }
                      onRemove={() =>
                        update((next) => {
                          next.gallery.carousels[0].images.splice(index, 1);
                        })
                      }
                    >
                      <Field
                        label="קישור תמונה"
                        value={image.src}
                        previewSrc={image.src}
                        onChange={(value) =>
                          update((next) => {
                            next.gallery.carousels[0].images[index].src = value;
                          })
                        }
                      />
                      <Field
                        label="תיאור התמונה"
                        value={image.alt}
                        onChange={(value) =>
                          update((next) => {
                            next.gallery.carousels[0].images[index].alt = value;
                          })
                        }
                      />
                    </MediaRow>
                  ))}
                </div>

                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={() =>
                    update((next) => {
                      next.gallery.carousels[0].images.push({ src: "", alt: "תמונה חדשה", hidden: false });
                    })
                  }
                >
                  הוספת תמונה
                </button>
              </AccordionSection>
            </EditorCard>
          ) : null}
        </div>
      ) : null}

      {activeTab === "contact" ? (
        <div className="grid gap-6">
          <EditorCard title="זמני פעילות">
            <div className="grid gap-3">
              {draft.contactPage.hours.map((hour, index) => (
                <div key={`${hour}-${index}`} className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <Field
                    label={`שורת זמן ${index + 1}`}
                    value={hour}
                    onChange={(value) =>
                      update((next) => {
                        next.contactPage.hours[index] = value;
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-button admin-button-secondary self-end"
                    onClick={() =>
                      update((next) => {
                        next.contactPage.hours.splice(index, 1);
                      })
                    }
                  >
                    מחיקה
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="admin-button admin-button-secondary"
              onClick={() =>
                update((next) => {
                  next.contactPage.hours.push("יום חדש | שעה חדשה");
                })
              }
            >
              הוספת שורה
            </button>
          </EditorCard>

          <EditorCard title="מרצים">
            <div className="grid gap-4">
              {draft.contactPage.lecturers.map((lecturer, index) => (
                <AccordionSection key={lecturer.id} title={lecturer.name || `מרצה ${index + 1}`} defaultOpen={index === 0}>
                  <MediaRow
                    title={lecturer.name || `מרצה ${index + 1}`}
                    hidden={Boolean(lecturer.hidden)}
                    toggleLabel="הצג/הסתר"
                    onHiddenChange={(hidden) =>
                      update((next) => {
                        next.contactPage.lecturers[index].hidden = hidden;
                      })
                    }
                    onRemove={() =>
                      update((next) => {
                        next.contactPage.lecturers.splice(index, 1);
                      })
                    }
                  >
                    <Field
                      label="שם"
                      value={lecturer.name}
                      onChange={(value) =>
                        update((next) => {
                          next.contactPage.lecturers[index].name = value;
                        })
                      }
                    />
                    <Field
                      label="טלפון"
                      value={lecturer.phone}
                      onChange={(value) =>
                        update((next) => {
                          next.contactPage.lecturers[index].phone = value;
                        })
                      }
                    />
                    <Field
                      label="תוכנית"
                      value={lecturer.program}
                      onChange={(value) =>
                        update((next) => {
                          next.contactPage.lecturers[index].program = value;
                        })
                      }
                    />
                    <Field
                      label="תמונה"
                      value={lecturer.image.src}
                      previewSrc={lecturer.image.src}
                      onChange={(value) =>
                        update((next) => {
                          next.contactPage.lecturers[index].image.src = value;
                        })
                      }
                    />
                    <Field
                      label="תיאור תמונה"
                      value={lecturer.image.alt}
                      onChange={(value) =>
                        update((next) => {
                          next.contactPage.lecturers[index].image.alt = value;
                        })
                      }
                    />
                    <div className="md:col-span-2">
                      <TextAreaField
                        label="ביוגרפיה"
                        value={lecturer.bio}
                        onChange={(value) =>
                          update((next) => {
                            next.contactPage.lecturers[index].bio = value;
                          })
                        }
                      />
                    </div>
                  </MediaRow>
                </AccordionSection>
              ))}
            </div>
          </EditorCard>
        </div>
      ) : null}

      {activeTab === "ticker" ? (
        <div className="grid gap-6">
          <EditorCard title="סרגל התראות">
            <div className="grid gap-4">
              {draft.ticker.map((item, index) => (
                <MediaRow
                  key={item.id}
                  title={`התראה ${index + 1}`}
                  hidden={Boolean(item.hidden)}
                  toggleLabel="הצג/הסתר"
                  onHiddenChange={(hidden) =>
                    update((next) => {
                      next.ticker[index].hidden = hidden;
                    })
                  }
                  onRemove={() =>
                    update((next) => {
                      next.ticker.splice(index, 1);
                    })
                  }
                >
                  <div className="md:col-span-2">
                    <TextAreaField
                      label="טקסט ההתראה"
                      value={item.text}
                      onChange={(value) =>
                        update((next) => {
                          next.ticker[index].text = value;
                        })
                      }
                    />
                  </div>
                </MediaRow>
              ))}
            </div>

            <button
              type="button"
              className="admin-button admin-button-secondary"
              onClick={() =>
                update((next) => {
                  next.ticker.push({ id: createId(), text: "התראה חדשה", hidden: false });
                })
              }
            >
              הוספת התראה
            </button>
          </EditorCard>
        </div>
      ) : null}

      {activeTab === "dev" ? (
        <div className="grid gap-6">
          <EditorCard title="לפיתוח">
            <Field
              label="אייקון / לוגו אתר"
              value={draft.meta.logoUrl}
              onChange={(value) =>
                update((next) => {
                  next.meta.logoUrl = value;
                })
              }
            />
            <Field
              label="כותרת אתר"
              value={draft.meta.title}
              onChange={(value) =>
                update((next) => {
                  next.meta.title = value;
                })
              }
            />
            <TextAreaField
              label="תיאור אתר"
              value={draft.meta.description}
              onChange={(value) =>
                update((next) => {
                  next.meta.description = value;
                })
              }
            />
          </EditorCard>

          <EditorCard title="קישורי ניווט">
            <div className="grid gap-4">
              {draft.nav.links.map((link, index) => (
                <div key={`${link.label}-${index}`} className="grid gap-3 rounded-[1.5rem] border border-brand/10 bg-white/70 p-4 md:grid-cols-[1fr_1fr_auto]">
                  <Field
                    label={`תווית ${index + 1}`}
                    value={link.label}
                    onChange={(value) =>
                      update((next) => {
                        next.nav.links[index].label = value;
                      })
                    }
                  />
                  <Field
                    label={`קישור ${index + 1}`}
                    value={link.href}
                    onChange={(value) =>
                      update((next) => {
                        next.nav.links[index].href = value;
                      })
                    }
                  />
                  <button
                    type="button"
                    className="admin-button admin-button-secondary self-end"
                    onClick={() =>
                      update((next) => {
                        next.nav.links.splice(index, 1);
                      })
                    }
                  >
                    מחיקה
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="admin-button admin-button-secondary"
              onClick={() =>
                update((next) => {
                  next.nav.links.push({ label: "קישור חדש", href: "/#new-section" });
                })
              }
            >
              הוספת קישור ניווט
            </button>
          </EditorCard>

          <EditorCard title="רשתות וקשר">
            <Field
              label="קישור לאינסטגרם"
              value={draft.meta.instagramUrl}
              onChange={(value) =>
                update((next) => {
                  next.meta.instagramUrl = value;
                })
              }
            />
            <Field
              label="קישור לפייסבוק"
              value={draft.meta.facebookUrl}
              onChange={(value) =>
                update((next) => {
                  next.meta.facebookUrl = value;
                })
              }
            />
            <Field
              label="קישור למייל"
              value={draft.meta.email}
              onChange={(value) =>
                update((next) => {
                  next.meta.email = value;
                })
              }
            />
          </EditorCard>

          <EditorCard title="Advanced JSON">
            <textarea className="admin-textarea min-h-[420px]" value={rawJson} onChange={(event) => setRawJson(event.target.value)} />
            <div className="flex flex-wrap gap-3">
              <button type="button" className="admin-button admin-button-secondary" onClick={applyJson}>
                טען JSON לטופס
              </button>
              <button type="button" className="admin-button admin-button-primary" onClick={save} disabled={isPending}>
                {isPending ? "שומר..." : "שמור JSON"}
              </button>
            </div>
          </EditorCard>
        </div>
      ) : null}
    </div>
  );
}

function EditorCard({
  title,
  children,
}: Readonly<{
  title: string;
  children: ReactNode;
}>) {
  return (
    <section className="glass-card rounded-[2rem] p-6 sm:p-8">
      <h2 className="font-serif text-3xl font-bold text-foreground">{title}</h2>
      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
}

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: Readonly<{
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}>) {
  return (
    <details open={defaultOpen} className="group overflow-hidden rounded-[1.5rem] border border-brand/10 bg-white/70">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-right">
        <span className="font-serif text-2xl font-bold text-foreground">{title}</span>
        <ChevronDown className="h-5 w-5 shrink-0 text-brand transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-brand/10 p-5">{children}</div>
    </details>
  );
}

function MediaRow({
  title,
  hidden,
  toggleLabel = "הצג",
  onHiddenChange,
  onRemove,
  children,
}: Readonly<{
  title: string;
  hidden: boolean;
  toggleLabel?: string;
  onHiddenChange: (hidden: boolean) => void;
  onRemove: () => void;
  children: ReactNode;
}>) {
  return (
    <div className="rounded-[1.5rem] border border-brand/10 bg-white/70 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-2xl font-bold text-foreground">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-3 rounded-full border border-brand/10 bg-white px-4 py-2 text-sm font-semibold text-foreground">
            <span>{toggleLabel}</span>
            <button
              type="button"
              role="switch"
              aria-checked={!hidden}
              className={`relative h-7 w-[3.25rem] rounded-full transition ${hidden ? "bg-brand/20" : "bg-brand"}`}
              onClick={() => onHiddenChange(!hidden)}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${hidden ? "right-1" : "right-7"}`} />
            </button>
          </label>
          <button type="button" className="admin-button admin-button-secondary" onClick={onRemove}>
            מחיקה
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  previewSrc,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  previewSrc?: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input className="admin-input" value={value} onChange={(event) => onChange(event.target.value)} />
      {previewSrc?.trim() ? (
        <a
          href={previewSrc}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center rounded-full border border-brand/15 bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft/30 hover:text-brand-dark"
        >
          פתח תמונה בכרטיסייה חדשה
        </a>
      ) : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <textarea className="admin-textarea" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
