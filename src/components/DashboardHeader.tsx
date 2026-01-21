import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Info } from 'lucide-react-native';
import { AboutModal } from './AboutModal';
import { useSubscriptionStore } from '../store/useSubscriptionStore';

export const DashboardHeader = () => {
    const totalMonthly = useSubscriptionStore((state) => state.getTotalMonthlyExpense());
    const [showAbout, setShowAbout] = React.useState(false);

    return (
        <View className="mb-6 mt-2 pt-4 flex-row justify-between items-start">
            <View>
                <Text className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                    Total Monthly Expense
                </Text>
                <View className="flex-row items-baseline">
                    <Text className="text-5xl font-bold text-white mr-1">$</Text>
                    <Text className="text-5xl font-bold text-white">
                        {totalMonthly.toFixed(2)}
                    </Text>
                </View>
            </View>

            <View>
                <TouchableOpacity
                    onPress={() => setShowAbout(true)}
                    className="p-2 bg-slate-800 rounded-full border border-slate-700"
                >
                    <Info size={20} color="#94a3b8" />
                </TouchableOpacity>
                <AboutModal visible={showAbout} onClose={() => setShowAbout(false)} />
            </View>
        </View>
    );
};
