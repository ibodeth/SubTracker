import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import { X, Github, Youtube, Linkedin } from 'lucide-react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ visible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/80 p-5">
                <View className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-700 p-6 items-center shadow-xl">

                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute right-4 top-4 p-2 bg-slate-800 rounded-full"
                    >
                        <X size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    <View className="items-center mb-6 mt-4">
                        {/* Application Logo */}
                        <View className="w-24 h-24 bg-slate-800 rounded-3xl mb-4 items-center justify-center border border-slate-700 shadow-lg overflow-hidden">
                            <Image
                                source={require('../../assets/images/icon.png')}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                        </View>
                        <Text className="text-white text-2xl font-bold mb-1">SubTracker</Text>
                        <Text className="text-slate-400 text-sm">v1.0.1</Text>
                    </View>

                    <View className="bg-slate-800/50 p-4 rounded-xl w-full mb-6 items-center">
                        <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Developer</Text>
                        <Text className="text-white text-lg font-semibold text-center">İbrahim Nuryağınlı</Text>
                    </View>

                    <View className="flex-row gap-4 w-full justify-center mb-4">
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://github.com/ibodeth')}
                            className="bg-slate-800 p-4 rounded-2xl items-center flex-1 border border-slate-700 active:bg-slate-700"
                        >
                            <Github size={24} color="#fff" />
                            <Text className="text-white text-xs font-bold mt-2">GitHub</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://www.youtube.com/channel/UCCZES0wpy0pQFFLRgjkOopA')}
                            className="bg-red-600 p-4 rounded-2xl items-center flex-1 border border-red-500 active:bg-red-700"
                        >
                            <Youtube size={24} color="#fff" />
                            <Text className="text-white text-xs font-bold mt-2">YouTube</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://www.linkedin.com/in/ibrahimnuryaginli/')}
                        className="bg-blue-700 p-4 rounded-2xl items-center w-full border border-blue-600 active:bg-blue-800"
                    >
                        <Linkedin size={24} color="#fff" />
                        <Text className="text-white text-xs font-bold mt-2">LinkedIn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://github.com/ibodeth/SubTracker/releases')}
                        className="mt-6 py-2"
                    >
                        <Text className="text-blue-400 text-sm font-medium">Check for Updates</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};
