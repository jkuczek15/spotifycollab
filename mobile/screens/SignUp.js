import React from "react";
import { View } from "react-native";
import { Card, Button } from "react-native-elements";
import { login } from "../includes/Auth";
import { AuthSession } from 'expo';

const FB_APP_ID = 'YOUR_APP_ID'; 

export default class Signup extends React.Component {
  state = {
    result: null,
  };

  login = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    console.log(redirectUrl);
    let result = await AuthSession.startAsync({
      authUrl:
        `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
        `&client_id=${FB_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });
    this.setState({ result });
  }// end login function

  render(){
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card>
          <Button
            backgroundColor="#23CF5F"
            title="Login With Spotify"
            onPress={this.login}
          />
        </Card>
      </View>
    );
  }// end render function
}// end class Signup