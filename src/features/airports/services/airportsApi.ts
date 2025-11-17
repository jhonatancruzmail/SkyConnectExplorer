import { Airport } from '@/types/airport';

/**
 * Get all airports from the `/api/airports` endpoint.
 * The cache is now handled directly in the Zustand store with expiration.
 *
 * @returns An object with `{ airports, total }`.
 * @throws When the request fails.
 */
export async function fetchAllAirports(): Promise<{ airports: Airport[]; total: number }> {
  try {
    const response = await fetch('/api/airports', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const { airports, total } = await response.json();
    return { airports, total };
  } catch (error) {
    console.error('Error fetching airports from API route:', error);
    throw error;
  }
}
