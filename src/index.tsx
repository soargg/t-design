import React from 'react';
import { View, Text, Button } from 'react-native';
import { Toast, Popup } from './components'

export default class Home extends React.Component {

    state = {
        show: false
    }

    render() {
        return (
            <View>
                <Text>Hello world</Text>
                <Button title="Toast" onPress={() => { Toast.loading('早点下班', 5000) }} />
                <Button title="Popup" onPress={() => { this.setState({show: true}) }} />
                <Popup
                    style={{
                        width: 180,
                        height: 280,
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                        borderRadius: 19
                    }}
                    show={this.state.show}
                    onMaskPress={ () => {
                        this.setState({ show: false })
                    }}
                >
                    <Text>Hello world</Text>
                </Popup>
            </View>
        );
    }
}