/**
 * Return the given value or a friendly fallback if the value is missing.
 *
 * @param value - Value to check
 * @param defaultValue - Fallback text (default: "Not available")
 * @returns The original value when present, otherwise the fallback text
 */
export function getValueOrNotFound(
    value: string | null | undefined,
    defaultValue: string = "Not available"
): string {
    return value || defaultValue;
}

/**
 * Format a Date into a readable local string: `dd/month/yyyy, hh:mm:ss`.
 * Month names are in Spanish to match the app locale.
 *
 * @param date - Date instance to format
 * @returns Human-friendly date/time string
 */
export function formatLocalDateTime(date: Date): string {
    const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.getMonth().toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

/**
 * Normalize a string for search: lowercase + trim. Safely handles null/undefined.
 *
 * @param value - Value to normalize
 * @returns Normalized lowercase string, or empty string when input is null/undefined
 */
export function normalizeSearchString(value: string | null | undefined): string {
    return (value?.toLowerCase() || '').trim();
}


