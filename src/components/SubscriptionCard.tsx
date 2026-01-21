import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Subscription } from '../types';
import { format } from 'date-fns';
import { Trash2, AlertCircle } from 'lucide-react-native';
import i18n from '../i18n';
import { useRouter } from 'expo-router';

interface Props {
    subscription: Subscription;
    onDelete: () => void;
}

import { useUserPreferencesStore } from '../store/useUserPreferencesStore';

export const SubscriptionCard: React.FC<Props> = ({ subscription, onDelete }) => {
    const router = useRouter();
    const { currency: userCurrency, exchangeRates } = useUserPreferencesStore();

    // Helper for conversion display
    const getApproxPrice = () => {
        if (subscription.currency === userCurrency) return null;

        const symbolToCode: Record<string, string> = {
            '$': 'USD', '€': 'EUR', '£': 'GBP', '₺': 'TRY', '¥': 'JPY', 'CN¥': 'CNY'
        };

        const subCode = symbolToCode[subscription.currency] || 'USD';
        const userCode = symbolToCode[userCurrency] || 'USD';

        const rateSub = exchangeRates[subCode] || 1;
        const rateUser = exchangeRates[userCode] || 1;

        const converted = (subscription.price / rateSub) * rateUser;

        return `≈ ${userCurrency}${converted.toFixed(2)}`;
    };

    const isTrialEndingSoon = () => {
        if (!subscription.isFreeTrial || !subscription.trialEndDate) return false;
        const now = new Date();
        const endDate = new Date(subscription.trialEndDate);
        const diffHours = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffHours < 48 && diffHours > 0;
    };

    const getNextBilling = () => {
        if (subscription.isFreeTrial && subscription.trialEndDate) {
            return `${i18n.t('trialEndsOn')}: ${format(new Date(subscription.trialEndDate), 'MMM dd, yyyy')}`;
        }
        // Simple logic for display, rigorous calculation can be added
        return `${i18n.t('billing')}: ${i18n.t(subscription.billingCycle)}`;
    };

    const handlePress = () => {
        router.push(`/subscription/${subscription.id}` as any);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            className={`p-4 mb-3 rounded-xl bg-slate-800 flex-row justify-between items-center ${subscription.isFreeTrial ? 'border-2 border-amber-500' : 'border border-slate-700'}`}
        >
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-bold text-white mr-2">{subscription.name}</Text>
                    {subscription.isFreeTrial && (
                        <View className="bg-amber-500/20 px-2 py-0.5 rounded-full">
                            <Text className="text-amber-500 text-xs font-bold">{i18n.t('freeTrialBadge')}</Text>
                        </View>
                    )}
                </View>

                <Text className="text-slate-400 text-sm mb-1">{getNextBilling()}</Text>

                {isTrialEndingSoon() && (
                    <View className="flex-row items-center mt-1">
                        <AlertCircle size={14} color="#f59e0b" />
                        <Text className="text-amber-500 text-xs ml-1 font-semibold">{i18n.t('expiringSoon')}</Text>
                    </View>
                )}
            </View>

            <View className="items-end">
                <Text className="text-xl font-bold text-white">
                    {subscription.currency}{subscription.price}
                </Text>
                {getApproxPrice() && (
                    <Text className="text-slate-400 text-xs font-medium">
                        {getApproxPrice()}
                    </Text>
                )}
                <Text className="text-slate-500 text-xs uppercase">{i18n.t(subscription.billingCycle)}</Text>

                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="mt-3 p-2 bg-slate-700/50 rounded-full"
                >
                    <Trash2 size={16} color="#94a3b8" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};
