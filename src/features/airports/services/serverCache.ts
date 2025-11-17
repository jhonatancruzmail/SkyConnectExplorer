import { Airport } from '@/types/airport';
import { fetchAirportsFromAviationstack } from '../api/aviationstackApi';
import { transformApiDataToAirports } from './airportsService';
import { unstable_cache } from 'next/cache';

const isDevelopment = process.env.NODE_ENV === 'development';
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

interface ServerCache {
	airports: Airport[];
	total: number;
	timestamp: number;
}

// In-memory cache that's fast but volatile - gets cleared on cold starts
// When the function is warm, this gives us instant access without disk I/O
let serverCache: ServerCache | null = null;
let isLoading = false;
let loadPromise: Promise<ServerCache> | null = null;

async function loadMockData(): Promise<{ airports: Airport[]; total: number } | null> {
	if (!isDevelopment || !useMockData) {
		return null;
	}

	try {
		const mockModule = await import('@/data/mockAirports');
		return {
			airports: mockModule.mockAirports,
			total: mockModule.mockApiResponse.pagination.total
		};
	} catch (error) {
		console.error('Error loading mock data:', error);
		return null;
	}
}

async function fetchAirportsData(): Promise<ServerCache> {
	const apiKey = process.env.AVIATIONSTACK_API_KEY;

	if (!apiKey) {
		const mockData = await loadMockData();
		if (mockData) {
			console.warn('[Server Cache] AVIATIONSTACK_API_KEY no configurada, usando datos mock (solo en desarrollo)');
			return {
				airports: mockData.airports,
				total: mockData.total,
				timestamp: Date.now()
			};
		}
		throw new Error('AVIATIONSTACK_API_KEY no configurada. Se requiere una API key en producción.');
	}

	// Fetch all 10,000 airports in one call to minimize API requests
	const { data: apiData, total } = await fetchAirportsFromAviationstack(apiKey, 0, 10000);
	const airports = transformApiDataToAirports(apiData);

	return {
		airports,
		total,
		timestamp: Date.now()
	};
}

// Persistent cache that survives cold starts and works across multiple instances
// Airport data doesn't change often, so 24-hour revalidation keeps it fresh without unnecessary API calls
const getCachedAirportsData = unstable_cache(
	async (): Promise<ServerCache> => {
		try {
			const data = await fetchAirportsData();
			console.log(`[Server Cache] Cargados ${data.airports.length} aeropuertos en cache persistente`);
			return data;
		} catch (error) {
			console.error('[Server Cache] Error fetching all airports from API:', error);

			const mockData = await loadMockData();
			if (mockData) {
				console.warn('[Server Cache] Usando datos mock como fallback (solo en desarrollo)');
				return {
					airports: mockData.airports,
					total: mockData.total,
					timestamp: Date.now()
				};
			}

			throw error;
		}
	},
	['airports-cache'],
	{
		revalidate: 86400, // Refresh daily since airport data is relatively static
		tags: ['airports'] // Allows manual cache invalidation if needed
	}
);

async function loadAllAirportsToCache(): Promise<ServerCache> {
	// Check in-memory cache first - fastest option when function is warm
	if (serverCache) {
		return serverCache;
	}

	// Fall back to persistent cache (survives cold starts and works across instances)
	// Stored on disk, so it persists even when containers are destroyed
	const cachedData = await getCachedAirportsData();

	// Populate in-memory cache for faster subsequent requests in this container
	// Two-tier approach: fast memory when warm, persistent disk for cold starts
	serverCache = cachedData;

	return cachedData;
}

export async function getServerCachedAirports(): Promise<{ airports: Airport[]; total: number }> {
	if (serverCache) {
		return {
			airports: serverCache.airports,
			total: serverCache.total
		};
	}

	if (isLoading && loadPromise) {
		const cache = await loadPromise;
		return {
			airports: cache.airports,
			total: cache.total
		};
	}

	isLoading = true;
	loadPromise = loadAllAirportsToCache();

	try {
		const cache = await loadPromise;
		isLoading = false;
		return {
			airports: cache.airports,
			total: cache.total
		};
	} catch (error) {
		isLoading = false;
		loadPromise = null;
		throw error;
	}
}

export function clearServerCache(): void {
	serverCache = null;
	isLoading = false;
	loadPromise = null;
}

