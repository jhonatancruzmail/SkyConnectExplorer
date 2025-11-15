import { AirportApiData, Airport } from '@/types/airport';

/**
 * @param apiData - Datos de la API
 * @returns Aeropuertos transformados al modelo de dominio
 */
export function transformApiDataToAirports(apiData: AirportApiData): Airport[] {
  return apiData.data.map((airport) => ({
    name: airport.airport_name,
    city: airport.city_iata_code,
    country: airport.country_name || "Unknown",
    iataCode: airport.iata_code
  }));
}

/**
 * @param airports - Aeropuertos a filtrar
 * @param query - Query de búsqueda
 * @returns Aeropuertos filtrados
 */
export function filterAirports(airports: Airport[], query: string): Airport[] {
  if (!query.trim()) return airports;

  const lowerQuery = query.toLowerCase();
  return airports.filter(
    (airport) =>
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.city.toLowerCase().includes(lowerQuery) ||
      airport.country.toLowerCase().includes(lowerQuery) ||
      airport.iataCode.toLowerCase().includes(lowerQuery)
  );
}

