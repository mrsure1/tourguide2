export type TourTranslationInput = Record<string, string | string[]>;

export type TourTranslationOutput = Record<string, string | string[]>;

export async function translateTourForm(fields: TourTranslationInput): Promise<TourTranslationOutput> {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("[translateTourForm] translation skipped:", data?.error || "unknown error");
      return {};
    }

    return (data.translations as TourTranslationOutput) || {};
  } catch (error) {
    console.warn("[translateTourForm] translation request failed, continuing without translation:", error);
    return {};
  }
}
