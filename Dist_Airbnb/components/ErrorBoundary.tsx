import React, { ReactNode, ReactElement } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: '',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 ErrorBoundary caught error:', error);
    console.error('📋 Error Info:', errorInfo);

    this.setState({
      hasError: true,
      error,
      errorInfo: errorInfo.componentStack || '',
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: '',
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ScrollView className="flex-1 bg-red-50 pt-12 px-6">
          <View className="items-center mb-6">
            <View className="bg-red-500 rounded-full p-4 mb-4">
              <Ionicons name="alert" size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              Oops! Something went wrong
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              An error occurred while rendering this page. Please try reloading.
            </Text>
          </View>

          {/* Error Details (for debugging) */}
          <View className="bg-white rounded-lg p-4 mb-6 border border-red-200">
            <Text className="font-bold text-red-700 mb-2">Error Details:</Text>
            <Text className="text-xs text-gray-700 font-mono mb-3">
              {this.state.error?.message || 'Unknown error'}
            </Text>

            {__DEV__ && this.state.errorInfo && (
              <>
                <Text className="font-bold text-red-700 mt-3 mb-2">Stack Trace:</Text>
                <Text className="text-xs text-gray-600 font-mono">
                  {this.state.errorInfo.substring(0, 500)}
                  {this.state.errorInfo.length > 500 && '...'}
                </Text>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={this.resetError}
              className="bg-blue-500 rounded-lg py-3 items-center mb-2"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>

            {__DEV__ && (
              <TouchableOpacity
                onPress={() => {
                  console.log('Error details:', this.state);
                }}
                className="bg-gray-500 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Log Error to Console</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Debug Info */}
          {__DEV__ && (
            <View className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <Text className="text-xs text-yellow-800 font-semibold mb-2">
                💡 Development Mode Tips:
              </Text>
              <Text className="text-xs text-yellow-700 leading-5">
                • Check the console for detailed error messages{'\n'}
                • Make sure all backend services are running{'\n'}
                • Verify environment variables are set correctly{'\n'}
                • Check for useAuth() hook usage outside AuthProvider
              </Text>
            </View>
          )}
        </ScrollView>
      );
    }

    return this.props.children;
  }
}
