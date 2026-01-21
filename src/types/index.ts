export interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: string;
    billingCycle: 'weekly' | 'monthly' | 'yearly';
    startDate: string; // ISO Date String
    isFreeTrial: boolean;
    trialEndDate?: string; // ISO Date String
    remindMe: boolean;
    color?: string;
    notificationIds?: string[]; // IDs of scheduled notifications
}
