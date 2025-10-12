import { RegisterRequest, LoginRequest, AuthResponse , User } from "@/types/auth";
import { removeToken, saveToken } from "../storage/tokenStorage";
import { authAPI } from "./apiClient";

const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
    try {
        console.log('🌐 authService: Sending login request to backend...');
        const response = await authAPI.post<AuthResponse>('/login/', loginData);
        console.log('📡 authService: Received response:', response.status, response.data);
        console.log('💾 authService: Saving token...');
        await saveToken(response.data.token);
        console.log('✅ authService: Token saved, returning data');
        return response.data;

    } catch (error) {
        console.error('❌ authService: Login error:', error);
        throw error;
    }
    
};

const register = async (registrationData: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await authAPI.post<AuthResponse>('/register/', registrationData);
        await saveToken(response.data.token);
        return response.data;
    } catch (error) {
        console.log('Register error:', error);
        throw error;
    }
};

const logout = async (): Promise<{message: string}> => {
    try{
        const response = await authAPI.post('/logout/');
        await removeToken();
        return response.data
    } catch (error){
        console.log('Logout error: ', error);
        await removeToken();
        throw error;
    }
}

const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await authAPI.get('/profile/');
        return response.data; 
    } catch (error) {
        console.log('Get current user error:', error);
        throw error;
    }
};

export { login, register, logout , getCurrentUser };