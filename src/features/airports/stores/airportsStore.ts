"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Airport } from '@/types/airport';
import { fetchAllAirports } from '../services/airportsApi';
import { filterAirports } from '../services/airportsService';

interface SearchHistoryItem {
	query: string;
	timestamp: number;
}

/**
 * Cache duration for airports: 24 hours.
 * Airport data changes infrequently, so 24 hours is enough to keep the data fresh while avoiding unnecessary API calls.
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Clean old localStorage variables that were used before migrating to Zustand persist.
 * This avoids conflicts and frees up space in localStorage.
 */
function cleanupOldLocalStorageCache(): void {
	if (typeof window === 'undefined') return;

	try {
		// clean old cache keys in localStorage
		localStorage.removeItem('airports_cache');
		localStorage.removeItem('airports_cache_timestamp');
	} catch (error) {
		console.warn('Error al limpiar caché antiguo de localStorage:', error);
	}
}

/**
 * Airports Zustand store.
 * Keeps `allAirports` (cached list), `filteredAirports` (current filtered result),
 * and helpers to load data and paginate results.
 * 
 * The airports cache is persisted in localStorage with a 24 hour expiration.
 * The search history is also persisted to maintain searches between sessions.
 */
interface AirportsState {
	allAirports: Airport[];
	filteredAirports: Airport[];
	isLoading: boolean;
	error: Error | null;
	searchQuery: string;
	totalAirports: number;
	searchHistory: SearchHistoryItem[];
	airportsCacheTimestamp: number | null;
	loadAllAirports: () => Promise<void>;
	setSearchQuery: (query: string) => void;
	addToSearchHistory: (query: string) => void;
	clearSearchHistory: () => void;
	clearError: () => void;
	getAirportsForPage: (page: number, itemsPerPage: number) => Airport[];
	getTotalPages: (itemsPerPage: number) => number;
	isCacheValid: () => boolean;
}

const MAX_HISTORY_ITEMS = 10;

export const useAirportsStore = create<AirportsState>()(
	persist(
		(set, get) => {
		// clean old localStorage cache, i made it like that bc zustand was giving me errors when i was using the persist,
		//  but rn its fixed those problems so this is necessary to avoid conflicts with the persist.
		if (typeof window !== 'undefined') {
			cleanupOldLocalStorageCache();
		}

		return {
			allAirports: [],
			filteredAirports: [],
			isLoading: false,
			error: null,
			searchQuery: '',
			totalAirports: 6711,
			searchHistory: [],
			airportsCacheTimestamp: null,

			isCacheValid: () => {
				const state = get();
				if (!state.airportsCacheTimestamp || state.allAirports.length === 0) {
					return false;
				}
				const now = Date.now();
				const age = now - state.airportsCacheTimestamp;
				return age < CACHE_DURATION;
			},

			loadAllAirports: async () => {
				const state = get();

				// if there are data and the cache is valid, only filter
				if (state.allAirports.length > 0 && state.isCacheValid()) {
					const filtered = filterAirports(state.allAirports, state.searchQuery);
					set({ filteredAirports: filtered });
					return;
				}

				// if the cache expired, clean the data
				if (!state.isCacheValid() && state.allAirports.length > 0) {
					set({
						allAirports: [],
						airportsCacheTimestamp: null,
						filteredAirports: []
					});
				}

				set({ isLoading: true, error: null });

				try {
					const { airports, total } = await fetchAllAirports();
					const currentState = get();
					const filtered = filterAirports(airports, currentState.searchQuery);

					set({
						allAirports: airports,
						filteredAirports: filtered,
						totalAirports: total,
						airportsCacheTimestamp: Date.now(),
						isLoading: false,
						error: null,
					});
				} catch (error) {
					console.error('Error en store al cargar aeropuertos:', error);
					set({
						isLoading: false,
						error: error instanceof Error ? error : new Error('Error desconocido'),
					});
				}
			},

			setSearchQuery: (query: string) => {
				const state = get();
				const filtered = filterAirports(state.allAirports, query);

				set({
					searchQuery: query,
					filteredAirports: filtered,
				});
			},

			addToSearchHistory: (query: string) => {
				const trimmedQuery = query.trim();
				if (!trimmedQuery) return;

				const state = get();

				// Avoid duplicates and add to the beginning
				const filteredHistory = state.searchHistory.filter(
					(item) => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
				);

				const newHistory: SearchHistoryItem[] = [
					{ query: trimmedQuery, timestamp: Date.now() },
					...filteredHistory,
				].slice(0, MAX_HISTORY_ITEMS);

				set({ searchHistory: newHistory });
			},

			clearSearchHistory: () => {
				set({ searchHistory: [] });
			},

			getAirportsForPage: (page: number, itemsPerPage: number) => {
				const state = get();
				const startIndex = (page - 1) * itemsPerPage;
				const endIndex = startIndex + itemsPerPage;

				if (state.searchQuery.trim()) {
					return state.filteredAirports.slice(startIndex, endIndex);
				}

				return state.allAirports.slice(startIndex, endIndex);
			},

			getTotalPages: (itemsPerPage: number) => {
				const state = get();

				if (state.searchQuery.trim()) {
					return Math.ceil(state.filteredAirports.length / itemsPerPage);
				}

				return Math.ceil(state.totalAirports / itemsPerPage);
			},

			clearError: () => {
				set({ error: null });
			},
		};
		},
		{
			name: 'airports-store',
			partialize: (state) => ({
				// persist only the necessary: airports, timestamp and history
				// don't persist filteredAirports because its duplicated data that can be recalculated dynamically without losing performance
				allAirports: state.allAirports,
				totalAirports: state.totalAirports,
				airportsCacheTimestamp: state.airportsCacheTimestamp,
				searchHistory: state.searchHistory,
			}),
		}
	)
);
