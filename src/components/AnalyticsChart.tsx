import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useUserPreferencesStore } from '../store/useUserPreferencesStore';
import i18n from '../i18n';
import { Category } from '../types';

const CATEGORY_COLORS: Record<Category, string> = {
    Entertainment: '#E50914', // Red
    Personal: '#3b82f6', // Blue
    Utilities: '#10b981', // Emerald
    Work: '#f59e0b', // Amber
    Other: '#64748b', // Slate
};

export const AnalyticsChart = () => {
    const { subscriptions, getTotalMonthlyExpense } = useSubscriptionStore();
    const { language, currency } = useUserPreferencesStore(); // Subscribe to language and currency
    const totalMonthly = getTotalMonthlyExpense();

    if (totalMonthly === 0) return null;

    const { currency: userCurrency, exchangeRates } = useUserPreferencesStore();

    // Calculate cost per category
    const categoryCosts = subscriptions.reduce((acc, sub) => {
        if (sub.isFreeTrial) return acc; // Exclude free trials from chart too

        let monthlyCost = sub.price;
        if (sub.billingCycle === 'weekly') monthlyCost = sub.price * 4.33;
        if (sub.billingCycle === 'yearly') monthlyCost = sub.price / 12;

        // Conversion Logic
        const symbolToCode: Record<string, string> = {
            '$': 'USD', '€': 'EUR', '£': 'GBP', '₺': 'TRY', '¥': 'JPY', 'CN¥': 'CNY'
        };
        const subCode = symbolToCode[sub.currency] || 'USD';
        const userCode = symbolToCode[userCurrency] || 'USD';

        if (subCode !== userCode) {
            const rateSub = (exchangeRates && exchangeRates[subCode]) || 1;
            const rateUser = (exchangeRates && exchangeRates[userCode]) || 1;
            monthlyCost = (monthlyCost / rateSub) * rateUser;
        }

        // Handle undefined category (legacy data or default)
        const cat = sub.category || 'Other';
        acc[cat] = (acc[cat] || 0) + monthlyCost;
        return acc;
    }, {} as Record<Category, number>);

    // Generate chart segments
    let startAngle = 0;
    const radius = 60;
    const strokeWidth = 15;
    const center = radius + strokeWidth;
    const size = center * 2;
    const circumference = 2 * Math.PI * radius;

    const segments = Object.entries(categoryCosts).map(([category, cost]) => {
        const percentage = cost / totalMonthly;
        const angle = percentage * 360;
        const strokeDasharray = `${percentage * circumference} ${circumference}`;
        const rotation = startAngle;
        startAngle += angle;

        return {
            category: category as Category,
            cost,
            percentage,
            strokeDasharray,
            rotation,
            color: CATEGORY_COLORS[category as Category] || CATEGORY_COLORS.Other,
        };
    });

    return (
        <View className="flex-row items-center justify-between bg-slate-800/50 p-4 rounded-2xl mb-6">
            <View className="items-center justify-center">
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G rotation="-90" origin={`${center}, ${center}`}>
                        {segments.map((segment, index) => (
                            <Circle
                                key={segment.category}
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={segment.strokeDasharray}
                                strokeDashoffset={0}
                                rotation={segment.rotation}
                                origin={`${center}, ${center}`}
                                fill="transparent"
                            />
                        ))}
                    </G>
                    {/* Inner Text for Total */}
                    <View className="absolute inset-0 items-center justify-center">
                        {/* SVG doesn't support View inside directly without foreignObject which is tricky in RN. 
                             Better to overlay a View on top of SVG or leave center empty. 
                             We will overlay View absolutely.
                         */}
                    </View>
                </Svg>
                {/* Absolute overlay for center text */}
                <View className="absolute inset-0 items-center justify-center" style={{ width: size, height: size }}>
                    <Text className="text-white font-bold text-lg">{currency}{totalMonthly.toFixed(0)}</Text>
                    <Text className="text-slate-400 text-xs">/mo</Text>
                </View>
            </View>

            <View className="flex-1 ml-6">
                {segments
                    .sort((a, b) => b.cost - a.cost)
                    .map((segment) => (
                        <View key={segment.category} className="flex-row items-center mb-2 last:mb-0">
                            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }} />
                            <Text className="text-slate-300 text-xs flex-1">
                                {i18n.t(segment.category.toLowerCase() as any)}
                            </Text>
                            <Text className="text-white text-xs font-medium">
                                {((segment.percentage) * 100).toFixed(0)}%
                            </Text>
                        </View>
                    ))}
            </View>
        </View>
    );
};
