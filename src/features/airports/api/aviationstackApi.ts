import { AirportApiData } from '@/types/airport';

const AVIATIONSTACK_API_URL = 'https://api.aviationstack.com/v1/airports'; // Aviationstack API URL. Not stored in env because it's unlikely to change.

export interface AviationstackApiResponse {
    data: AirportApiData;
    total: number;
}

/**
 * Fetch airports from the Aviationstack API.
 * Provide your API key and optional `offset`/`limit` for pagination.
 * The function validates responses and throws readable errors when something goes wrong.
 *
 * @param apiKey - Aviationstack API key
 * @param offset - Pagination offset (optional)
 * @param limit - Max records to return (optional)
 * @returns An object with `data` and `total` count
 * @throws Error with helpful message if the call fails or returns unexpected content
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