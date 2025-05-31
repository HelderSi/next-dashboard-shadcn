import { randomBytes } from "crypto";
import { cleanText } from "./text";

export function generateSlug(input: string): string {
    return input
        .normalize("NFD")                    // Remove acentos
        .replace(/[\u0300-\u036f]/g, "")    // Regex para limpar os acentos
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")       // Remove caracteres especiais
        .replace(/\s+/g, "-")               // Substitui espaços por hífen
        .replace(/-+/g, "-");               // Remove múltiplos hífens seguidos
}

export function generateKeywords(text: string = ""): string[] {
    if (!text) return [];

    // Remove punctuation
    const cleanedText = cleanText(text);

    // Split into words
    const words = cleanedText.split(/\s+/);

    // Generate substrings (n-grams) to match partial searches
    const keywordSet = new Set<string>();

    const shortedText = cleanedText.substring(0, 15);
    for (let i = 1; i <= shortedText.length; i++) {
        keywordSet.add(shortedText.substring(0, i));
    }

    // Add individual words
    words.forEach(word => keywordSet.add(word));

    // Generate n-grams (prefix search for individual words)
    words.forEach(word => {
        for (let i = 1; i <= word.length; i++) {
            keywordSet.add(word.substring(0, i)); // Prefixes (autocomplete effect)
        }
    });

    // Generate full-sequence phrases
    for (let i = 0; i < words.length; i++) {
        let phrase = words[i];
        keywordSet.add(phrase);
        for (let j = i + 1; j < words.length; j++) {
            phrase += " " + words[j];
            keywordSet.add(phrase); // Add "Joao Maria", "Joao Maria Jose"
        }
    }

    // Remove all single-letter entries
    [...keywordSet].forEach(value => {
        if (value.length === 1) {
            keywordSet.delete(value);
        }
    });
    // add just the initial letter
    keywordSet.add(cleanedText[0][0]) // joao -> "j" para buscar pela inicial

    return Array.from(keywordSet);
}


export function generateUrlSafeKey(bytes = 32) {
    // 32 bytes → 256 bits of entropy
    return randomBytes(bytes).toString("base64url");
}