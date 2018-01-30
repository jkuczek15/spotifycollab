import React from "react";
import { View, Text } from "react-native";
import { ListItem } from 'react-native-elements';

export default class FlatListItem extends React.PureComponent {

    constructor(props) {
        super(props);
    }// end constructor App

    render() {
        return <ListItem title={this.props.title}
                            subtitle={this.props.subtitle}
                            onPress={this.props.onPress} />;
    }// end render function
};