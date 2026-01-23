import React from 'react';
import { View, FlatList, TouchableOpacity, Text, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Filter, ArrowUpDown, X } from 'lucide-react-native';
import { useSubscriptionStore } from '../src/store/useSubscriptionStore';
import { useUserPreferencesStore } from '../src/store/useUserPreferencesStore';
import { SubscriptionCard } from '../src/components/SubscriptionCard';
import { DashboardHeader } from '../src/components/DashboardHeader';
import { OnboardingModal } from '../src/components/OnboardingModal';
import { AnalyticsChart } from '../src/components/AnalyticsChart';
import { Subscription, Category, SortOption } from '../src/types';
import i18n from '../src/i18n';

const CATEGORIES: (Category | 'All')[] = ['All', 'Entertainment', 'Personal', 'Utilities', 'Work', 'Other'];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Price', value: 'price' },
    { label: 'Date', value: 'date' },
];

export default function Dashboard() {
    const router = useRouter();
    const { subscriptions, deleteSubscription } = useSubscriptionStore();
    const {
        currency,
        language,
        sortOption,
        setSortOption,
        filterCategory,
        setFilterCategory
    } = useUserPreferencesStore();
    const [sortModalVisible, setSortModalVisible] = React.useState(false);

    const handleAddPress = () => {
        router.push('/add' as any);
    };

    const handleDelete = (id: string) => {
        // In a real app, confirm before delete
        deleteSubscription(id);
    };

    const filteredAndSortedSubscriptions = React.useMemo(() => {
        let result = [...subscriptions];

        // Filter
        if (filterCategory !== 'All') {
            result = result.filter(sub => sub.category === filterCategory);
        }

        // Sort
        result.sort((a, b) => {
            switch (sortOption) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return b.price - a.price; // Descending for price usually better
                case 'date':
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                default:
                    return 0;
            }
        });

        return result;
    }, [subscriptions, filterCategory, sortOption]);

    return (
        <SafeAreaView className="flex-1 bg-slate-900 px-5">
            <DashboardHeader />

            {/* Filter and Sort Bar */}
            <View className="flex-row items-center mb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-1 mr-2"
                >
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-full border mr-2 ${filterCategory === cat
                                ? 'bg-blue-600 border-blue-600'
                                : 'bg-slate-800 border-slate-700'
                                }`}
                        >
                            <Text className={`font-medium text-xs ${filterCategory === cat ? 'text-white' : 'text-slate-400'
                                }`}>
                                {cat === 'All' ? i18n.t('all') : i18n.t(cat.toLowerCase() as any)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    onPress={() => setSortModalVisible(true)}
                    className="p-2 bg-slate-800 rounded-full border border-slate-700"
                >
                    <ArrowUpDown size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            <AnalyticsChart />
            <OnboardingModal />

            <FlatList
                data={filteredAndSortedSubscriptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        subscription={item}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-slate-500 text-lg">{i18n.t('welcome')}</Text>
                        <Text className="text-slate-600">{i18n.t('addSubscription')} +</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                onPress={handleAddPress}
                className="absolute bottom-8 right-6 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg active:scale-95"
            >
                <Plus color="white" size={32} />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={sortModalVisible}
                onRequestClose={() => setSortModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setSortModalVisible(false)}
                    className="flex-1 bg-black/60 justify-center items-center p-5"
                >
                    <View className="bg-slate-900 w-full max-w-xs rounded-2xl border border-slate-700 overflow-hidden">
                        <View className="p-4 border-b border-slate-800 flex-row justify-between items-center">
                            <Text className="text-white text-lg font-bold">{i18n.t('sort')}</Text>
                            <X size={20} color="#94a3b8" onPress={() => setSortModalVisible(false)} />
                        </View>
                        {SORT_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => {
                                    setSortOption(option.value);
                                    setSortModalVisible(false);
                                }}
                                className={`p-4 border-b border-slate-800 flex-row justify-between items-center ${sortOption === option.value ? 'bg-slate-800' : ''
                                    }`}
                            >
                                <Text className="text-slate-300 text-base">
                                    {option.label === 'Name' ? i18n.t('sortName') :
                                        option.label === 'Price' ? i18n.t('sortPrice') : i18n.t('sortDate')}
                                </Text>
                                {sortOption === option.value && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
