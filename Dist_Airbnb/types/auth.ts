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