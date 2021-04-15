import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import AnimationView from '../common/animation';
import { isFunction, isString } from '../common/utils';
import { RadioGroupContext } from './RadioGroupContext';
export default class Radio extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            ischecked: !!this.props.checked
        };
        this.toggle = () => {
            const { value, onChange } = this.props;
            const radioGroup = this.context;
            let { ischecked } = this.state;
            if (radioGroup) {
                radioGroup.onRadioChange(value);
                ischecked = radioGroup.current === value;
            }
            else {
                if (!('checked' in this.props)) {
                    this.setState((state) => {
                        return {
                            ischecked: !state.ischecked
                        };
                    });
                }
            }
            if (isFunction(onChange)) {
                onChange(!ischecked);
            }
        };
    }
    static getDerivedStateFromProps(nextProps) {
        if ('checked' in nextProps) {
            return {
                ischecked: nextProps.checked
            };
        }
        return null;
    }
    render() {
        const { children, style, value } = this.props;
        const btnStyle = [styles.radioBtn];
        const radioGroup = this.context;
        let { ischecked } = this.state;
        if (radioGroup) {
            ischecked = radioGroup.current === value;
        }
        if (ischecked) {
            btnStyle.push(styles.checked);
        }
        return (<TouchableOpacity style={[styles.radio, style]} activeOpacity={0.75} onPress={this.toggle}>
                <View style={btnStyle}>
                    {ischecked ?
                <AnimationView animationType="scale" active during={100}>
                            <View style={styles.checkedCore}/> 
                        </AnimationView>
                :
                    null}
                </View>
                {isString(children) ? <Text style={styles.label}>{children}</Text> : children}
            </TouchableOpacity>);
    }
}
Radio.contextType = RadioGroupContext;
const styles = StyleSheet.create({
    radio: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    radioBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#DADADA',
    },
    checked: {
        borderColor: '#FA8C1D'
    },
    checkedCore: {
        width: 6,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#FA8C1D'
    },
    label: {
        fontSize: 12,
        color: '#333'
    }
});
