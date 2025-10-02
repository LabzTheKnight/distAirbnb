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
};