export interface Service {
    id: string;
    name: string;
    hexColor: string;
    cancellationUrl: string;
    prices: { [currency: string]: number }; // Map currency code (USD, TRY, EUR, etc.) to price
}

export const popularServices: Service[] = [
    {
        id: 'netflix',
        name: 'Netflix',
        hexColor: '#E50914',
        prices: {
            '$': 15.49,
            '₺': 149.99,
            '€': 13.49,
            '£': 10.99
        },
        cancellationUrl: 'https://www.netflix.com/cancelplan'
    },
    {
        id: 'spotify',
        name: 'Spotify',
        hexColor: '#1DB954',
        prices: {
            '$': 11.99,
            '₺': 59.99,
            '€': 10.99,
            '£': 10.99
        },
        cancellationUrl: 'https://support.spotify.com/article/cancel-premium/'
    },
    {
        id: 'youtube',
        name: 'YouTube Premium',
        hexColor: '#FF0000',
        prices: {
            '$': 13.99,
            '₺': 57.99,
            '€': 12.99,
            '£': 12.99
        },
        cancellationUrl: 'https://www.youtube.com/paid_memberships?ybp=mAEK'
    },
    {
        id: 'icloud',
        name: 'iCloud+',
        hexColor: '#007AFF', // Azure Blue
        prices: {
            '$': 2.99,
            '₺': 39.99,
            '€': 2.99,
            '£': 2.99
        },
        cancellationUrl: 'https://support.apple.com/HT202039'
    },
    {
        id: 'amazon',
        name: 'Amazon Prime',
        hexColor: '#00A8E1',
        prices: {
            '$': 14.99,
            '₺': 39.00,
            '€': 8.99,
            '£': 8.99
        },
        cancellationUrl: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GTJQ7QZY7E2647JE'
    },
    {
        id: 'disney',
        name: 'Disney+',
        hexColor: '#113CCF',
        prices: {
            '$': 13.99,
            '₺': 134.99,
            '€': 10.99,
            '£': 7.99
        },
        cancellationUrl: 'https://help.disneyplus.com/article/disneyplus-cancel-subscription'
    },
    {
        id: 'applemusic',
        name: 'Apple Music',
        hexColor: '#FA243C',
        prices: {
            '$': 10.99,
            '₺': 39.99,
            '€': 10.99,
            '£': 10.99
        },
        cancellationUrl: 'https://support.apple.com/HT212047'
    },
    {
        id: 'xbox',
        name: 'Xbox Game Pass',
        hexColor: '#107C10',
        prices: {
            '$': 16.99,
            '₺': 159.00,
            '€': 14.99,
            '£': 12.99
        },
        cancellationUrl: 'https://support.xbox.com/help/subscriptions-billing/manage-subscriptions/cancel-recurring-billing-or-subscription'
    },
    {
        id: 'hbo',
        name: 'HBO Max',
        hexColor: '#5a2da8',
        prices: {
            '$': 15.99,
            '₺': 0, // Not available directly usually, but placeholder
            '€': 9.99,
            '£': 9.99
        },
        cancellationUrl: 'https://help.hbomax.com/'
    },
    {
        id: 'hulu',
        name: 'Hulu',
        hexColor: '#1ce783',
        prices: {
            '$': 17.99,
            '₺': 0,
            '€': 0,
            '£': 0
        },
        cancellationUrl: 'https://help.hulu.com/s/article/cancel-subscription'
    },
    {
        id: 'playstation',
        name: 'PlayStation Plus',
        hexColor: '#00439C',
        prices: {
            '$': 9.99,
            '₺': 2400.00, // Year price usually, need monthly approx? Let's say 200
            '€': 8.99,
            '£': 6.99
        },
        cancellationUrl: 'https://www.playstation.com/support/store/cancel-ps-store-subscription/'
    },
    {
        id: 'twitter',
        name: 'X Premium',
        hexColor: '#14171A',
        prices: {
            '$': 8.00,
            '₺': 150.00,
            '€': 9.60,
            '£': 9.60
        },
        cancellationUrl: 'https://help.twitter.com/en/managing-your-account/how-to-cancel-x-premium'
    }
];
