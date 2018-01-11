import React from "react";
import { View } from "react-native";
import { Card, Button } from "react-native-elements";
import { onSignIn } from "../includes/Auth";

export default ({ navigation }) => (
  <View style={{ paddingVertical: 20 }}>
    <Card>
      <Button
        backgroundColor="#23CF5F"
        title="Login With Spotify"
        onPress={() => {
          onSignIn().then(() => navigation.navigate("SignedIn"));
        }}
      />
    </Card>
  </View>
);