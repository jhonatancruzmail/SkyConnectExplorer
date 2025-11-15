import { AirportApiData } from '@/types/airport';

const AVIATIONSTACK_API_URL = 'http://api.aviationstack.com/v1/airports'; // URL de la API de Aviationstack, no es una variable de entorno porque no veo necesidad de cambiarla.

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
        throw new Error(`Aviationstack API error: ${response.status} ${response.statusText}`);
    }

    const apiData: AirportApiData = await response.json();

    return {
        data: apiData,
        total: apiData.pagination.total,
    };
}