import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return;
    }

    // On Android, we need to specify a channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
}

export async function scheduleTrialNotifications(
    serviceName: string,
    trialEndDate: Date
): Promise<string[]> {
    const notificationIds: string[] = [];

    // 24 hours before
    const reminder24h = new Date(trialEndDate);
    reminder24h.setHours(reminder24h.getHours() - 24);

    if (reminder24h > new Date()) {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Trial Ending Soon!',
                body: `Your free trial for ${serviceName} ends in 24 hours.`,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminder24h
            },
        });
        notificationIds.push(id);
    }

    // 2 hours before
    const reminder2h = new Date(trialEndDate);
    reminder2h.setHours(reminder2h.getHours() - 2);

    if (reminder2h > new Date()) {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Urgent: Trial Expiring!',
                body: `Your free trial for ${serviceName} ends in 2 hours! Cancel now if needed.`,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminder2h
            },
        });
        notificationIds.push(id);
    }

    return notificationIds;
}

export async function cancelNotifications(notificationIds: string[]) {
    for (const id of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
    }
}
