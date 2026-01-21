import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '../types';

interface SubscriptionState {
    subscriptions: Subscription[];
    addSubscription: (subscription: Subscription) => void;
    updateSubscription: (id: string, updatedSub: Partial<Subscription>) => void;
    deleteSubscription: (id: string) => void;
    getTotalMonthlyExpense: () => number;
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
                return subscriptions.reduce((total, sub) => {
                    let monthlyCost = sub.price;
                    if (sub.billingCycle === 'weekly') {
                        monthlyCost = sub.price * 4.33; // Approx weeks in month
                    } else if (sub.billingCycle === 'yearly') {
                        monthlyCost = sub.price / 12;
                    }
                    return total + monthlyCost;
                }, 0);
            },
        }),
        {
            name: 'subscription-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
