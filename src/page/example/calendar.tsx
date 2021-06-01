import React from 'react';
import {View} from 'react-native';
import { Calendar } from '../../components'


export default class CalendarPage extends React.Component {
    state: {checkIn: string; checkout: string} = {checkIn: '2021-09-24', checkout: '2021-09-25' }
    render() {
        return (
            <Calendar
                allowSelectionBeforeToday
                duration={['2021-05-31', '2021-10-25']}
                selectionStartText="入住"
                selectionEndText="离店"
                selectionStart={this.state.checkIn}
                selectionEnd={this.state.checkout}
                onChange={({ selectionEnd, selectionStart }) => {
                    this.setState({
                        checkIn: selectionStart,
                        checkout: selectionEnd
                    })
                }}
            />
        )
    }
}
