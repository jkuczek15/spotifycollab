import React from "react";
import { View } from "react-native";
import { Card, Button } from "react-native-elements";
import { saveAccessToken, saveRefreshToken } from '../includes/Auth';
import { AuthSession } from 'expo';
import { environment } from '../environments/environment';
import { Buffer } from 'buffer'
var querystring = require('querystring');

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null
    };
  }// end constructor App

  getToken = async (code) => {
    // fetch the access token in order for us to make 
    // Spotify web api calls. We fetch this token
    // using the authorization code given to us after the user logs in successfully
    let redirect_uri = AuthSession.getRedirectUrl();

    return fetch('https://accounts.spotify.com/api/token?'+
        querystring.stringify({
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        }),
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(environment.client_id + ':' + environment.client_secret).toString('base64'))
          }
        }).then(function(response) {
          return response.json();
        }, function(error) {
          console.log(error);
        })
  }// end function getToken

  login = async () => {
    let redirect_uri = AuthSession.getRedirectUrl();

    let authUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: environment.client_id,
        scope: environment.scopes,
        redirect_uri: redirect_uri
    });
    let result = await AuthSession.startAsync({
      authUrl: authUrl
    });
    
    if(result.type !== 'cancel' && result.errorCode == null && result.params.code !== null) {
      // result gives us the Spotify authorization code
      let code = result.params.code;

      this.getToken(code).then(data => {
        // save the relevant user tokens using async storage
        saveAccessToken(data.access_token);
        saveRefreshToken(data.refresh_token);
        // navigate to the tab navigator after they sign in
        this.props.navigation.navigate("SignedIn");
      });
    }// end if we have a valid Spotify auth code

  }// end login function

  render() {
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