export const languageOptions = [
  "Arabic",
  "Bulgarian",
  "Chinese",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Estonian",
  "Finnish",
  "French",
  "German",
  "Greek",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Italian",
  "Japanese",
  "Korean",
  "Latvian",
  "Lithuanian",
  "Norwegian",
  "Polish",
  "Portuguese",
  "Romanian",
  "Russian",
  "Serbian",
  "Slovak",
  "Slovenian",
  "Spanish",
  "Swedish",
  "Turkish",
  "Ukrainian",
] as const;

export function normalizeLanguage(value: string) {
  const normalizedValue = value.trim().toLowerCase();

  return (
    languageOptions.find(
      (language) => language.toLowerCase() === normalizedValue,
    ) ?? null
  );
}

export function normalizeLanguageList(values: string[]) {
  return values.reduce<string[]>((languages, value) => {
    const language = normalizeLanguage(value);

    if (language && !languages.includes(language)) {
      languages.push(language);
    }

    return languages;
  }, []);
}

