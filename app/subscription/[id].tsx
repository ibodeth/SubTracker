import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ExternalLink, Calendar, CreditCard, Tag } from 'lucide-react-native';
import { useSubscriptionStore } from '../../src/store/useSubscriptionStore';
import i18n from '../../src/i18n';
import { format } from 'date-fns';

export default function SubscriptionDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const subscription = useSubscriptionStore((state) =>
        state.subscriptions.find((s) => s.id === id)
    );

    if (!subscription) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
                <Text className="text-white">Subscription not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-blue-500">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleCancelPress = () => {
        if (subscription.cancellationUrl) {
            Linking.openURL(subscription.cancellationUrl);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <View className="px-5 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold flex-1">{subscription.name}</Text>
            </View>

            <ScrollView className="flex-1 px-5">
                <View
                    className="p-6 rounded-3xl mb-6 items-center shadow-lg"
                    style={{ backgroundColor: subscription.themeColor || '#1e293b' }}
                >
                    <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
                        <Text className="text-4xl font-bold text-white">
                            {subscription.name.charAt(0)}
                        </Text>
                    </View>
                    <Text className="text-3xl font-bold text-white mb-1">
                        {subscription.currency}{subscription.price}
                    </Text>
                    <Text className="text-white/80 font-medium uppercase tracking-widest">
                        {i18n.t(subscription.billingCycle)}
                    </Text>
                </View>

                <View className="bg-slate-800 rounded-2xl p-4 mb-6 space-y-4">
                    <View className="flex-row items-center border-b border-slate-700 pb-4 mb-4">
                        <Tag color="#94a3b8" size={20} />
                        <View className="ml-3 flex-1">
                            <Text className="text-slate-400 text-sm">{i18n.t('category')}</Text>
                            <Text className="text-white font-medium">{subscription.category || 'Other'}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center border-b border-slate-700 pb-4 mb-4">
                        <Calendar color="#94a3b8" size={20} />
                        <View className="ml-3 flex-1">
                            <Text className="text-slate-400 text-sm">Start Date</Text>
                            <Text className="text-white font-medium">
                                {format(new Date(subscription.startDate), 'MMM dd, yyyy')}
                            </Text>
                        </View>
                    </View>

                    {subscription.isFreeTrial && (
                        <View className="flex-row items-center">
                            <Calendar color="#f59e0b" size={20} />
                            <View className="ml-3 flex-1">
                                <Text className="text-amber-500 text-sm font-bold">{i18n.t('trialEndsOn')}</Text>
                                <Text className="text-white font-medium">
                                    {subscription.trialEndDate ? format(new Date(subscription.trialEndDate), 'MMM dd, yyyy') : '-'}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {subscription.cancellationUrl && (
                    <TouchableOpacity
                        onPress={handleCancelPress}
                        className="bg-red-500/10 border border-red-500 p-4 rounded-xl flex-row items-center justify-center mb-8"
                    >
                        <ExternalLink color="#ef4444" size={20} className="mr-2" />
                        <Text className="text-red-500 font-bold text-lg">{i18n.t('cancelSubscription')}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
