import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSubscriptionStore } from '../src/store/useSubscriptionStore';
import { scheduleTrialNotifications } from '../src/utils/notifications';
import { FormField } from '../src/components/FormField';
import { Subscription } from '../src/types';

export default function AddSubscription() {
    const router = useRouter();
    const addSubscription = useSubscriptionStore((state) => state.addSubscription);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('$');
    const [cycle, setCycle] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [isTrial, setIsTrial] = useState(false);
    const [trialEnd, setTrialEnd] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

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
            <FormField
                label="Service Name"
                value={name}
                onChangeText={setName}
                placeholder="Netflix, Spotify..."
            />

            <View className="flex-row gap-4">
                <View className="flex-1">
                    <FormField
                        label="Price"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholder="0.00"
                    />
                </View>
                <View className="flex-1">
                    <FormField
                        label="Currency"
                        value={currency}
                        onChangeText={setCurrency}
                        placeholder="$"
                    />
                </View>
            </View>

            <Text className="text-slate-400 text-sm font-medium mb-2">Billing Cycle</Text>
            <View className="flex-row bg-slate-800 p-1 rounded-xl mb-6">
                {(['weekly', 'monthly', 'yearly'] as const).map((c) => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setCycle(c)}
                        className={`flex-1 p-3 rounded-lg items-center ${cycle === c ? 'bg-blue-600' : 'bg-transparent'}`}
                    >
                        <Text className={`capitalize font-medium ${cycle === c ? 'text-white' : 'text-slate-400'}`}>
                            {c}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className="bg-slate-800 p-4 rounded-xl mb-6 flex-row justify-between items-center">
                <Text className="text-white font-medium">Is Free Trial?</Text>
                <Switch
                    value={isTrial}
                    onValueChange={setIsTrial}
                    trackColor={{ false: '#334155', true: '#f59e0b' }}
                    thumbColor={isTrial ? '#ffffff' : '#94a3b8'}
                />
            </View>

            {isTrial && (
                <View className="mb-6">
                    <Text className="text-slate-400 text-sm font-medium mb-2">Trial Ends On</Text>
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
            )}

            <TouchableOpacity
                onPress={handleSave}
                className="bg-blue-600 p-4 rounded-xl items-center mt-4 mb-10 active:scale-95"
            >
                <Text className="text-white font-bold text-lg">Save Subscription</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
