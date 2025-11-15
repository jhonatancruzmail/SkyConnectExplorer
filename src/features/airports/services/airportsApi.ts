import { Airport } from '@/types/airport';
import { getCacheFromStorage, saveCacheToStorage } from './airportsCache';

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
