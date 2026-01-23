import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert, Platform, Modal } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSubscriptionStore } from '../src/store/useSubscriptionStore';
import { useUserPreferencesStore } from '../src/store/useUserPreferencesStore';
import { scheduleTrialNotifications } from '../src/utils/notifications';
import { FormField } from '../src/components/FormField';
import { Subscription } from '../src/types';
import i18n from '../src/i18n';
import { popularServices } from '../src/data/services';

export default function AddSubscription() {
    const router = useRouter();
    const addSubscription = useSubscriptionStore((state) => state.addSubscription);
    const { language, currency: userCurrency } = useUserPreferencesStore(); // Get user currency

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState(userCurrency); // Initialize with user preference
    const [cycle, setCycle] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [category, setCategory] = useState<Subscription['category']>('Other');
    const [themeColor, setThemeColor] = useState<string | undefined>(undefined);
    const [cancellationUrl, setCancellationUrl] = useState<string | undefined>(undefined);
    const [isTrial, setIsTrial] = useState(false);
    const [trialEnd, setTrialEnd] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    const handlePresetSelect = (service: typeof popularServices[0]) => {
        setName(service.name);

        // precise mapping
        const localPrice = service.prices[currency];
        // fallback to USD or 0 if not found
        const finalPrice = localPrice !== undefined ? localPrice : (service.prices['$'] || 0);

        setPrice(finalPrice.toString());
        setThemeColor(service.hexColor);
        setCancellationUrl(service.cancellationUrl);
        // Maybe set category based on known service? For now allow manual.
        if (['netflix', 'spotify', 'youtube', 'disney', 'applemusic', 'xbox', 'hbo', 'hulu', 'playstation'].includes(service.id)) {
            setCategory('Entertainment');
        } else if (service.id === 'icloud' || service.id === 'twitter') {
            setCategory('Utilities');
        } else if (service.id === 'amazon') {
            setCategory('Personal'); // or Shopping if we had it
        }
    };

    const handleSave = async () => {
        if (!name || !price) {
            Alert.alert('Error', 'Please fill in Name and Price');
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) {
            Alert.alert('Error', 'Invalid price');
            return;
        }

        let notificationIds: string[] = [];
        if (isTrial) {
            // Schedule notifications
            const { status } = await import('expo-notifications').then(n => n.getPermissionsAsync());
            if (status === 'granted') {
                notificationIds = await scheduleTrialNotifications(name, trialEnd);
            }
        }

        const newSub: Subscription = {
            id: Date.now().toString(),
            name,
            price: priceNum,
            currency,
            billingCycle: cycle,
            startDate: startDate.toISOString(),
            category,
            themeColor,
            cancellationUrl,
            isFreeTrial: isTrial,
            trialEndDate: isTrial ? trialEnd.toISOString() : undefined,
            remindMe: isTrial,
            notificationIds
        };

        addSubscription(newSub);
        router.back();
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || trialEnd;
        setShowDatePicker(false);
        setTrialEnd(currentDate);
    };

    return (
        <ScrollView className="flex-1 bg-slate-900 p-5">
            <Text className="text-slate-400 text-sm font-medium mb-3">Quick Select</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-14">
                {popularServices.map((service) => (
                    <TouchableOpacity
                        key={service.id}
                        onPress={() => handlePresetSelect(service)}
                        className="mr-3 px-4 py-2 rounded-full border border-slate-700 bg-slate-800 flex-row items-center"
                        style={{ borderColor: service.hexColor || '#334155' }}
                    >
                        <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: service.hexColor }} />
                        <Text className="text-white font-medium">{service.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FormField
                label={i18n.t('serviceName')}
                value={name}
                onChangeText={setName}
                placeholder="Netflix, Spotify..."
            />

            <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                    <FormField
                        label={i18n.t('price')}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholder="0.00"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-slate-400 text-sm font-medium mb-2">{i18n.t('currency')}</Text>
                    <TouchableOpacity
                        onPress={() => setShowCurrencyModal(true)}
                        className="h-12 bg-slate-800 border border-slate-700 rounded-xl justify-center px-4"
                    >
                        <Text className="text-white font-medium text-lg">{currency}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                transparent={true}
                visible={showCurrencyModal}
                animationType="fade"
                onRequestClose={() => setShowCurrencyModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowCurrencyModal(false)}
                    className="flex-1 bg-black/60 justify-center items-center p-5"
                >
                    <View className="bg-slate-900 w-full max-w-xs rounded-2xl border border-slate-700 overflow-hidden">
                        <View className="p-4 border-b border-slate-800">
                            <Text className="text-white text-lg font-bold text-center">{i18n.t('selectCurrency')}</Text>
                        </View>
                        <ScrollView className="max-h-80">
                            {['$', '€', '£', '₺', '¥', 'CN¥', 'A$', 'C$', 'Fr', 'HK$', 'NZ$', 'kr', '₩', 'S$', '₹', '₽', 'R$', 'R'].map((curr) => (
                                <TouchableOpacity
                                    key={curr}
                                    onPress={() => {
                                        setCurrency(curr);
                                        setShowCurrencyModal(false);
                                    }}
                                    className={`p-4 border-b border-slate-800 flex-row justify-between items-center ${currency === curr ? 'bg-slate-800' : ''}`}
                                >
                                    <Text className="text-slate-300 text-base">{curr}</Text>
                                    {currency === curr && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => setShowCurrencyModal(false)}
                            className="p-4 bg-slate-800 items-center"
                        >
                            <Text className="text-slate-400 font-medium">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Text className="text-slate-400 text-sm font-medium mb-2">{i18n.t('category')}</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
                {(['Entertainment', 'Personal', 'Utilities', 'Work', 'Other'] as const).map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        className={`px-3 py-2 rounded-lg border ${category === cat ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-700'}`}
                    >
                        <Text className={`text-xs font-medium ${category === cat ? 'text-white' : 'text-slate-400'}`}>
                            {i18n.t(cat.toLowerCase() as any)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text className="text-slate-400 text-sm font-medium mb-2">{i18n.t('billingCycle')}</Text>
            <View className="flex-row bg-slate-800 p-1 rounded-xl mb-6">
                {(['weekly', 'monthly', 'yearly'] as const).map((c) => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setCycle(c)}
                        className={`flex-1 p-3 rounded-lg items-center ${cycle === c ? 'bg-blue-600' : 'bg-transparent'}`}
                    >
                        <Text className={`capitalize font-medium ${cycle === c ? 'text-white' : 'text-slate-400'}`}>
                            {i18n.t(c)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className="bg-slate-800 p-4 rounded-xl mb-6 flex-row justify-between items-center">
                <Text className="text-white font-medium">{i18n.t('isFreeTrial')}</Text>
                <Switch
                    value={isTrial}
                    onValueChange={setIsTrial}
                    trackColor={{ false: '#334155', true: '#f59e0b' }}
                    thumbColor={isTrial ? '#ffffff' : '#94a3b8'}
                />
            </View>

            {
                isTrial && (
                    <View className="mb-6">
                        <Text className="text-slate-400 text-sm font-medium mb-2">{i18n.t('trialEndsOn')}</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="bg-slate-800 p-4 rounded-xl border border-amber-500/50"
                        >
                            <Text className="text-white">{trialEnd.toLocaleDateString()}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={trialEnd}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                        <Text className="text-amber-500 text-xs mt-2 ml-1">
                            You will be notified 24h & 2h before expiry
                        </Text>
                    </View>
                )
            }

            <TouchableOpacity
                onPress={handleSave}
                className="bg-blue-600 p-4 rounded-xl items-center mt-4 mb-10 active:scale-95"
            >
                <Text className="text-white font-bold text-lg">{i18n.t('saveSubscription')}</Text>
            </TouchableOpacity>
        </ScrollView >
    );
}
