import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        
        try {
            console.log('📝 Attempting registration for:', formData.username);
            // Use the signUp function from AuthContext
            await signUp(
                formData.username,
                formData.email,
                formData.password,
                formData.confirmPassword,
                formData.firstName,
                formData.lastName
            );
            console.log('✅ Registration successful! Navigating to home...');
            
            // Navigate immediately, then show success message
            router.replace('/(tabs)');
            
            // Success - user is now logged in via AuthContext
            setTimeout(() => {
                Alert.alert(
                    '✅ Registration Successful',
                    `Welcome, ${formData.firstName}! Your account has been created.`
                );
            }, 100);
        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Show detailed error from backend
            let errorMessage = 'Registration failed. Please try again.';
            if (error.response) {
                // Backend returned an error
                const data = error.response.data;
                if (typeof data === 'object') {
                    // Format validation errors
                    errorMessage = Object.entries(data)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                } else {
                    errorMessage = data?.detail || data?.message || `Server error: ${error.response.status}`;
                }
            } else if (error.request) {
                // No response from backend
                errorMessage = 'Cannot reach server. Is the backend running on localhost:8001?';
            }
            
            setErrors({ general: errorMessage });
            Alert.alert('❌ Registration Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
                {/* Header with Gradient */}
                <LinearGradient
                    colors={['#3B82F6', '#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pt-16 pb-8 px-6 rounded-b-3xl"
                >
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="mb-6"
                    >
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    
                    <Text className="text-4xl font-bold text-white mb-2">
                        Create Account
                    </Text>
                    <Text className="text-blue-100 text-base">
                        Join our community today!
                    </Text>
                </LinearGradient>

                <View className="px-6 py-8">
                    {/* General Error Message */}
                    {errors.general && (
                        <View className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                            <View className="flex-row items-start">
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
                                placeholder="Choose a username"
                                placeholderTextColor="#9CA3AF"
                                value={formData.username}
                                onChangeText={(text) => updateFormData('username', text)}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>
                        {errors.username && (
                            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.username}</Text>
                        )}
                    </View>

                    {/* Email Input */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Email</Text>
                        <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 ${errors.email ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-gray-800"
                                placeholder="your.email@example.com"
                                placeholderTextColor="#9CA3AF"
                                value={formData.email}
                                onChangeText={(text) => updateFormData('email', text)}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                        {errors.email && (
                            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>
                        )}
                    </View>

                    {/* Name Row */}
                    <View className="flex-row gap-3 mb-4">
                        {/* First Name */}
                        <View className="flex-1">
                            <Text className="text-gray-700 font-semibold mb-2 ml-1">First Name</Text>
                            <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 ${errors.firstName ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                                <TextInput
                                    className="flex-1 text-base text-gray-800"
                                    placeholder="John"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.firstName}
                                    onChangeText={(text) => updateFormData('firstName', text)}
                                />
                            </View>
                            {errors.firstName && (
                                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</Text>
                            )}
                        </View>

                        {/* Last Name */}
                        <View className="flex-1">
                            <Text className="text-gray-700 font-semibold mb-2 ml-1">Last Name</Text>
                            <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 ${errors.lastName ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                                <TextInput
                                    className="flex-1 text-base text-gray-800"
                                    placeholder="Doe"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.lastName}
                                    onChangeText={(text) => updateFormData('lastName', text)}
                                />
                            </View>
                            {errors.lastName && (
                                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</Text>
                            )}
                        </View>
                    </View>

                    {/* Password Input */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Password</Text>
                        <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 ${errors.password ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-gray-800"
                                placeholder="At least 8 characters"
                                placeholderTextColor="#9CA3AF"
                                value={formData.password}
                                onChangeText={(text) => updateFormData('password', text)}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons 
                                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                    size={20} 
                                    color="#9CA3AF" 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && (
                            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text>
                        )}
                    </View>

                    {/* Confirm Password Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Confirm Password</Text>
                        <View className={`flex-row items-center bg-white rounded-xl px-4 py-3 ${errors.confirmPassword ? 'border-2 border-red-500' : 'border border-gray-200'}`}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-gray-800"
                                placeholder="Re-enter your password"
                                placeholderTextColor="#9CA3AF"
                                value={formData.confirmPassword}
                                onChangeText={(text) => updateFormData('confirmPassword', text)}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons 
                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                    size={20} 
                                    color="#9CA3AF" 
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && (
                            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</Text>
                        )}
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className={`mb-6 shadow-lg overflow-hidden rounded-xl ${loading ? 'opacity-70' : ''}`}
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
                                <Text className="text-white font-bold text-lg">Create Account</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Terms Text */}
                    <Text className="text-center text-gray-600 text-xs mb-6 px-4">
                        By signing up, you agree to our{' '}
                        <Text className="text-blue-500 font-semibold">Terms of Service</Text>
                        {' '}and{' '}
                        <Text className="text-blue-500 font-semibold">Privacy Policy</Text>
                    </Text>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-500 font-bold text-base">Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
    );
}
