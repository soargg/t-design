import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { isFunction } from '../common/utils';
import Radio from './Radio';
import { RadioGroupContext } from './RadioGroupContext';
export default class RadioGroup extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            current: this.props.defaultValue || this.props.value || null,
        };
        this.onRadioChange = (value) => {
            const { current } = this.state;
            if (!('value' in this.props)) {
                this.setState({
                    current: value
                });
            }
            const { onChange } = this.props;
            if (value !== current && isFunction(onChange)) {
                onChange(value);
            }
        };
    }
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                current: nextProps.value || null,
            };
        }
        return null;
    }
    getOptions() {
        const { options = [] } = this.props;
        return options.map(option => {
            if (typeof option === 'string') {
                return {
                    label: option,
                    value: option
                };
            }
            return option;
        });
    }
    renderGroup() {
        const { current } = this.state;
        let { children } = this.props;
        const { options, disabled } = this.props;
        if (options && options.length > 0) {
            children = this.getOptions().map(option => (<Radio key={option.value.toString()} style={option.style} disabled={'disabled' in option ? option.disabled : disabled} value={option.value} checked={current === option.value} onChange={option.onChange}>
                    {option.label}
                </Radio>));
        }
        return children;
    }
    render() {
        const context = {
            current: this.state.current,
            disabled: this.props.disabled,
            onRadioChange: this.onRadioChange
        };
        return (<View style={[styles.radioGroup, this.props.style]}>
                <RadioGroupContext.Provider value={context}>
                    {this.renderGroup()}
                </RadioGroupContext.Provider>
            </View>);
    }
}
const styles = StyleSheet.create({
    radioGroup: {
        flexDirection: 'row'
    }
});
