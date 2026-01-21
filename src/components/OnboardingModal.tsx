import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useUserPreferencesStore } from '../store/useUserPreferencesStore';
import i18n from '../i18n';

export const OnboardingModal = () => {
    const { hasCompletedOnboarding, setLanguage, setCurrency, completeOnboarding, language, currency } = useUserPreferencesStore();
    const [selectedLang, setSelectedLang] = useState(language);
    const [selectedCurrency, setSelectedCurrency] = useState(currency);

    if (hasCompletedOnboarding) return null;

    const handleSave = () => {
        setLanguage(selectedLang);
        setCurrency(selectedCurrency);
        completeOnboarding();
    };

    const handleLanguageSelect = (lang: string) => {
        setSelectedLang(lang);
        // Temporarily switch to see the effect immediately in the modal (optional, but good UX)
        // For now we just select state. App updates on Save usually, but let's trust the user selection.
    };

    return (
        <Modal animationType="slide" transparent={false} visible={!hasCompletedOnboarding}>
            <View className="flex-1 bg-slate-900 justify-center px-6 py-10">
                <Text className="text-3xl font-bold text-white text-center mb-10">
                    {i18n.t('onboardingTitle')}
                </Text>

                <View className="mb-8">
                    <Text className="text-slate-400 text-lg mb-4">{i18n.t('selectLanguage')}</Text>
                    <View className="flex-row gap-4">
                        <TouchableOpacity
                            onPress={() => handleLanguageSelect('en')}
                            className={`flex-1 p-4 rounded-xl border ${selectedLang === 'en' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'}`}
                        >
                            <Text className={`text-center font-bold ${selectedLang === 'en' ? 'text-blue-500' : 'text-slate-400'}`}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleLanguageSelect('tr')}
                            className={`flex-1 p-4 rounded-xl border ${selectedLang === 'tr' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'}`}
                        >
                            <Text className={`text-center font-bold ${selectedLang === 'tr' ? 'text-blue-500' : 'text-slate-400'}`}>Türkçe</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-10">
                    <Text className="text-slate-400 text-lg mb-4">{i18n.t('selectCurrency')}</Text>
                    <View className="flex-row gap-4 flex-wrap justify-center">
                        {['$', '€', '£', '₺'].map((curr) => (
                            <TouchableOpacity
                                key={curr}
                                onPress={() => setSelectedCurrency(curr)}
                                className={`w-16 h-16 rounded-full justify-center items-center border ${selectedCurrency === curr ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}
                            >
                                <Text className={`text-xl font-bold ${selectedCurrency === curr ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {curr}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-blue-600 py-4 rounded-xl items-center shadow-lg shadow-blue-900/50"
                >
                    <Text className="text-white font-bold text-lg">{i18n.t('continue')}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};
