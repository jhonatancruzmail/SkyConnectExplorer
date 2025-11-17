import { Airport } from '@/types/airport';
import { getCacheFromStorage, saveCacheToStorage } from './airportsCache';

/**
 * Get all airports from the `/api/airports` endpoint.
 * First it checks a localStorage cache and returns it if available.
 * Otherwise it fetches from the API route and caches the result locally.
 *
 * @returns An object with `{ airports, total }`.
 * @throws When the network request fails.
 */
export async function fetchAllAirports(): Promise<{ airports: Airport[]; total: number }> {
  const cached = getCacheFromStorage();
  if (cached) {
    return { airports: cached.airports, total: cached.total };
  }

  try {
    const response = await fetch('/api/airports', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const { airports, total } = await response.json();

    saveCacheToStorage(airports);

    return { airports, total };
  } catch (error) {
    console.error('Error fetching airports from API route:', error);
    throw error;
  }
}
