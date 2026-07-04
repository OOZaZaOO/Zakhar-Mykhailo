export type CountryTimezones = {
  country: string;
  timezones: string[];
};

export const countryTimezones: CountryTimezones[] = [
  { country: "Slovakia", timezones: ["Europe/Bratislava"] },
  { country: "Ukraine", timezones: ["Europe/Kyiv"] },
  { country: "Poland", timezones: ["Europe/Warsaw"] },
  { country: "Czech Republic", timezones: ["Europe/Prague"] },
  { country: "Germany", timezones: ["Europe/Berlin"] },
  { country: "Austria", timezones: ["Europe/Vienna"] },
  { country: "United Kingdom", timezones: ["Europe/London"] },
  { country: "Ireland", timezones: ["Europe/Dublin"] },
  { country: "France", timezones: ["Europe/Paris"] },
  { country: "Spain", timezones: ["Europe/Madrid", "Atlantic/Canary"] },
  {
    country: "Portugal",
    timezones: ["Europe/Lisbon", "Atlantic/Azores", "Atlantic/Madeira"],
  },
  { country: "Italy", timezones: ["Europe/Rome"] },
  { country: "Netherlands", timezones: ["Europe/Amsterdam"] },
  { country: "Belgium", timezones: ["Europe/Brussels"] },
  { country: "Switzerland", timezones: ["Europe/Zurich"] },
  {
    country: "United States",
    timezones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Phoenix",
      "America/Anchorage",
      "Pacific/Honolulu",
    ],
  },
  {
    country: "Canada",
    timezones: [
      "America/Toronto",
      "America/Vancouver",
      "America/Edmonton",
      "America/Winnipeg",
      "America/Halifax",
      "America/St_Johns",
    ],
  },
  {
    country: "Australia",
    timezones: [
      "Australia/Sydney",
      "Australia/Melbourne",
      "Australia/Brisbane",
      "Australia/Perth",
      "Australia/Adelaide",
      "Australia/Darwin",
      "Australia/Hobart",
    ],
  },
];

export function getTimezonesByCountry(country: string) {
  return (
    countryTimezones.find((item) => item.country === country)?.timezones ?? []
  );
}

export function getCountryByTimezone(timezone: string) {
  return (
    countryTimezones.find((item) => item.timezones.includes(timezone))
      ?.country ?? ""
  );
}

export function isValidIanaTimezone(timezone: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export function formatInTimezone(date: Date, timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
}

export function prepareBookingTimeForClientTimezone({
  clientTimezone,
  date,
  specialistTimezone,
}: {
  clientTimezone: string;
  date: Date;
  specialistTimezone: string;
}) {
  return {
    clientDisplayTime: formatInTimezone(date, clientTimezone),
    clientTimezone,
    specialistDisplayTime: formatInTimezone(date, specialistTimezone),
    specialistTimezone,
  };
}

