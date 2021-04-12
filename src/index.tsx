import React from 'react';
import { View, Text, Button } from 'react-native';
import {
    Toast,
    Popup,
    Rating,
    CircularProgress,
    Alert,
    Confirm,
    Popover
} from './components'

export default class Home extends React.Component {

    state = {
        show: false
    }

    render() {
        return (
            <View style={{ paddingHorizontal: 20 }}>
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
                        this.setState({ show: false });
                        Confirm(() => <Text style={{color: 'red'}}>知道了</Text>)
                    }}
                >
                    <Text>Hello world</Text>
                </Popup>
                <Rating />
                <CircularProgress fill={68} size={80} width={5}/>
                <Popover
                    bubble={<Text style={{color: '#fff'}}>气泡气泡</Text>}
                >
                    <Text style={{backgroundColor: 'pink'}}>点我有气泡</Text>
                </Popover>
            </View>
        );
    }
}