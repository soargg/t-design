import React from 'react';
import {View, Button} from 'react-native';
import { Calendar, Popup } from '../../components'

export default class CalendarPage extends React.Component {
    private refCalendar: Calendar;

    state: {
        checkIn: string;
        checkout: string;
        show: boolean;
    } = {
        checkIn: '2021-06-24',
        checkout: '2021-06-25',
        show: false
    }

    componentDidMount() {
        if (this.refCalendar) {
            this.refCalendar.render();
        }
    }

    render() {
        return (
            <>
                <Button title="日历" onPress={() => {
                    this.setState({
                        show: true
                    })
                }}/>
                <Popup
                    animate="full"
                    show={this.state.show}
                    isFullScreen
                    forceRender
                >
                    <Button title="关闭" onPress={() => {
                        this.setState({
                            show: false
                        })
                    }}/>
                    <Calendar
                        ref={c => { this.refCalendar = c }}
                        allowSelectionBeforeToday
                        duration={['2021-06-01', '2021-11-25']}
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
                </Popup>
            </>
        )
    }
}
