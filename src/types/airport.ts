// Tipos para la API de Aviationstack
export interface AirportApiResponse {
    id: string;
    gmt: string | null;
    airport_id: string;
    iata_code: string;
    city_iata_code: string;
    icao_code: string;
    country_iso2: string;
    geoname_id: string;
    latitude: string;
    longitude: string;
    airport_name: string;
    country_name: string | null;
    phone_number: string | null;
    timezone: string;
}

// Tipo para los datos de la api de Aviationstack, este es el modelo que retorna la api.
export interface AirportApiData {
    pagination: {
        offset: number;
        limit: number;
        count: number;
        total: number;
    };
    data: AirportApiResponse[];
}

// Tipo para el modelo de dominio, este es el modelo que se usa en la aplicación.
export interface Airport {
    name: string;
    city: string;
    country: string;
    iataCode: string;
    icaoCode?: string;
    countryCode?: string;
    latitude?: string;
    longitude?: string;
    timezone?: string;
    phoneNumber?: string | null;
    gmt?: string | null;
    geonameId?: string;
}

// Parámetros para la búsqueda de aeropuertos, estos son los parametros que se pasan a la api de Aviationstack.
export interface FetchAirportsParams {
    offset?: number;
    limit?: number;
    search?: string;
}



