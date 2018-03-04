import React from "react";
import { play, pause, devices } from '../includes/Spotify';
import { onSignOut } from '../includes/Auth';
import { View, Text, StyleSheet, Picker } from "react-native";
import { Button } from "react-native-elements";

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: {},
      paused: true
    };
    this.token = props.screenProps.get('token');
  }// end constructor App

  componentDidMount() {
    this.getDevices((devices) => {
      this.setState({devices: devices, selectedDevice: devices[0]});
    });
  }// end componentDidMount

  playControl() {
    let room = this.props.screenProps.get('room');
    var data = {
      context_uri: room.contextUri,
      offset: {
        position: 0
      }
    };
    if(this.state.paused){
      play(this.token, this.state.selectedDevice.id, data).then((data) => {
        this.setState({paused: false});
      });
    }else{
      pause(this.token).then((data) => {
        this.setState({paused: true});
      });
    }// end if paused
       
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
        return <Picker.Item key={device.id} value={device} label={device.name} />
      });
    }// end if we have devices
    return (
      <View style={{ paddingVertical: 25 }}>
        <Text>Select a Spotify device:</Text>
        <Picker
            selectedValue={this.state.selectedDevice}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedDevice: itemValue})}>
            { deviceItems }
          </Picker>
        <Button
            buttonStyle={styles.button}
            title={(this.state.paused ? 'PLAY' : 'PAUSE') + " QUEUE"}
            onPress={() => this.playControl()} />
        <Button
            buttonStyle={styles.button}
            title="SIGN OUT"
            onPress={() => onSignOut().then(() => navigation.navigate("SignedOut"))} />
        <Button
            buttonStyle={styles.button}
            title="REFRESH DEVICES"
            onPress={() => this.componentDidMount()} />
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