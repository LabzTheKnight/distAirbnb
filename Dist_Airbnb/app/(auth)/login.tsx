import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

    const validateForm = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        
        try {
            console.log('🔐 Attempting login with:', username);
            await signIn(username, password);
            console.log('✅ Login successful! Navigating to home...');
            
            // Navigate immediately, then show success message
            router.replace('/(tabs)');
            
            // Show success alert after navigation
            setTimeout(() => {
                Alert.alert(
                    '✅ Login Successful',
                    `Welcome back, ${username}!`
                );
            }, 100);
        } catch (error: any) {
            console.error('❌ Login error:', error);
            console.error('Error details:', {
                response: error.response?.data,
                status: error.response?.status,
                message: error.message
            });
            
            // Show detailed error from backend
            let errorMessage = 'Invalid credentials or server error';
            if (error.response) {
                // Backend returned an error
                errorMessage = error.response.data?.detail 
                    || error.response.data?.message 
                    || error.response.data?.error
                    || `Server error: ${error.response.status}`;
            } else if (error.request) {
                // No response from backend
                errorMessage = 'Cannot reach server. Is the backend running on localhost:8001?';
            }
            
            setErrors({ general: errorMessage });
            Alert.alert('❌ Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
                {/* Header with Gradient */}
                <LinearGradient
                    colors={['#3B82F6', '#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-16 pb-12 px-6 rounded-b-3xl"
                >
                    <Text className="text-4xl font-bold text-white mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-blue-100 text-base">
                        Sign in to continue your journey
                    </Text>
                </LinearGradient>

                <View className="px-6 py-8">
                    {/* General Error Message */}
                    {errors.general && (
                        <View className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                            <View className="flex-row items-center">
                                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                                <Text className="text-red-700 font-semibold ml-2 flex-1">
                                    {errors.general}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Username Input */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Username</Text>
                        <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 ${errors.username ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-gray-800"
                                placeholder="Enter your username"
                                placeholderTextColor="#9CA3AF"
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text);
                                    if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                                }}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>
                        {errors.username && (
                            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.username}</Text>
                        )}
                    </View>

                    {/* Password Input */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Password</Text>
                        <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 ${errors.password ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-gray-800"
                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                                }}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#9CA3AF" 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && (
                            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
                        )}
                    </View>

                    {/* Remember Me & Forgot Password */}
                    <View className="flex-row justify-between items-center mb-6">
                        <TouchableOpacity 
                            onPress={() => setRememberMe(!rememberMe)}
                            className="flex-row items-center"
                        >
                            <View className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                            </View>
                            <Text className="text-gray-600 text-sm">Remember me</Text>
                        </TouchableOpacity>

                        <Link href="/(auth)/forgot-password" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-500 font-semibold text-sm">Forgot Password?</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className={`rounded-xl overflow-hidden mb-4 ${loading ? 'opacity-70' : ''}`}
                    >
                        <LinearGradient
                            colors={['#3B82F6', '#8B5CF6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-4 items-center"
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text className="text-white font-bold text-base">
                                    Sign In
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-600">Don't have an account? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-500 font-semibold">Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Backend Status Indicator */}
                    <View className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                            <Text className="text-xs text-gray-600">
                                Backend: localhost:8001
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
    );
}