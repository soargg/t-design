import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { isFunction } from '../common/utils';
import Shadow from '../shadow';


type SwitchProps = {
    defaultChecked?: boolean;
    checked?: boolean;
    disabled?: boolean;
    onSwitch?(checked: boolean): void;
}

type SwitchState = {
    isChecked: boolean;
    on: boolean;
    slider: Animated.Value;
}

class Switch extends React.PureComponent<SwitchProps, SwitchState> {
    constructor(props: SwitchProps) {
        super(props);
        const { defaultChecked = false, checked } = props;
        const isChecked = checked === undefined ? defaultChecked : checked;
        
        this.state = {
            isChecked,
            on: isChecked,
            slider: new Animated.Value(isChecked ? 0 : -16)
        }
    }

    static getDerivedStateFromProps(nextProps: SwitchProps) {
        // 受控组件
        if (nextProps.checked !== undefined) {
            return {
                isChecked: nextProps.checked
            }
        }
        return null;
    }

    componentDidUpdate(_: Readonly<SwitchProps>, prevState: Readonly<SwitchState>): void {
        if (this.state.isChecked !== prevState.isChecked) {
            this.active();
        }
    }

    private active() {
        const { slider, isChecked, on } = this.state;
        Animated.timing(slider, {
            toValue: isChecked ? 0 : -16,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                on: !on
            });
        });
    };

    render() {
        const { disabled, checked, onSwitch } = this.props;
        const { isChecked, slider, on } = this.state;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={disabled}
                onPress={() => {
                    if (checked === undefined) {
                        this.setState({ isChecked: !isChecked });
                    }
                    if (isFunction(onSwitch)) onSwitch(!isChecked);
                }}
                style={styles.wrap}
            >
                <Animated.View style={[
                    styles.slide,
                    {
                        backgroundColor: on ? '#FF6E16' : '#E0E2E6',
                        opacity: disabled ? 0.8 : 1,
                        transform: [
                            { translateX: slider }
                        ]
                    }
                ]}>
                    <Shadow shadow="shadow1" style={[styles.indicator, {backgroundColor: disabled ? '#F7F9FB' : '#FFFFFF'}]}/>
                </Animated.View>
            </TouchableOpacity>
        );
    }
}

export default Switch;

const styles = StyleSheet.create({
    wrap: {
        flexGrow: 0,
        flexShrink: 0,
        height: 24,
        width: 40,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#E0E2E6'
    },
    slide: {
        height: 24,
        width: 40,
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 1
    },
    indicator: {
        height: 22,
        width: 22,
        borderRadius: 13,
        overflow: 'hidden'
    }
})