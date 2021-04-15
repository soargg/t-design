import * as React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Checkbox from './Checkbox';
import { isFunction } from '../common/utils';
import { CheckboxValueType, CheckboxOptionType, GroupContext, CheckboxGroupContext } from './CheckboxGroupContext';

type CheckboxGroupProps = {
    /**
     * options
     * 选择框列表
     */
    options?: Array<CheckboxOptionType | string>;
    /**
     * defaultValue
     * more值列表
     */
    defaultValue?: CheckboxValueType[];
    /**
     * value
     * 已选值列表
     */
    value?: CheckboxValueType[];
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
    onChange?(checkedValue: CheckboxValueType[]): void;
}
type CheckboxGroupState = {
    values: CheckboxValueType[];
    registeredValues: CheckboxValueType[]; // 用于排序和过滤脏数据
}
class CheckboxGroup extends React.PureComponent<CheckboxGroupProps, CheckboxGroupState> {
    state:CheckboxGroupState = {
        values: this.props.defaultValue || this.props.value || [],
        registeredValues: []
    }

    static getDerivedStateFromProps(nextProps: CheckboxGroupProps) {
        if ('value' in nextProps) {
            return {
                values: nextProps.value || [],
            };
        }
        return null;
    }

    getOptions() {
        const { options=[] } = this.props;
        return (options as CheckboxOptionType[]).map( option => {
            if (typeof option === 'string') {
                return {
                    label: option,
                    value: option
                } as CheckboxOptionType
            }

            return option;
        });
    }

    cancelValue = (value: CheckboxValueType) => {
        this.setState(({ registeredValues }) => ({
            registeredValues: registeredValues.filter(val => val !== value),
        }));
    };
    
    registerValue = (value: CheckboxValueType) => {
        this.setState(({ registeredValues }) => ({
            registeredValues: [...registeredValues, value]
        }));
    };

    toggleOption = (option: CheckboxOptionType) => {
        const { registeredValues } = this.state;
        const optionIndex = this.state.values.indexOf(option.value);
        const values = [...this.state.values];
        // 如果已经选了就移除 没选就添加进来
        if (optionIndex === -1) {
            values.push(option.value);
        } else {
            values.splice(optionIndex, 1);
        }
        // value 如果已经通过传参来控制了，内部将不主动去setState
        if (!('value' in this.props)) {
            this.setState({ values });
        }
        const { onChange } = this.props;

        if (isFunction(onChange)) {
            const options = this.getOptions();
            // 根据 options 和 registeredValues 做下过滤和排序
            onChange(
                values
                    .filter(val => registeredValues.indexOf(val) !== -1)
                    .sort((a, b) => {
                        const indexA = options.findIndex(opt => opt.value === a);
                        const indexB = options.findIndex(opt => opt.value === b);
                        return indexA - indexB;
                    }),
            );
        }
    }

    renderGroup(): React.ReactNode {
        const { values } = this.state;
        let { children } = this.props;
        const { options, disabled } = this.props;

        if (options && options.length > 0) {
            children = this.getOptions().map( option => (
                <Checkbox
                    key={option.value.toString()}
                    style={option.style}
                    disabled={ 'disabled' in option ? option.disabled : disabled }
                    value={option.value}
                    checked={values.indexOf(option.value) !== -1}
                    onChange={option.onChange}
                >
                    { option.label }
                </Checkbox>
            ));
        }

        return children;
    }

    render() {
        const context: GroupContext = {
            values: this.state.values,
            disabled: this.props.disabled,
            toggleOption: this.toggleOption,
            registerValue: this.registerValue,
            cancelValue: this.cancelValue
        };

        return (
            <View style={ [styles.checkboxGroup, this.props.style] }>
                <CheckboxGroupContext.Provider value={context}>
                    { this.renderGroup() }
                </CheckboxGroupContext.Provider>
            </View>
        );
    }
}

export default CheckboxGroup;

const styles = StyleSheet.create({
    checkboxGroup: {
        flexDirection: 'row'
    }
})