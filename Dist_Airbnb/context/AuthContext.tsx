import React, {createContext, useContext, useState, useEffect} from "react";
import { User, LoginRequest, AuthContextType } from "@/types/auth";
import { login, logout, getCurrentUser , register } from "@/services/api/authService";
import { isLoggedIn as checkStoredLogin, removeToken } from "@/services/storage/tokenStorage";

// Default context value to prevent null errors
const defaultAuthContext: AuthContextType = {
    user: null,
    isLoading: true,
    isLoggedIn: false,
    signIn: async () => { throw new Error('AuthContext not initialized') },
    signOut: async () => { throw new Error('AuthContext not initialized') },
    signUp: async () => { throw new Error('AuthContext not initialized') },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser]= useState <User | null>(null);
    const [isLoading, setLoading] = useState(true)
    const isLoggedIn = user !== null;

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                console.log('🔍 AuthContext: Checking for existing session...');
                const hasToken = await checkStoredLogin();
                if (hasToken) {
                    console.log('🎟️ AuthContext: Token found, fetching user profile...');
                    const currentUser = await getCurrentUser();
                    console.log('👤 AuthContext: User profile loaded:', currentUser);
                    setUser(currentUser)
                } else {
                    console.log('🚫 AuthContext: No token found, user not logged in');
                }
            } catch (error) {
                console.error('❌ AuthContext: Auth check error:', error);
                // Clear invalid token
                await removeToken();
            } finally {
                setLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);

    return(
        <AuthContext.Provider value={{
            user,
            isLoading, 
            isLoggedIn, 
            signIn: async(username: string, password: string) => {
                setLoading(true);
                try{
                    console.log('📞 AuthContext: Calling login API...');
                    const response = await login({username, password})
                    console.log('📦 AuthContext: Received response:', response);
                    console.log('👤 AuthContext: Setting user:', response.user);
                    setUser(response.user)
                    console.log('✅ AuthContext: User set successfully');
                } catch(error){
                    console.error('❌ AuthContext: Sign in error:', error)
                    await removeToken()
                    throw error;
                } finally{
                    setLoading(false);
                }
                
            },
            signOut: async () => {
                setLoading(true)
                try {
                    await logout(); 
                    setUser(null);
                } catch (error) {
                    console.error('Sign out error:', error);   
                    setUser(null);
                } finally{
                    setLoading(false)
                }
            },
            signUp: async (username, email, password, password_confirm,first_name, last_name) => {
                setLoading(true);
                try{
                    const response = await register({username, email,  password,password_confirm,first_name,last_name})
                    setUser(response.user)
                } catch(error){
                    console.error('Sign in error:', error)
                    await removeToken()
                    throw error;
                } finally{
                    setLoading(false);
                }
            }
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context;
}