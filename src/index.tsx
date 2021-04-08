import React from 'react';
import { View, Text, Button } from 'react-native';
import { Toast } from './components'

export default class Home extends React.Component {

    render() {
        return (
            <View>
                <Text>Hello world</Text>
                <Button title="Toast" onPress={() => { Toast.loading('早点下班', 5000) }} />
            </View>
        );
    }
}