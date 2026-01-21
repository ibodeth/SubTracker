import React, { useEffect, useState, useRef } from 'react';
import { View, Text, AppState, AppStateStatus, TouchableOpacity, Image } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useUserPreferencesStore } from '../store/useUserPreferencesStore';
import i18n from '../i18n';
import { Lock } from 'lucide-react-native';

export const BiometricProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isBiometricEnabled } = useUserPreferencesStore();
    const [isLocked, setIsLocked] = useState(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        if (isBiometricEnabled) {
            authenticate();
        }
    }, [isBiometricEnabled]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [isBiometricEnabled]);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active' &&
            isBiometricEnabled
        ) {
            setIsLocked(true);
            authenticate();
        }
        appState.current = nextAppState;
    };

    const authenticate = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                // If biometric not available, treat as unlocked or handling internally
                // Ideally inform user they can't use it. For now, unlock.
                setIsLocked(false);
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: i18n.t('appLock') || 'Unlock Sub-Tracker',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
            });

            if (result.success) {
                setIsLocked(false);
            } else {
                setIsLocked(true);
            }
        } catch (error) {
            console.error('Authentication Error:', error);
            setIsLocked(true);
        }
    };

    if (isLocked && isBiometricEnabled) {
        return (
            <View className="flex-1 bg-slate-900 items-center justify-center p-6">
                <View className="bg-slate-800 p-8 rounded-full mb-8 shadow-lg shadow-black/50">
                    <Lock size={64} color="#3b82f6" />
                </View>
                <Text className="text-white text-2xl font-bold mb-4">Sub-Tracker Locked</Text>
                <Text className="text-slate-400 text-center mb-8">
                    Unlock to access your subscriptions
                </Text>
                <TouchableOpacity
                    onPress={authenticate}
                    className="bg-blue-600 px-8 py-3 rounded-xl active:scale-95"
                >
                    <Text className="text-white font-bold text-lg">Unlock</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <>{children}</>;
};
