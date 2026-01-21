import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';
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
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
    persist(
        (set) => ({
            currency: '$',
            language: 'en',
            isBiometricEnabled: true,
            hasCompletedOnboarding: false,
            exchangeRates: { USD: 1, EUR: 0.92, GBP: 0.79, TRY: 30 },

            setLanguage: (language) => {
                i18n.locale = language;
                set({ language });
            },
            setCurrency: (currency) => set({ currency }),
            setBiometricEnabled: (enabled) => set({ isBiometricEnabled: enabled }),
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
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
            onRehydrateStorage: () => (state) => {
                if (state) {
                    i18n.locale = state.language;
                }
            },
        }
    )
);
