import { RegisterRequest, LoginRequest, AuthResponse } from "@/types/auth";
import { saveToken } from "../storage/tokenStorage";
import { authAPI } from "./apiClient";

const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await authAPI.post<AuthResponse>('/login/', loginData);
        saveToken(response.data.token);
        return response.data;

    } catch (error) {
        console.log('Login error:', error);
        throw error;
    }
    
};

const register = async (registrationData: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await authAPI.post<AuthResponse>('/register/', registrationData);
        return response.data;
    } catch (error) {
        console.log('Register error:', error);
        throw error;
    }
};

export { login, register };