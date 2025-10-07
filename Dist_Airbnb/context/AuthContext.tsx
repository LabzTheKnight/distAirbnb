import React, {createContext, useContext, useState, useEffect} from "react";
import { User, LoginRequest, AuthContextType } from "@/types/auth";
import { login, logout, getCurrentUser } from "@/services/api/authService";
import { isLoggedIn as checkStoredLogin, removeToken } from "@/services/storage/tokenStorage";



const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser]= useState <User | null>(null);
    const [isLoading, setLoading] = useState(true)
    const isLoggedIn = user !== null;

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const hasToken = await checkStoredLogin();
                if (hasToken) {
                    const currentUser = await getCurrentUser();
                    setUser(currentUser)
                    setLoading(false)
                }
            } catch (error) {
                console.error('Auth check error:', error);
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
                    const response = await login({username, password})
                    setUser(response.user)
                } catch(error){
                    console.error('Sign in error:', error)
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
            }
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context;
}