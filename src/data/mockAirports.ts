import { AirportApiData, Airport } from '@/types/airport';

// Minimal example mock based on the API structure.
// Contains only 1 airport as a fallback.
// Real data must be obtained using your own API key.
export const mockApiResponse = {
  pagination: {
    offset: 0,
    limit: 1,
    count: 1,
    total: 1,
  },
  data: [
    {
      id: "aaaaaaaaa",
      gmt: "-10",
      airport_id: "1",
      iata_code: "unknown",
      city_iata_code: "unknown",
      icao_code: "unknown",
      country_iso2: "unknown",
      geoname_id: "unknown",
      latitude: "unknown",
      longitude: "unknown",
      airport_name: "unknown",
      country_name: "unknown",
      phone_number: null,
      timezone: "unknown"
    }
  ]
} as unknown as AirportApiData;

export const mockAirports: Airport[] = mockApiResponse.data.map((airport) => ({
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
})) as Airport[];