import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Settings as SettingsIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useUserPreferencesStore } from '../store/useUserPreferencesStore';
import i18n from '../i18n';

export const DashboardHeader = () => {
    const totalMonthly = useSubscriptionStore((state) => state.getTotalMonthlyExpense());
    const totalYearly = useSubscriptionStore((state) => state.getTotalYearlyExpense());
    const { currency, language } = useUserPreferencesStore(); // Subscribe to language for re-renders
    const router = useRouter();

    // Force re-render when language changes is handled by the hook subscription above.
    // i18n.t() will now use the updated locale because store updates i18n.locale.

    return (
        <View className="mb-6 mt-2 pt-4 flex-row justify-between items-start">
            <View>
                <Text className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                    {i18n.t('totalMonthly')}
                </Text>
                <View className="flex-row items-baseline mb-2">
                    <Text className="text-5xl font-bold text-white mr-1">{currency}</Text>
                    <Text className="text-5xl font-bold text-white">
                        {totalMonthly.toFixed(2)}
                    </Text>
                </View>

                <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                    {i18n.t('totalYearly')}
                </Text>
                <View className="flex-row items-baseline">
                    <Text className="text-xl font-semibold text-slate-300 mr-1">{currency}</Text>
                    <Text className="text-xl font-semibold text-slate-300">
                        {totalYearly.toFixed(2)}
                    </Text>
                </View>
            </View>

            <View>
                <TouchableOpacity
                    onPress={() => router.push('/settings')}
                    className="p-2 bg-slate-800 rounded-full border border-slate-700"
                >
                    <SettingsIcon size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
