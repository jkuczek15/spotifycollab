import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormLabel, FormInput, Card, Button, Divider } from 'react-native-elements'

export default class Room extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      roomName: null
    };
    this.join = this.join.bind(this);
    this.host = this.host.bind(this);
    // get the spotify access token from our screen props
    access_token = props.screenProps.get('access_token');
  }// end constructor App

  join() {
    let roomName = this.state.roomName;
    console.log(roomName);
  }// end function join

  host() {
    let roomName = this.state.roomName;
    console.log(roomName);
  }// end function join

  render() {
    return (
      // implemented without image with header
      <View style={styles.container}>
        <Card title="Join a Room">
          <FormLabel>Room Name</FormLabel>
          <FormInput onChangeText={(text) => this.setState({roomName: text})} />
          <Divider style={styles.divider} />
          <Button
            buttonStyle={styles.button}
            icon={{name: 'handshake-o', type: 'font-awesome' }}
            title='JOIN ROOM' 
            onPress={this.join} />
          <Button
            buttonStyle={styles.button}
            icon={{name: 'plus', type:'entypo' }}
            title='HOST ROOM' 
            onPress={this.host} />
        </Card>
      </View>
    );
  }// end render function
}// end class Room

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
    paddingVertical: 25
  },
  divider:  {
    marginTop: 15,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#23CF5F',
    margin: 5
  }
});