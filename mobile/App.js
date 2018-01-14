import React from "react";
import { createRootNavigator } from "./includes/Router";
import { isSignedIn, saveUser, getAccessToken } from "./includes/Auth";

export default class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false,
      access_token: null
    };
  }// end constructor App

  componentWillMount() {
    getAccessToken().then(token => {
      let signedIn;
      if(token){
        signedIn = true;
      }else{
        signedIn = false;
      }// end if we have valid access token
      this.setState({ signedIn: signedIn, checkedSignIn: true, access_token: token });
    }).catch(err => alert("An error occurred"));
  }// end componentWillMount function

  render() {
    const { checkedSignIn, signedIn, access_token } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) { return null; }

    // create parent screen props to pass down to screen components
    const screenProps = { 
      getAppState: () => this.state,
      setAppState: (newState, callback) => {
        this.setState(newState, callback);
      },
      get: (key) => this.state[key],
      set: (key, value, callback) => {
        this.setState((state) => {
          state[key] = value;
        }, callback);
      }
    };
    const MainLayout = createRootNavigator(signedIn);
    return <MainLayout screenProps={screenProps}/>;
  }// end render function
}// end class App