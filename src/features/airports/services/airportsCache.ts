import { Airport } from '@/types/airport';

const CACHE_DURATION = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'airports_cache';
const STORAGE_TIMESTAMP_KEY = 'airports_cache_timestamp';

export const ENABLE_CACHE = true;

export interface CachedAirports {
    airports: Airport[];
    total: number;
    timestamp: number;
}

/**
 * Try to read cached airports from localStorage.
 * Returns `null` when there is no cache or the cache has expired.
 *
 * @returns CachedAirports or null
 */
export function getCacheFromStorage(): CachedAirports | null {
    if (typeof window === 'undefined' || !ENABLE_CACHE) return null;

    try {
        const cachedData = localStorage.getItem(STORAGE_KEY);
        const cachedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);

        if (!cachedData || !cachedTimestamp) return null;

        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();

        if (now - timestamp > CACHE_DURATION) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
            return null;
        }

        const airports = JSON.parse(cachedData);
        return {
            airports,
            total: airports.length,
            timestamp
        };
    } catch (error) {
        console.error('Error reading cache from localStorage:', error);
        return null;
    }
}

/**
 * Save airports to localStorage along with a timestamp.
 * This is used to avoid refetching on subsequent visits within the cache window.
 *
 * @param airports - Airports to store in the cache
 */
export function saveCacheToStorage(airports: Airport[]): void {
    if (typeof window === 'undefined' || !ENABLE_CACHE) return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(airports));
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.error('Error saving cache to localStorage:', error);
    }
}


