import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
    label: string;
    error?: string;
}

export const FormField: React.FC<Props> = ({ label, error, ...props }) => {
    return (
        <View className="mb-4">
            <Text className="text-slate-400 text-sm font-medium mb-2">{label}</Text>
            <TextInput
                className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-blue-500"
                placeholderTextColor="#64748b"
                {...props}
            />
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
};
