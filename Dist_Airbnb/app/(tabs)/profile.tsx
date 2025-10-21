import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    // If not logged in, show login prompt
    if (!user) {
        return (
            <ScrollView className="flex-1 bg-gray-50">
                <LinearGradient
                    colors={['#3B82F6', '#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-16 pb-8 px-6"
                >
                    <Text className="text-3xl font-bold text-white">Profile</Text>
                </LinearGradient>

                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="person-circle-outline" size={100} color="#D1D5DB" />
                    <Text className="text-2xl font-bold text-gray-800 mt-6 mb-2">
                        Not Logged In
                    </Text>
                    <Text className="text-gray-500 text-center mb-8">
                        Sign in to view your profile and manage your bookings
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        className="bg-blue-500 px-8 py-4 rounded-xl"
                    >
                        <Text className="text-white font-semibold text-lg">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header */}
            <LinearGradient
                colors={['#3B82F6', '#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="pt-16 pb-8 px-6"
            >
                <View className="items-center">
                    <View className="bg-white rounded-full p-2 mb-4">
                        <Ionicons name="person" size={60} color="#3B82F6" />
                    </View>
                    <Text className="text-2xl font-bold text-white">
                        {user.username}
                    </Text>
                    <Text className="text-blue-100 mt-1">
                        {user.email || 'No email provided'}
                    </Text>
                </View>
            </LinearGradient>

            {/* Profile Options */}
            <View className="mt-6 px-4">
                {/* Account Section */}
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                    <Text className="text-gray-500 font-semibold mb-3 px-2">ACCOUNT</Text>
                    
                    <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-gray-50">
                        <View className="bg-blue-100 p-2 rounded-lg">
                            <Ionicons name="person-outline" size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-semibold">Edit Profile</Text>
                            <Text className="text-gray-500 text-sm">Update your information</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <View className="h-px bg-gray-100 my-2" />

                    <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-gray-50">
                        <View className="bg-green-100 p-2 rounded-lg">
                            <Ionicons name="lock-closed-outline" size={20} color="#10B981" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-semibold">Change Password</Text>
                            <Text className="text-gray-500 text-sm">Update your password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* My Activity Section */}
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                    <Text className="text-gray-500 font-semibold mb-3 px-2">MY ACTIVITY</Text>
                    
                    <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-gray-50">
                        <View className="bg-red-100 p-2 rounded-lg">
                            <Ionicons name="heart-outline" size={20} color="#EF4444" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-semibold">My Favorites</Text>
                            <Text className="text-gray-500 text-sm">View saved listings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <View className="h-px bg-gray-100 my-2" />

                    <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-gray-50">
                        <View className="bg-purple-100 p-2 rounded-lg">
                            <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-semibold">My Bookings</Text>
                            <Text className="text-gray-500 text-sm">View your reservations</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <View className="h-px bg-gray-100 my-2" />

                    <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-gray-50">
                        <View className="bg-yellow-100 p-2 rounded-lg">
                            <Ionicons name="star-outline" size={20} color="#F59E0B" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-semibold">My Reviews</Text>
                            <Text className="text-gray-500 text-sm">Reviews you've written</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Settings Section */}
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                    <Text className="text-gray-500 font-semibold mb-3 px-2">SETTINGS</Text>
                    
                    <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-gray-50">
                        <View className="bg-gray-100 p-2 rounded-lg">
                            <Ionicons name="notifications-outline" size={20} color="#6B7280" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-semibold">Notifications</Text>
                            <Text className="text-gray-500 text-sm">Manage notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <View className="h-px bg-gray-100 my-2" />

                    <TouchableOpacity className="flex-row items-center p-3 rounded-xl active:bg-gray-50">
                        <View className="bg-gray-100 p-2 rounded-lg">
                            <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-semibold">Help & Support</Text>
                            <Text className="text-gray-500 text-sm">Get help or contact us</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8"
                >
                    <View className="flex-row items-center justify-center">
                        <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                        <Text className="text-red-500 font-bold text-lg ml-2">Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
