import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSubscriptionStore } from '../src/store/useSubscriptionStore';
import { useUserPreferencesStore } from '../src/store/useUserPreferencesStore';
import { SubscriptionCard } from '../src/components/SubscriptionCard';
import { DashboardHeader } from '../src/components/DashboardHeader';
import { OnboardingModal } from '../src/components/OnboardingModal';
import { AnalyticsChart } from '../src/components/AnalyticsChart';
import { Subscription } from '../src/types';
import i18n from '../src/i18n';

export default function Dashboard() {
    const router = useRouter();
    const { subscriptions, deleteSubscription } = useSubscriptionStore();
    const { currency, language } = useUserPreferencesStore(); // Subscribe to language

    const handleAddPress = () => {
        router.push('/add' as any);
    };

    const handleDelete = (id: string) => {
        // In a real app, confirm before delete
        deleteSubscription(id);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900 px-5">
            <DashboardHeader />
            <AnalyticsChart />
            <OnboardingModal />

            <FlatList
                data={subscriptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        subscription={item}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-slate-500 text-lg">{i18n.t('welcome')}</Text>
                        <Text className="text-slate-600">{i18n.t('addSubscription')} +</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                onPress={handleAddPress}
                className="absolute bottom-8 right-6 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg active:scale-95"
            >
                <Plus color="white" size={32} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
