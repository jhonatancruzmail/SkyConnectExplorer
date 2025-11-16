import { Airport } from '@/types/airport';
import { fetchAirportsFromAviationstack } from '../api/aviationstackApi';
import { transformApiDataToAirports } from './airportsService';

const isDevelopment = process.env.NODE_ENV === 'development';
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

interface ServerCache {
	airports: Airport[];
	total: number;
	timestamp: number;
}

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

async function loadAllAirportsToCache(): Promise<ServerCache> {
	if (serverCache) {
		return serverCache;
	}

	try {
		const apiKey = process.env.AVIATIONSTACK_API_KEY;

		if (!apiKey) {
			const mockData = await loadMockData();
			if (mockData) {
				console.warn('[Server Cache] AVIATIONSTACK_API_KEY no configurada, usando datos mock (solo en desarrollo)');
				serverCache = {
					airports: mockData.airports,
					total: mockData.total,
					timestamp: Date.now()
				};
				return serverCache;
			}
			throw new Error('AVIATIONSTACK_API_KEY no configurada. Se requiere una API key en producción.');
		}

		// Cargar 10,000 aeropuertos en la primera llamada para evitar múltiples requests
		const { data: apiData, total } = await fetchAirportsFromAviationstack(apiKey, 0, 10000);
		const airports = transformApiDataToAirports(apiData);

		serverCache = {
			airports,
			total,
			timestamp: Date.now()
		};

		console.log(`[Server Cache] Cargados ${airports.length} aeropuertos en cache del servidor`);
		return serverCache;
	} catch (error) {
		console.error('[Server Cache] Error fetching all airports from API:', error);

		const mockData = await loadMockData();
		if (mockData) {
			console.warn('[Server Cache] Usando datos mock como fallback (solo en desarrollo)');
			serverCache = {
				airports: mockData.airports,
				total: mockData.total,
				timestamp: Date.now()
			};
			return serverCache;
		}

		throw error;
	}
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

