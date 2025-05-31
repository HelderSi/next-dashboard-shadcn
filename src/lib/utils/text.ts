export function cleanText(text: string) {
    // Normalize: Convert to lowercase and remove diacritics (accents)
    const normalizedText = text.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // Remove punctuation
    const cleanedText = normalizedText.replace(/[^\w\s]/g, "");
    return cleanedText
}