import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DrawerLayoutAndroid } from 'react-native';
import { StatusBar } from 'react-native';

export default class App extends React.Component {
  render() {
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#23CF5F'}}>
        <StatusBar hidden={true} />
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
      </View>
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Helloasdasd</Text>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
      </View>
    </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
