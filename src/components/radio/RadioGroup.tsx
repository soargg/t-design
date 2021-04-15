import * as React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { isFunction } from '../common/utils';
import Radio from './Radio';
import { RadioGroupContext, GroupContext, RadioValueType } from './RadioGroupContext';

type RadioOptionType = {
    label: React.ReactNode;
    value: RadioValueType;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    onChange?(next: boolean): void;
}

type RadioGroupProps = {
    /**
     * options
     * 选择框列表
     */
    options?: Array<RadioOptionType | string>;
    /**
     * defaultValue
     * more值列表
     */
    defaultValue?: RadioValueType;
    /**
     * value
     * 已选值列表
     */
    value?: RadioValueType;
    /**
     * style
     * Group样式
     */
    style?: StyleProp<ViewStyle>;
    /**
     * disabled
     * 禁用
     */
    disabled?: boolean;
    /**
     * onChange
     * 状态变化时回调
     */
    onChange?(checkedValue: RadioValueType): void;
}
type RadioGroupState = {
    current: RadioValueType;
}


export default class RadioGroup extends React.PureComponent<RadioGroupProps, RadioGroupState> {
    state: RadioGroupState = {
        current: this.props.defaultValue || this.props.value || null,
    }

    static getDerivedStateFromProps(nextProps: RadioGroupProps) {
        if ('value' in nextProps) {
            return {
                current: nextProps.value || null,
            };
        }
        return null;
    }

    getOptions() {
        const { options=[] } = this.props;
        return (options as RadioOptionType[]).map( option => {
            if (typeof option === 'string') {
                return {
                    label: option,
                    value: option
                } as RadioOptionType
            }

            return option;
        });
    }

    onRadioChange = (value: RadioValueType) => {
        const { current } = this.state;
        if (!('value' in this.props)) {
            this.setState({
                current: value
            })
        }
        const { onChange } = this.props;
        if (value !== current && isFunction(onChange)) {
            onChange(value)
        }
    }

    renderGroup(): React.ReactNode {
        const { current } = this.state;
        let { children } = this.props;
        const { options, disabled } = this.props;

        if (options && options.length > 0) {
            children = this.getOptions().map( option => (
                <Radio
                    key={option.value.toString()}
                    style={option.style}
                    disabled={ 'disabled' in option ? option.disabled : disabled }
                    value={option.value}
                    checked={current === option.value}
                    onChange={option.onChange}
                >
                    { option.label }
                </Radio>
            ));
        }

        return children;
    }

    render() {
        const context: GroupContext = {
            current: this.state.current,
            disabled: this.props.disabled,
            onRadioChange: this.onRadioChange
        };

        return (
            <View style={ [styles.radioGroup, this.props.style] }>
                <RadioGroupContext.Provider value={context}>
                    { this.renderGroup() }
                </RadioGroupContext.Provider>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    radioGroup: {
        flexDirection: 'row'
    }
})