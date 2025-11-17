"use client";

import { create } from 'zustand';
import { Airport } from '@/types/airport';
import { fetchAllAirports } from '../services/airportsApi';
import { filterAirports } from '../services/airportsService';

/**
 * Airports Zustand store.
 * Keeps `allAirports` (cached list), `filteredAirports` (current filtered result),
 * and helpers to load data and paginate results.
 * The `loadAllAirports()` action will fetch from the API route or local cache
 * and populate both `allAirports` and `filteredAirports`.
 */
interface AirportsState {
	allAirports: Airport[];
	filteredAirports: Airport[];
	isLoading: boolean;
	error: Error | null;
	searchQuery: string;
	totalAirports: number;
	loadAllAirports: () => Promise<void>;
	setSearchQuery: (query: string) => void;
	clearError: () => void;
	getAirportsForPage: (page: number, itemsPerPage: number) => Airport[];
	getTotalPages: (itemsPerPage: number) => number;
}

export const useAirportsStore = create<AirportsState>((set, get) => ({
	allAirports: [],
	filteredAirports: [],
	isLoading: false,
	error: null,
	searchQuery: '',
	totalAirports: 6711,

	loadAllAirports: async () => {
		const state = get();

		if (state.allAirports.length > 0) {
			const filtered = filterAirports(state.allAirports, state.searchQuery);
			set({ filteredAirports: filtered });
			return;
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
}));
