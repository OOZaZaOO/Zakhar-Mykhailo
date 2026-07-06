function getZonedParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: timezone,
    year: "numeric",
  }).formatToParts(date);

  const valueByType = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    day: Number(valueByType.day),
    hour: Number(valueByType.hour),
    minute: Number(valueByType.minute),
    month: Number(valueByType.month),
    second: Number(valueByType.second),
    year: Number(valueByType.year),
  };
}

function getTimezoneOffsetMs(date: Date, timezone: string) {
  const parts = getZonedParts(date, timezone);
  const zonedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return zonedAsUtc - date.getTime();
}

export function zonedDateTimeToUtc({
  date,
  time,
  timezone,
}: {
  date: string;
  time: string;
  timezone: string;
}) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const firstOffset = getTimezoneOffsetMs(utcGuess, timezone);
  const firstUtc = new Date(utcGuess.getTime() - firstOffset);
  const refinedOffset = getTimezoneOffsetMs(firstUtc, timezone);

  return new Date(utcGuess.getTime() - refinedOffset);
}

export function utcToZonedDateTime({
  isoString,
  timezone,
}: {
  isoString: string;
  timezone: string;
}) {
  const parts = getZonedParts(new Date(isoString), timezone);

  return {
    date: `${parts.year.toString().padStart(4, "0")}-${parts.month
      .toString()
      .padStart(2, "0")}-${parts.day.toString().padStart(2, "0")}`,
    time: `${parts.hour.toString().padStart(2, "0")}:${parts.minute
      .toString()
      .padStart(2, "0")}`,
  };
}
