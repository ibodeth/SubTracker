export type Category = 'Entertainment' | 'Personal' | 'Utilities' | 'Work' | 'Other';

export interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: string;
    billingCycle: 'weekly' | 'monthly' | 'yearly';
    startDate: string; // ISO Date String
    category: Category;
    isFreeTrial: boolean;
    trialEndDate?: string;
    remindMe: boolean;
    cancellationUrl?: string;
    themeColor?: string; // e.g., #E50914 for Netflix
    notificationIds?: string[];
}

export type SortOption = 'name' | 'price' | 'date';

export interface UserPreferences {
    currency: string;
    language: string;
    isBiometricEnabled: boolean;
    hasCompletedOnboarding: boolean;
    sortOption: SortOption;
    filterCategory: Category | 'All';
}
