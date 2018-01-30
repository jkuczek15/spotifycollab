import React from "react";
import { play, devices } from '../includes/Spotify';
import { onSignOut } from '../includes/Auth';
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.token = props.screenProps.get('token');
  }// end constructor App

  playQueue() {
    let room = this.props.screenProps.get('room');
    var data = {
      context_uri: room.contextUri,
      offset: {
        position: 0
      }
    };

    devices(this.token).then((res) => {
      let device_id = res.devices[0].id;
      play(this.token, device_id, data).then((res) => {
        console.log(res);
      });
    });    
  }// end function playQueue

  render() {
    let navigation = this.props.navigation;
    return (
      <View style={{ paddingVertical: 25 }}>
        <Button
            buttonStyle={styles.button}
            title="PLAY QUEUE"
            onPress={() => this.playQueue()} />
        <Button
            buttonStyle={styles.button}
            title="SIGN OUT"
            onPress={() => onSignOut().then(() => navigation.navigate("SignedOut"))} />
      </View>
    );
  }// end render function

}// end class Home

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3C4044',
    margin: 5
  }
});