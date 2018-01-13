import React from "react";
import { createRootNavigator } from "./includes/Router";
import { isSignedIn, saveUser } from "./includes/Auth";

export default class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }// end constructor App

  componentWillMount() {
    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }// end componentWillMount function

  signIn(user) {
    saveUser(user);
    this.setState({ signedIn: true, checkedSignIn: true });
  }// end function signIn

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return <Layout signIn={this.signIn.bind(this)}/>;
  }// end render function
}// end class App