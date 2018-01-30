import React from "react";
import { View, StatusBar } from "react-native";
import { createRootNavigator } from "./includes/Router";
import { isSignedIn, saveUser, getAccessToken, refreshToken, getRefreshToken } from "./includes/Auth";
import { userInfo } from './includes/Spotify';
import { initSocket } from './includes/Socket';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      access_token: null
    };
    // create parent screen props to pass down to child screen components
    // we can use closures to pass functions to child components
    // that allow us to modify the state of the parent component
    this.screenProps = {
      get: (key) => this.state[key],
      set: (key, value, callback) => {
        this.setState((state) => {
          state[key] = value;
        }, callback);
      }, 
      getAppState: () => this.state,
      setAppState: (newState, callback) => {
        this.setState(newState, callback);
      }
    };
  }// end constructor App

  componentWillMount() {
    getAccessToken().then(token => {
      if(token) {
        // user is signed in, since the application was recently opened/mounted,
        // refresh the user's Spotify access token for seamless usage with the API
        getRefreshToken().then(refresh_token => {
          refreshToken(refresh_token).then((res) => {
            token = res.access_token;
            userInfo(token).then((user) => {
              // user is signed in, we want to initialize the web socket connection here
              var newState = {
                signedIn: true, 
                checkedSignIn: true, 
                token: token, 
                user: user, 
                socket: initSocket() 
              };
              this.setState(newState);
            });
          });
        });
      }else{
        this.setState({ signedIn: false, checkedSignIn: true, token: null, user: null });
      }// end if we have a Spotify access token
    }).catch(err => console.log(err));
  }// end componentWillMount function

  render() {
    const { checkedSignIn, signedIn, access_token } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) { return null; }
    
    const MainLayout = createRootNavigator(signedIn);
    return <MainLayout screenProps={this.screenProps}/>;
  }// end render function
}// end class App