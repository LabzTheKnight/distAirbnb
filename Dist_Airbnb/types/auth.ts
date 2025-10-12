export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        is_active: boolean;
        date_joined: string;
    };
    token: string;
}



export interface User{
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;
}

export interface AuthContextType{
    user:  User| null;
    isLoggedIn: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signUp:(username: string, email: string, password: string, password_confirm: string,first_name: string, last_name: string) => Promise<void>;
};