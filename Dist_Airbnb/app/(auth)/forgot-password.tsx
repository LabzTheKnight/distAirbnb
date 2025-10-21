import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
	const router = useRouter();
	
	return (
		<View className="flex-1 bg-gray-50">
			<LinearGradient
				colors={['#3B82F6', '#8B5CF6', '#EC4899']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="pt-16 pb-12 px-6 rounded-b-3xl"
			>
				<Text className="text-4xl font-bold text-white mb-2">
					Forgot Password
				</Text>
				<Text className="text-blue-100 text-base">
					Password recovery coming soon
				</Text>
			</LinearGradient>
			
			<View className="flex-1 items-center justify-center px-6">
				<Ionicons name="lock-closed-outline" size={100} color="#D1D5DB" />
				<Text className="text-2xl font-bold text-gray-800 mt-6 mb-2">
					Coming Soon
				</Text>
				<Text className="text-gray-500 text-center mb-8">
					Password recovery feature will be available soon
				</Text>
				<TouchableOpacity
					onPress={() => router.back()}
					className="bg-blue-500 px-8 py-4 rounded-xl"
				>
					<Text className="text-white font-semibold text-lg">Go Back</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
