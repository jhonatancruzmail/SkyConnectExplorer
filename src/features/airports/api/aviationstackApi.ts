import { AirportApiData } from '@/types/airport';

const AVIATIONSTACK_API_URL = 'https://api.aviationstack.com/v1/airports'; // URL de la API de Aviationstack, no es una variable de entorno porque no veo necesidad de cambiarla.

export interface AviationstackApiResponse {
    data: AirportApiData;
    total: number;
}

/**
 * @param apiKey - API key de Aviationstack
 * @param offset - Offset para paginación (opcional)
 * @param limit - Límite de resultados (opcional)
 * @returns Datos de la API y total de aeropuertos
 * @throws Error si la llamada falla
 */
export async function fetchAirportsFromAviationstack(
    apiKey: string,
    offset?: number,
    limit?: number
): Promise<AviationstackApiResponse> {
    const url = new URL(AVIATIONSTACK_API_URL);
    url.searchParams.append('access_key', apiKey);

    if (offset !== undefined) {
        url.searchParams.append('offset', offset.toString());
    }

    if (limit !== undefined) {
        url.searchParams.append('limit', limit.toString());
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Error desconocido');
        throw new Error(`Aviationstack API error: ${response.status} ${response.statusText}. ${errorText.substring(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Aviationstack API devolvió ${contentType || 'tipo desconocido'} en lugar de JSON. Posible API key inválida. Respuesta: ${text.substring(0, 200)}`);
    }

    const apiData: AirportApiData = await response.json();

    return {
        data: apiData,
        total: apiData.pagination.total,
    };
}