import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { useUserPreferencesStore } from '../store/useUserPreferencesStore';
import i18n from '../i18n';
import { ChevronDown, Check, Globe, DollarSign } from 'lucide-react-native';

const LANGUAGES = [
    { label: 'English', value: 'en' },
    { label: 'Türkçe', value: 'tr' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'Italiano', value: 'it' },
    { label: 'Português', value: 'pt' },
    { label: 'Русский', value: 'ru' },
    { label: '中文', value: 'zh' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
    { label: 'العربية', value: 'ar' },
    { label: 'हिन्दी', value: 'hi' },
];

const CURRENCIES = [
    { label: 'USD ($)', value: '$' },
    { label: 'EUR (€)', value: '€' },
    { label: 'GBP (£)', value: '£' },
    { label: 'TRY (₺)', value: '₺' },
    { label: 'JPY (¥)', value: '¥' },
    { label: 'CNY (¥)', value: 'CN¥' },
    { label: 'AUD ($)', value: 'A$' },
    { label: 'CAD ($)', value: 'C$' },
    { label: 'CHF (Fr)', value: 'Fr' },
    { label: 'HKD ($)', value: 'HK$' },
    { label: 'NZD ($)', value: 'NZ$' },
    { label: 'SEK (kr)', value: 'kr' },
    { label: 'KRW (₩)', value: '₩' },
    { label: 'SGD ($)', value: 'S$' },
    { label: 'INR (₹)', value: '₹' },
    { label: 'RUB (₽)', value: '₽' },
    { label: 'BRL (R$)', value: 'R$' },
    { label: 'ZAR (R)', value: 'R' },
];

export const OnboardingModal = () => {
    const { hasCompletedOnboarding, setLanguage, setCurrency, completeOnboarding, language, currency } = useUserPreferencesStore();
    const [selectedLang, setSelectedLang] = useState(language);
    const [selectedCurrency, setSelectedCurrency] = useState(currency);

    // Modal state
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownType, setDropdownType] = useState<'language' | 'currency'>('language');

    if (hasCompletedOnboarding) return null;

    const handleSave = () => {
        setLanguage(selectedLang);
        setCurrency(selectedCurrency);
        completeOnboarding();
    };

    const openDropdown = (type: 'language' | 'currency') => {
        setDropdownType(type);
        setDropdownVisible(true);
    };

    const handleSelect = (value: string) => {
        if (dropdownType === 'language') {
            setSelectedLang(value);
            // Optional: Auto-select default currency based on language map could go here
        } else {
            setSelectedCurrency(value);
        }
        setDropdownVisible(false);
    };

    const getLabel = (type: 'language' | 'currency', value: string) => {
        const list = type === 'language' ? LANGUAGES : CURRENCIES;
        return list.find(item => item.value === value)?.label || value;
    };

    return (
        <Modal animationType="fade" transparent={false} visible={!hasCompletedOnboarding}>
            <View className="flex-1 bg-slate-900 justify-center px-6 py-10">
                <View className="items-center mb-10">
                    <View className="w-20 h-20 bg-blue-500 rounded-3xl items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
                        <Text className="text-4xl">🚀</Text>
                    </View>
                    <Text className="text-3xl font-bold text-white text-center">
                        {i18n.t('onboardingTitle')}
                    </Text>
                    <Text className="text-slate-400 text-center mt-2">
                        Configure your preferences to get started
                    </Text>
                </View>

                {/* Language Selector */}
                <View className="mb-6">
                    <Text className="text-slate-400 text-sm font-bold uppercase mb-2 ml-1">{i18n.t('selectLanguage')}</Text>
                    <TouchableOpacity
                        onPress={() => openDropdown('language')}
                        className="flex-row items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700"
                    >
                        <View className="flex-row items-center">
                            <Globe size={20} color="#60a5fa" className="mr-3" />
                            <Text className="text-white text-lg font-medium">
                                {getLabel('language', selectedLang)}
                            </Text>
                        </View>
                        <ChevronDown size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Currency Selector */}
                <View className="mb-10">
                    <Text className="text-slate-400 text-sm font-bold uppercase mb-2 ml-1">{i18n.t('selectCurrency')}</Text>
                    <TouchableOpacity
                        onPress={() => openDropdown('currency')}
                        className="flex-row items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700"
                    >
                        <View className="flex-row items-center">
                            <DollarSign size={20} color="#fbbf24" className="mr-3" />
                            <Text className="text-white text-lg font-medium">
                                {getLabel('currency', selectedCurrency)}
                            </Text>
                        </View>
                        <ChevronDown size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-blue-600 py-4 rounded-xl items-center shadow-lg shadow-blue-900/50 active:scale-95"
                >
                    <Text className="text-white font-bold text-lg">{i18n.t('continue')}</Text>
                </TouchableOpacity>

                {/* Selection Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={dropdownVisible}
                    onRequestClose={() => setDropdownVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setDropdownVisible(false)}
                        className="flex-1 bg-black/60 justify-end"
                    >
                        <View className="bg-slate-800 rounded-t-3xl border-t border-slate-700 max-h-[70%]">
                            <View className="p-4 border-b border-slate-700 items-center">
                                <View className="w-12 h-1.5 bg-slate-600 rounded-full mb-4" />
                                <Text className="text-white text-lg font-bold">
                                    {dropdownType === 'language' ? i18n.t('selectLanguage') : i18n.t('selectCurrency')}
                                </Text>
                            </View>

                            <FlatList
                                data={dropdownType === 'language' ? LANGUAGES : CURRENCIES}
                                keyExtractor={(item) => item.value}
                                className="p-4"
                                renderItem={({ item }) => {
                                    const isSelected = (dropdownType === 'language' ? selectedLang : selectedCurrency) === item.value;
                                    return (
                                        <TouchableOpacity
                                            onPress={() => handleSelect(item.value)}
                                            className={`p-4 mb-2 rounded-xl flex-row justify-between items-center ${isSelected ? 'bg-blue-600/20 border border-blue-600' : 'bg-slate-700/30'}`}
                                        >
                                            <Text className={`text-lg font-medium ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                                                {item.label}
                                            </Text>
                                            {isSelected && <Check size={20} color="#60a5fa" />}
                                        </TouchableOpacity>
                                    );
                                }}
                                contentContainerStyle={{ paddingBottom: 40 }}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </Modal>
    );
};

