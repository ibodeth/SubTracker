import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert, Modal, FlatList, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Lock, DollarSign, X, Github, Linkedin, Youtube, ExternalLink } from 'lucide-react-native';
import { useUserPreferencesStore } from '../src/store/useUserPreferencesStore';
import i18n from '../src/i18n';
import * as LocalAuthentication from 'expo-local-authentication';

interface SelectionOption {
    label: string;
    value: string;
}

export default function Settings() {
    const router = useRouter();
    const {
        isBiometricEnabled,
        setBiometricEnabled,
        language,
        setLanguage,
        currency,
        setCurrency
    } = useUserPreferencesStore();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'language' | 'currency'>('language');

    const languages: SelectionOption[] = [
        { label: 'English', value: 'en' },
        { label: 'Türkçe', value: 'tr' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Español', value: 'es' },
        { label: 'Français', value: 'fr' }
    ];

    const currencies: SelectionOption[] = [
        { label: 'USD ($)', value: '$' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
        { label: 'TRY (₺)', value: '₺' },
        { label: 'JPY (¥)', value: '¥' },
        { label: 'CNY (¥)', value: 'CN¥' },
    ];

    const handleBiometricToggle = async (value: boolean) => {
        if (value) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert('Error', 'Biometric authentication is not available on this device.');
                return;
            }
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert('Error', 'No biometrics enrolled on this device.');
                return;
            }
        }
        setBiometricEnabled(value);
    };

    const openSelection = (type: 'language' | 'currency') => {
        setModalType(type);
        setModalVisible(true);
    };

    const handleSelect = (item: SelectionOption) => {
        if (modalType === 'language') {
            setLanguage(item.value);
            // Auto-select currency based on language
            switch (item.value) {
                case 'tr': setCurrency('₺'); break;
                case 'en': setCurrency('$'); break; // Default to USD for English
                case 'de': setCurrency('€'); break;
                case 'es': setCurrency('€'); break; // Spain -> Euro (or could be generic)
                case 'fr': setCurrency('€'); break;
                // Add more cases if needed
            }
        } else {
            setCurrency(item.value);
        }
        setModalVisible(false);
    };

    const renderModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-slate-800 rounded-t-3xl p-5 border-t border-slate-700 max-h-[50%]">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-bold">
                            {modalType === 'language' ? i18n.t('selectLanguage') : i18n.t('selectCurrency')}
                        </Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1">
                            <X size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={modalType === 'language' ? languages : currencies}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelect(item)}
                                className={`p-4 rounded-xl mb-2 flex-row justify-between items-center ${(modalType === 'language' ? language : currency) === item.value
                                    ? 'bg-blue-600/20 border border-blue-600'
                                    : 'bg-slate-700/50'
                                    }`}
                            >
                                <Text className={`font-medium ${(modalType === 'language' ? language : currency) === item.value
                                    ? 'text-blue-400'
                                    : 'text-slate-300'
                                    }`}>
                                    {item.label}
                                </Text>
                                {(modalType === 'language' ? language : currency) === item.value && (
                                    <View className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <View className="px-5 py-4 flex-row items-center border-b border-slate-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">{i18n.t('settings')}</Text>
            </View>

            <ScrollView className="flex-1 p-5">
                {/* General Section */}
                <View className="mb-6">
                    <Text className="text-slate-400 text-sm font-medium uppercase mb-3">{i18n.t('general') || 'General'}</Text>

                    <View className="bg-slate-800 rounded-xl overflow-hidden">
                        <TouchableOpacity
                            onPress={() => openSelection('language')}
                            className="p-4 flex-row items-center justify-between border-b border-slate-700"
                        >
                            <View className="flex-row items-center">
                                <Globe size={22} color="#94a3b8" />
                                <Text className="text-white font-medium ml-3">{i18n.t('selectLanguage')}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-blue-500 font-bold uppercase mr-2.5">
                                    {languages.find(l => l.value === language)?.label || language}
                                </Text>
                                {/* Chevron could go here */}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openSelection('currency')}
                            className="p-4 flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center">
                                <DollarSign size={22} color="#94a3b8" />
                                <Text className="text-white font-medium ml-3">{i18n.t('currency')}</Text>
                            </View>
                            <Text className="text-amber-500 font-bold text-lg">{currency}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Security Section */}
                <View className="mb-6">
                    <Text className="text-slate-400 text-sm font-medium uppercase mb-3">{i18n.t('security') || 'Security'}</Text>

                    <View className="bg-slate-800 rounded-xl overflow-hidden p-4 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Lock size={22} color="#94a3b8" />
                            <Text className="text-white font-medium ml-3">{i18n.t('appLock')}</Text>
                        </View>
                        <Switch
                            value={isBiometricEnabled}
                            onValueChange={handleBiometricToggle}
                            trackColor={{ false: '#334155', true: '#2563eb' }}
                            thumbColor={isBiometricEnabled ? '#ffffff' : '#94a3b8'}
                        />
                    </View>
                </View>

                {/* Developer / About Section */}
                <View className="mb-8 mt-4">
                    <View className="items-center mb-6">
                        <View className="w-20 h-20 bg-slate-800 rounded-2xl mb-3 items-center justify-center border border-slate-700 shadow-md">
                            <Text className="text-3xl">🚀</Text>
                        </View>
                        <Text className="text-white text-xl font-bold mb-1">Sub-Tracker</Text>
                        <Text className="text-slate-500 text-xs">v1.0.2</Text>
                    </View>

                    <View className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-4">
                        <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-3 text-center">
                            {i18n.t('developer') || 'Developer'}
                        </Text>
                        <Text className="text-white text-lg font-semibold text-center mb-4">
                            İbrahim Nuryağınlı
                        </Text>

                        <View className="flex-row justify-center gap-6">
                            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ibodeth')}>
                                <Github size={24} color="#94a3b8" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/ibrahimnuryaginli/')}>
                                <Linkedin size={24} color="#0077b5" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/channel/UCCZES0wpy0pQFFLRgjkOopA')}>
                                <Youtube size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://github.com/ibodeth/SubTracker/releases')}
                        className="flex-row justify-center items-center py-2"
                    >
                        <Text className="text-blue-500 text-sm font-medium mr-2">
                            {i18n.t('checkForUpdates') || 'Check for Updates'}
                        </Text>
                        <ExternalLink size={14} color="#3b82f6" />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {renderModal()}
        </SafeAreaView>
    );
}
