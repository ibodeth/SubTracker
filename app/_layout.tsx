import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../src/utils/notifications";
import { useVersionCheck } from "../src/hooks/useVersionCheck";
import { BiometricProvider } from "../src/components/BiometricProvider";
import i18n from "../src/i18n"; // Ensure i18n is initialized
import { useUserPreferencesStore } from "../src/store/useUserPreferencesStore";

export default function RootLayout() {
  const { language, updateExchangeRates } = useUserPreferencesStore(); // Subscribe to language
  useVersionCheck();

  useEffect(() => {
    updateExchangeRates(); // Fetch latest rates
    registerForPushNotificationsAsync();

    // Listener for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);

  return (
    <BiometricProvider>
      <StatusBar style="light" />
      <Stack
        key={language} // Force re-mount on language change
        screenOptions={{
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#0f172a" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="add"
          options={{
            presentation: 'modal',
            title: i18n.t('addSubscription'),
            headerBackTitle: 'Cancel'
          }}
        />
        <Stack.Screen
          name="subscription/[id]"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </BiometricProvider>
  );
}
