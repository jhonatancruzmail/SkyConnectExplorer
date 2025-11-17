import { AirportApiData, Airport } from '@/types/airport';
import { normalizeSearchString } from '@/shared/utils/formatUtils';

/**
 * Convert the external API payload into the app's Airport objects.
 * This keeps field mappings explicit and easy to reason about.
 *
 * @param apiData - Data returned by the external API
 * @returns An array of `Airport` objects ready for the UI/store
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
 * Filter airports using a human-friendly search string.
 * Matches against name, city, country and IATA code.
 * If the query is empty, the original list is returned unchanged.
 *
 * @param airports - Array of airports to filter
 * @param query - Search text
 * @returns The filtered array of airports
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

