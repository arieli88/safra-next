import { HebrewCalendar, HDate, Locale } from "@hebcal/core";

type ChronicleInfo = {
  weekdayLabel: string;
  gregorianDate: string;
  hebrewDate: string;
  parshaLabel: string;
  parshaDateLabel: string;
  isHolidayReading: boolean;
};

export type { ChronicleInfo };

function formatGregorianDate(date: Date) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "full",
    timeZone: "Asia/Jerusalem",
  }).format(date);
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    timeZone: "Asia/Jerusalem",
  }).format(date);
}

function formatHebrewDate(hdate: HDate) {
  return hdate.renderGematriya(true, false);
}

function formatParshaName(parsha: string[]) {
  if (parsha.length === 0) {
    return "פרשת השבוע";
  }

  return parsha
    .map((item) => Locale.gettext(item, "he-x-NoNikud"))
    .join(" / ");
}

function formatHolidayReading(shabbat: HDate) {
  const holiday = (HebrewCalendar.getHolidaysOnDate(shabbat) ?? [])
    .map((event) => event.render("he-x-NoNikud"))
    .find(Boolean);

  return `קריאה של חג ${holiday ?? "החג"}`;
}

export function getChronicleInfo(now = new Date()): ChronicleInfo {
  const hdate = new HDate(now);
  const shabbat = hdate.onOrAfter(6);
  const sedra = HebrewCalendar.getSedra(shabbat.getFullYear(), true);
  const lookup = sedra.lookup(shabbat);
  const parshaLabel = lookup.chag
    ? formatHolidayReading(shabbat)
    : formatParshaName(lookup.parsha);

  return {
    weekdayLabel: formatWeekday(now),
    gregorianDate: formatGregorianDate(now),
    hebrewDate: formatHebrewDate(hdate),
    parshaLabel,
    parshaDateLabel: shabbat.render("he", false),
    isHolidayReading: lookup.chag,
  };
}
