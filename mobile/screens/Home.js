import React from "react";
import { play, devices } from '../includes/Spotify';
import { onSignOut } from '../includes/Auth';
import { View, Text, StyleSheet, Picker } from "react-native";
import { Button } from "react-native-elements";

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: ''
    };
    this.token = props.screenProps.get('token');
  }// end constructor App

  componentDidMount() {
    this.getDevices((devices) => {
      this.setState({devices: devices});
    });
  }// end componentDidMount

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

  getDevices(callback) {
    devices(this.token).then((res) => {
      callback(res.devices);
    });
  }// end function getDevices

  render() {
    let navigation = this.props.navigation;
    let deviceItems = '';
    if(this.state.devices){
      deviceItems = this.state.devices.map((device) => {
        return <Picker.Item key={device.id} value={device.name} label={device.name} />
      });
    }// end if we have devices
    return (
      <View style={{ paddingVertical: 25 }}>
        <Text>Select a Spotify device:</Text>
        <Picker
            onPress={this.test()}
            selectedValue={this.state.selectedDevice}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedDevice: itemValue})}>
            { deviceItems }
          </Picker>
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