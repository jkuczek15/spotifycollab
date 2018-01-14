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
      this.setState({ signedIn: (token != null), checkedSignIn: true, access_token: token });
    }).catch(err => alert("An error occurred"));
  }// end componentWillMount function

  render() {
    const { checkedSignIn, signedIn, access_token } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) { return null; }

    // create parent screen props to pass down to child screen components
    // we can use closures to pass functions to child components
    // that allow us to modify the state of the parent component
    const screenProps = {
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
    const MainLayout = createRootNavigator(signedIn);
    return <MainLayout screenProps={screenProps}/>;
  }// end render function
}// end class App