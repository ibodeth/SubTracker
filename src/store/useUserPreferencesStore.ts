import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, SortOption, Category } from '../types';
import i18n from '../i18n';
import { I18nManager } from 'react-native';
import { fetchExchangeRates } from '../services/exchangeRates';

interface UserPreferencesState extends UserPreferences {
    setLanguage: (language: string) => void;
    setCurrency: (currency: string) => void;
    setBiometricEnabled: (enabled: boolean) => void;
    completeOnboarding: () => void;
    exchangeRates: Record<string, number>; // New state
    updateExchangeRates: () => Promise<void>; // New action
    setSortOption: (option: SortOption) => void;
    setFilterCategory: (category: Category | 'All') => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
    persist(
        (set) => ({
            currency: '$',
            language: 'en',
            isBiometricEnabled: true,
            hasCompletedOnboarding: false,
            exchangeRates: {
                USD: 1, EUR: 0.92, GBP: 0.79, TRY: 30,
                CNY: 7.2, JPY: 150, AUD: 1.5, CAD: 1.35,
                CHF: 0.88, HKD: 7.8, NZD: 1.6, SEK: 10.5,
                KRW: 1330, SGD: 1.35, INR: 83, RUB: 90,
                BRL: 5, ZAR: 19
            },
            sortOption: 'date',
            filterCategory: 'All',

            setLanguage: (language) => {
                i18n.locale = language;
                set({ language });
            },
            setCurrency: (currency) => set({ currency }),
            setBiometricEnabled: (enabled) => set({ isBiometricEnabled: enabled }),
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            setSortOption: (option) => set({ sortOption: option }),
            setFilterCategory: (category) => set({ filterCategory: category }),
            updateExchangeRates: async () => {
                try {
                    const rates = await fetchExchangeRates('USD');
                    if (rates) {
                        set({ exchangeRates: rates });
                    }
                } catch (e) {
                    console.log('Failed to fetch rates', e);
                }
            }
        }),
        {
            name: 'user-preferences-storage',
            storage: createJSONStorage(() => AsyncStorage),
            merge: (persistedState: any, currentState) => {
                return {
                    ...currentState,
                    ...persistedState,
                    // Ensure exchangeRates is deeply merged or falls back to current (default) if missing
                    exchangeRates: persistedState?.exchangeRates || currentState.exchangeRates,
                };
            },
            onRehydrateStorage: () => (state) => {
                if (state) {
                    i18n.locale = state.language;
                }
            },
        }
    )
);
