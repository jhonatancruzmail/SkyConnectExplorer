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
 * Airports Zustand store.
 * Keeps `allAirports` (cached list), `filteredAirports` (current filtered result),
 * and helpers to load data and paginate results.
 * The `loadAllAirports()` action will fetch from the API route or local cache
 * and populate both `allAirports` and `filteredAirports`.
 * 
 * Also maintains a search history that persists in localStorage.
 */
interface AirportsState {
	allAirports: Airport[];
	filteredAirports: Airport[];
	isLoading: boolean;
	error: Error | null;
	searchQuery: string;
	totalAirports: number;
	searchHistory: SearchHistoryItem[];
	loadAllAirports: () => Promise<void>;
	setSearchQuery: (query: string) => void;
	addToSearchHistory: (query: string) => void;
	clearSearchHistory: () => void;
	clearError: () => void;
	getAirportsForPage: (page: number, itemsPerPage: number) => Airport[];
	getTotalPages: (itemsPerPage: number) => number;
}

const MAX_HISTORY_ITEMS = 10;

export const useAirportsStore = create<AirportsState>()(
	// Here I need the persist because I want the search history to be maintained between sessions, since it is important that the user often wants to search for the same thing as before.
	persist(
		(set, get) => ({
			allAirports: [],
			filteredAirports: [],
			isLoading: false,
			error: null,
			searchQuery: '',
			totalAirports: 6711,
			searchHistory: [],

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
		}),
		{
			name: 'airports-store',
			partialize: (state) => ({
				searchHistory: state.searchHistory,
			}),
		}
	)
);
