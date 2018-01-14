import { AsyncStorage } from "react-native";

// authentication session store keys
export const USER_REFRESH_TOKEN = "refresh_token";
export const USER_TOKEN = "access_token";

export const saveAccessToken = async (token) => {
  try {
    AsyncStorage.setItem(USER_TOKEN, token);
  } catch (error) {
    // Error saving data
  }
};

export const getAccessToken = async () => {
  try {
    const value = await AsyncStorage.getItem(USER_TOKEN);
    if (value !== null){
      return value;
    }// end if we have user data
  } catch (error) {
    // Error retrieving data
  }
};

export const saveRefreshToken = async (token) => {
  try {
    AsyncStorage.setItem(USER_REFRESH_TOKEN, token);
  } catch (error) {
    // Error saving data
  }
};

export const getRefreshToken = async () => {
  try {
    const value = await AsyncStorage.getItem(USER_REFRESH_TOKEN);
    if (value !== null){
      return value;
    }// end if we have user data
  } catch (error) {
    // Error retrieving data
  }
};

export const onSignOut = async () => {
  await AsyncStorage.removeItem(USER_TOKEN);
  await AsyncStorage.removeItem(USER_REFRESH_TOKEN);
};

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_TOKEN)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};