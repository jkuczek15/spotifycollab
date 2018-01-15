import { AsyncStorage } from "react-native";
import { environment } from '../environments/environment';
import { Buffer } from 'buffer';
var querystring = require('querystring');

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

export const refreshToken = async (refresh_token) => {
return fetch('https://accounts.spotify.com/api/token?' + 
      querystring.stringify({
        refresh_token: refresh_token,
        grant_type: 'refresh_token'
      }),{
      method: "POST",
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer(environment.client_id + ':' + environment.client_secret).toString('base64'))
      }
  }).then(function(response) {
      return response.json();
  }, function(error) {
      console.log(error);
  });
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