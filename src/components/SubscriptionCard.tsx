import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Subscription } from '../types';
import { format } from 'date-fns';
import { Trash2, AlertCircle } from 'lucide-react-native';

interface Props {
    subscription: Subscription;
    onDelete: () => void;
}

export const SubscriptionCard: React.FC<Props> = ({ subscription, onDelete }) => {
    const isTrialEndingSoon = () => {
        if (!subscription.isFreeTrial || !subscription.trialEndDate) return false;
        const now = new Date();
        const endDate = new Date(subscription.trialEndDate);
        const diffHours = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffHours < 48 && diffHours > 0;
    };

    const getNextBilling = () => {
        if (subscription.isFreeTrial && subscription.trialEndDate) {
            return `Trials ends: ${format(new Date(subscription.trialEndDate), 'MMM dd, yyyy')}`;
        }
        // Simple logic for display, rigorous calculation can be added
        return `Billing: ${subscription.billingCycle}`;
    };

    return (
        <View
            className={`p-4 mb-3 rounded-xl bg-slate-800 flex-row justify-between items-center ${subscription.isFreeTrial ? 'border-2 border-amber-500' : 'border border-slate-700'}`}
        >
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-bold text-white mr-2">{subscription.name}</Text>
                    {subscription.isFreeTrial && (
                        <View className="bg-amber-500/20 px-2 py-0.5 rounded-full">
                            <Text className="text-amber-500 text-xs font-bold">FREE TRIAL</Text>
                        </View>
                    )}
                </View>

                <Text className="text-slate-400 text-sm mb-1">{getNextBilling()}</Text>

                {isTrialEndingSoon() && (
                    <View className="flex-row items-center mt-1">
                        <AlertCircle size={14} color="#f59e0b" />
                        <Text className="text-amber-500 text-xs ml-1 font-semibold">Expiring Soon!</Text>
                    </View>
                )}
            </View>

            <View className="items-end">
                <Text className="text-xl font-bold text-white">
                    {subscription.currency}{subscription.price}
                </Text>
                <Text className="text-slate-500 text-xs uppercase">{subscription.billingCycle}</Text>

                <TouchableOpacity
                    onPress={onDelete}
                    className="mt-3 p-2 bg-slate-700/50 rounded-full"
                >
                    <Trash2 size={16} color="#94a3b8" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
