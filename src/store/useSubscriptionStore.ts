import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '../types';
import { useUserPreferencesStore } from './useUserPreferencesStore';

interface SubscriptionState {
    subscriptions: Subscription[];
    addSubscription: (subscription: Subscription) => void;
    updateSubscription: (id: string, updatedSub: Partial<Subscription>) => void;
    deleteSubscription: (id: string) => void;
    getTotalMonthlyExpense: () => number;
    getTotalYearlyExpense: () => number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set, get) => ({
            subscriptions: [],
            addSubscription: (subscription) =>
                set((state) => ({ subscriptions: [...state.subscriptions, subscription] })),
            updateSubscription: (id, updatedSub) =>
                set((state) => ({
                    subscriptions: state.subscriptions.map((sub) =>
                        sub.id === id ? { ...sub, ...updatedSub } : sub
                    ),
                })),
            deleteSubscription: (id) =>
                set((state) => ({
                    subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
                })),
            getTotalMonthlyExpense: () => {
                const { subscriptions } = get();
                const { currency: userCurrency, exchangeRates } = useUserPreferencesStore.getState();

                // Map symbols to ISO codes
                const symbolToCode: Record<string, string> = {
                    '$': 'USD', '€': 'EUR', '£': 'GBP', '₺': 'TRY', '¥': 'JPY', 'CN¥': 'CNY'
                };
                const userCurrencyCode = symbolToCode[userCurrency] || 'USD';

                return subscriptions.reduce((total, sub) => {
                    if (sub.isFreeTrial) return total;

                    let monthlyCost = sub.price;
                    if (sub.billingCycle === 'weekly') monthlyCost = sub.price * 4.33;
                    else if (sub.billingCycle === 'yearly') monthlyCost = sub.price / 12;

                    // Conversion Logic
                    const subCurrencyCode = symbolToCode[sub.currency] || 'USD';
                    if (subCurrencyCode !== userCurrencyCode) {
                        const rateSub = exchangeRates[subCurrencyCode] || 1;
                        const rateUser = exchangeRates[userCurrencyCode] || 1;
                        // Convert sub -> USD -> User
                        // PriceInUSD = Price / RateSub
                        // PriceInUser = PriceInUSD * RateUser
                        monthlyCost = (monthlyCost / rateSub) * rateUser;
                    }

                    return total + monthlyCost;
                }, 0);
            },
            getTotalYearlyExpense: () => {
                const { subscriptions } = get();
                const { currency: userCurrency, exchangeRates } = useUserPreferencesStore.getState();
                const symbolToCode: Record<string, string> = {
                    '$': 'USD', '€': 'EUR', '£': 'GBP', '₺': 'TRY', '¥': 'JPY', 'CN¥': 'CNY'
                };
                const userCurrencyCode = symbolToCode[userCurrency] || 'USD';

                return subscriptions.reduce((total, sub) => {
                    if (sub.isFreeTrial) return total;

                    let yearlyCost = sub.price;
                    if (sub.billingCycle === 'weekly') yearlyCost = sub.price * 52;
                    else if (sub.billingCycle === 'monthly') yearlyCost = sub.price * 12;

                    // Conversion Logic
                    const subCurrencyCode = symbolToCode[sub.currency] || 'USD';
                    if (subCurrencyCode !== userCurrencyCode) {
                        const rateSub = exchangeRates[subCurrencyCode] || 1;
                        const rateUser = exchangeRates[userCurrencyCode] || 1;
                        yearlyCost = (yearlyCost / rateSub) * rateUser;
                    }

                    return total + yearlyCost;
                }, 0);
            },
        }),
        {
            name: 'subscription-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
