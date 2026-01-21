import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

const GITHUB_REPO = 'ibodeth/SubTracker';
const RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export const useVersionCheck = () => {
    useEffect(() => {
        checkVersion();
    }, []);

    const checkVersion = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) return;

            const data = await response.json();
            const latestVersionTag = data.tag_name; // e.g., "v1.0.1"

            if (!latestVersionTag) return;

            const currentVersion = Constants.expoConfig?.version || '1.0.0';
            const cleanLatestVersion = latestVersionTag.replace(/^v/, '');

            // Simple string comparison or semver comparison could be used. 
            // For now, assuming standard semver, if strings are different, prompt update.
            // Ideally use a semver library, but for this snippet we keep it simple.
            if (cleanLatestVersion !== currentVersion) {
                // Check if remote is actually greater? 
                // For simplicity, if they differ and we assume releases are always newer:

                Alert.alert(
                    'Update Available',
                    `A new version (${latestVersionTag}) of SubTracker is available.`,
                    [
                        {
                            text: 'Later',
                            style: 'cancel'
                        },
                        {
                            text: 'Download Now',
                            onPress: () => Linking.openURL(RELEASES_URL)
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error checking version:', error);
        }
    };
};
