import React from "react";
import { View, Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";
import { FontAwesome } from '@expo/vector-icons';
import { Header } from 'react-native-elements';

// navigation screens
import Login from "../screens/Login";
import Home from "../screens/Home";
import Room from "../screens/Room";
import Search from "../screens/Search";
import Songs from "../screens/Songs";
import Playlists from '../screens/Playlists';
import MusicHome from '../screens/MusicHome';

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  backgroundColor: "#23CF5F"
};

const headerTitleStyle = {
  fontSize: 17,
  textAlign: 'center',
  alignSelf: 'center'
};

export const SignedOut = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      title: "Login",
      headerStyle
    }
  }
});

export const MusicNavigator = StackNavigator({
  Home: {
    screen: MusicHome,
    navigationOptions: {
      headerTitle: "Music",
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF"    
   }
  },
  Playlists: {
    screen: Playlists,
    navigationOptions: {
      headerTitle: "Playlists",
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF",  
      headerRight: (<View></View>)
    }
  },
  Songs: {
    screen: Songs,
    navigationOptions: {
      headerTitle: "Songs",
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF",    
      headerRight: (<View></View>)
    }
  }
});

export const SignedIn = TabNavigator (
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="home" size={22} color={tintColor} />
      }
    },
    Room: {
      screen: Room,
      navigationOptions: {
        tabBarLabel: "Room",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="group" size={22} color={tintColor} />
      }
    },
    Search: {
      screen: Search,
      navigationOptions: {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="search" size={22} color={tintColor} />
      }
    },
    Music: {
      screen: MusicNavigator,
      navigationOptions: {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="music" size={22} color={tintColor} />
      }
    },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      style:{
        backgroundColor: "#23CF5F"
      }
    }
  }
);

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
