import { AirportApiData, Airport } from '@/types/airport';
import { normalizeSearchString } from '@/shared/utils/formatUtils';

/**
 * @param apiData - Datos de la API
 * @returns Aeropuertos transformados al modelo de dominio
 */
export function transformApiDataToAirports(apiData: AirportApiData): Airport[] {
  return apiData.data.map((airport) => ({
    name: airport.airport_name,
    city: airport.city_iata_code,
    country: airport.country_name || "Unknown",
    iataCode: airport.iata_code,
    icaoCode: airport.icao_code,
    countryCode: airport.country_iso2,
    latitude: airport.latitude,
    longitude: airport.longitude,
    timezone: airport.timezone,
    phoneNumber: airport.phone_number,
    gmt: airport.gmt,
    geonameId: airport.geoname_id
  }));
}

/**
 * @param airports - Aeropuertos a filtrar
 * @param query - Query de búsqueda
 * @returns Aeropuertos filtrados
 */
export function filterAirports(airports: Airport[], query: string): Airport[] {
  if (!query.trim()) return airports;

  const normalizedQuery = normalizeSearchString(query);
  return airports.filter(
    (airport) =>
      normalizeSearchString(airport.name).includes(normalizedQuery) ||
      normalizeSearchString(airport.city).includes(normalizedQuery) ||
      normalizeSearchString(airport.country).includes(normalizedQuery) ||
      normalizeSearchString(airport.iataCode).includes(normalizedQuery)
  );
}

