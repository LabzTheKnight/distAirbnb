import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';
//these functions willl be used later in other folders like auth api to save tokens
export const saveToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const getToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error){
        console.error('Error getting token:', error);
        return null;
    }
}

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

export const isLoggedIn = async (): Promise<boolean> => {
    const token = await getToken();
    return token !== null;
};

//  Save user data too
export const saveUserData = async (userData: any) => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};