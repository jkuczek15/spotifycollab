import React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StatusBar } from 'react-native';

class RecentChatsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: `Recent Chats`,
    });
    render() {
        return (
        <View>
            <StatusBar hidden={true} />
            <Text>List of recent chats</Text>
            <Button
            onPress={() => this.props.navigation.navigate('Chat', { user: 'Jane' })}
            title="Chat with Jane"
            />
        </View>
        );
    }// end render function
}// end class RecentChatsScreen

class AllContactsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: `All contacts`,
    });
    render() {
        return (
        <View>
            <StatusBar hidden={true} />
            <Text>List of all contacts</Text>
            <Button
            onPress={() => this.props.navigation.navigate('Chat', { user: 'Lucy' })}
            title="Chat with Lucy"
            />
        </View>
        );
    }// end render function
}// end class AllContactsScreen
  
export const TabScreen = TabNavigator(
    {
      Recent: { screen: RecentChatsScreen },
      All: { screen: AllContactsScreen },
    },
    {
      tabBarPosition: 'bottom'
    }
);