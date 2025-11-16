/**
 * Devuelve el valor proporcionado o un texto por defecto si el valor es null, undefined o vacío
 * @param value - Valor a verificar
 * @param defaultValue - Texto por defecto a mostrar si el valor no está disponible (por defecto: "No disponible")
 * @returns El valor si existe, o el texto por defecto
 */
export function getValueOrNotFound(
    value: string | null | undefined,
    defaultValue: string = "No disponible"
): string {
    return value || defaultValue;
}

/**
 * Formatea una fecha en formato español: dd/mes/año, hora:minuto:segundo
 * @param date - Fecha a formatear
 * @returns Fecha formateada en español
 */
export function formatLocalDateTime(date: Date): string {
    const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

/**
 * Normaliza un string para búsquedas (convierte a minúsculas y maneja valores null/undefined)
 * @param value - Valor a normalizar
 * @returns String normalizado en minúsculas o string vacío si el valor es null/undefined
 */
export function normalizeSearchString(value: string | null | undefined): string {
    return (value?.toLowerCase() || '').trim();
}


