import React from "react";
import { View, Text, Platform, StatusBar} from "react-native";
import { Icon } from 'react-native-elements';
import { StackNavigator, TabNavigator } from "react-navigation";
import { FontAwesome } from '@expo/vector-icons';
import { handleRoomBack } from '../includes/BackHandle';
import { Ionicons } from '@expo/vector-icons';

// navigation screens
import Login from "../screens/Login";
import Home from "../screens/Home";
import Room from "../screens/Room";
import RoomForm from '../screens/RoomForm';
import Search from "../screens/Search";
import Songs from "../screens/Songs";
import Playlists from '../screens/Playlists';
import MusicHome from '../screens/MusicHome';
import ViewPlaylist from '../screens/ViewPlaylist';
import { saveAccessToken } from "./Auth";

const headerStyle = {
  //marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  backgroundColor: "#3C4044"
};

const searchHeaderStyle = {
  backgroundColor: "#3C4044",
  height: StatusBar.currentHeight - 100
}

const headerTitleStyle = {
  fontSize: 17,
  textAlign: 'center',
  alignSelf: 'center'
};

export const SignedOut = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      headerTitle: "Login",
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF"
    }
  }
});

export const MusicNavigator = StackNavigator({
  MusicHome: {
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
  ViewPlaylist: {
    screen: ViewPlaylist,
    navigationOptions: ({navigation}) => ({
      headerTitle: `${navigation.state.params.name}`,
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF",  
      headerRight: (<View></View>)
    })
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

export const SearchNavigator = StackNavigator(
  {
    Search: {
      screen: Search,
      navigationOptions: {
        headerStyle: searchHeaderStyle,
        headerTitleStyle: headerTitleStyle,
        headerTintColor: "#FFFFFF",    
        headerRight: (<View></View>)
      }
    }
  }
);

export const RoomNavigator = StackNavigator({
  RoomForm: {
    screen: RoomForm,
    navigationOptions: {
      headerTitle: "Join a Room",
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF"    
   }
  },
  Room: {
    screen: Room,
    navigationOptions: ({navigation}) => ({
      headerTitle: `${navigation.state.params.room.name}`,
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF",
      headerLeft: ({ goBack }) => <Ionicons name={'md-arrow-back'} color="white" size={25} style={{marginLeft: 20}}
                                    onPress={ () => { handleRoomBack(navigation) } }  />,  
      headerRight: (<View></View>)
    })
  },
});

export const HomeNavigator = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      headerTitle: "Home",
      headerStyle: headerStyle,
      headerTitleStyle: headerTitleStyle,
      headerTintColor: "#FFFFFF"    
   }
  },
});

export const SignedInTabs = TabNavigator (
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="home" size={22} color={tintColor} />
      }
    },
    Room: {
      screen: RoomNavigator,
      navigationOptions: {
        tabBarLabel: "Room",
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome name="group" size={22} color={tintColor} />
      }
    },
    Search: {
      screen: SearchNavigator,
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
        backgroundColor: "#3C4044"
      }
    }
  }
);

export const SignedIn = StackNavigator(
  {
    SignedInTabs: {
      screen: SignedInTabs,
    }
  }, {
    headerMode: 'none'
  }
);

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          header: <StatusBar
                      backgroundColor="blue"
                      barStyle="light-content"
                    />,
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
