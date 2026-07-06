export function getQuarterHourTimeOptions() {
  const options: string[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 15) {
      options.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`,
      );
    }
  }

  return options;
}

export function isQuarterHourTime(value: string) {
  return getQuarterHourTimeOptions().includes(value);
}

export function compareTimes(firstTime: string, secondTime: string) {
  return firstTime.localeCompare(secondTime);
}

export function normalizeDatabaseTime(value: string) {
  return value.slice(0, 5);
}
