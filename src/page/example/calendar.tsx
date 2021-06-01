import React from 'react';
import {View} from 'react-native';
import { Calendar } from '../../components'


export default class CalendarPage extends React.Component {
    state: {checkIn: string; checkout: string} = {checkIn: '2021-06-10', checkout: '2021-06-12' }
    render() {
        return (
            <Calendar
                selectionStartText="入住"
                selectionEndText="离店"
                selectionStart={this.state.checkIn}
                selectionEnd={this.state.checkout}
                onChange={({ selectionEnd, selectionStart }) => {
                    console.log(selectionEnd, selectionStart);
                    
                    this.setState({
                        checkIn: selectionStart,
                        checkout: selectionEnd
                    })
                }}
            />
        )
    }
}
