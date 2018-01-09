import React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { StatusBar } from 'react-native';
import { TabScreen } from 'components/TabScreen';

export class Navigation extends React.Component {
  render() {
      // The screen's current route is passed in to `props.navigation.state`:
      const { params } = this.props.navigation.state;
      return (
        <View>
            <StatusBar hidden={true} />
            <TabScreen />
        </View>
      );
  }// end render function
}// end class Navigation