/**
 * @component CheckboxProps
 * @description 复选框
 * @date 2020/07/06
 * @author liyeg
 * */ 
import * as React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { isFunction, isString } from '../common/utils';
import { CheckboxGroupContext, GroupContext, CheckboxValueType } from './CheckboxGroupContext'; 
import { icon_checkbox_circle, icon_checkbox_square } from '../common/icons';

export interface CheckboxProps {
    children?: React.ReactNode;
    /**
     * value
     * checkbox的值 ，唯一
     */
    value?: CheckboxValueType;
    /**
     * checked
     * 是否选中
     */
    checked?: boolean;
    /**
     * disabled
     * 禁用
     */
    disabled?: boolean;
    /**
     * style
     * checkbox 容器的样式
     */
    style?: StyleProp<ViewStyle>;
    /**
     * checkboxType
     * checkbox 类型，圆 或 方
     */
    checkboxType?: 'circle' | 'square';
    /**
     * indeterminate
     * 不确定状态
     */
    indeterminate?: boolean;
    /**
     * onChange
     * checkbox状态变化是回调
     */
    onChange?(next: boolean):void;
};

type CheckboxState = {
    isChecked: boolean;
};

class Checkbox extends React.PureComponent<CheckboxProps, CheckboxState> {
    type: any;

    static TRN_CHECKBOX = true;
    
    static contextType = CheckboxGroupContext;

    context: GroupContext;

    state: CheckboxState = {
        isChecked: !!this.props.checked
    }

    componentDidMount() {
        const { value } = this.props;
        this.context?.registerValue(value);
    }

    static getDerivedStateFromProps(nextProps: CheckboxProps) {
        if ('checked' in nextProps) {
            return {
                isChecked: nextProps.checked
            }
        }
        return null;
    }
    
    componentDidUpdate({value: prevValue}: CheckboxProps) {
        const {value} = this.props;
        if (value !== prevValue) {
            this.context?.cancelValue(prevValue);
            this.context?.registerValue(value);
        }
    }

    componentWillUnmount() {
        this.context?.cancelValue(this.props.value);
    }

    toggle() {
        const checkboxGroup: GroupContext = this.context;
        const { children, value } = this.props;
        let { isChecked } = this.state;

        if (checkboxGroup) {
            checkboxGroup.toggleOption({ label: children, value });
            isChecked = checkboxGroup.values.indexOf(value) !== -1;
        } else {
            if ( !('checked' in this.props) ) {
                this.setState((state: CheckboxState) => {
                    return {
                        isChecked: !state.isChecked
                    }
                });
            }
        }

        const { onChange } = this.props;
        if (isFunction(onChange)) {
            onChange(!isChecked);
        }
    }

    render() {
        const { children, style, checkboxType = 'circle', indeterminate=false, value } = this.props;
        const isCircle = checkboxType === 'circle';
        const uncheckedStyle = isCircle ? [styles.checkboxCircleBtn, styles.unchecked]
            :
            [styles.checkboxSquareBtn, styles.unchecked, styles.square];
        
        // checkbox 以children方式嵌套在Group内时
        const checkboxGroup = this.context;
        let { isChecked } = this.state;
        if (checkboxGroup) {
            isChecked = checkboxGroup.values.indexOf(value) !== -1;
        }

        return (
            <TouchableOpacity
                style={[styles.checkbox, style]}
                activeOpacity={0.75}
                onPress={() => {
                    this.toggle();
                }}
            >
            {
                isChecked ? 
                <Image
                    source={isCircle ? icon_checkbox_circle : icon_checkbox_square}
                    style={isCircle ? styles.checkboxCircleBtn : styles.checkboxSquareBtn}
                    resizeMode="cover"
                />
                :
                <View style={uncheckedStyle} >
                {
                    indeterminate ? <View style={isCircle ? styles.indeterminate : styles.indeterminateSquare}/> : null
                }
                </View>
            }
            {
                isString(children) ? <Text style={styles.label}>{ children }</Text> : children
            }
            </TouchableOpacity>
        );
    }
}

export default Checkbox;

const styles = StyleSheet.create({
    checkbox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    checkboxCircleBtn: {
        width: 16,
        height: 16,
        marginRight: 10 
    },
    checkboxSquareBtn: {
        height: 12,
        width: 12,
        marginRight: 10
    },
    unchecked: {
        borderRadius: 8,
        borderColor: '#DADADA',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    square: {
        borderRadius: 2,
    },
    indeterminate: {
        width: 6,
        height: 6,
        backgroundColor: '#ff9645',
        borderRadius: 3
    },
    indeterminateSquare: {
        width: 5,
        height: 5,
        backgroundColor: '#ff9645',
        borderRadius: 1
    },
    label: {
        fontSize: 12,
        color: '#333'
    }
});
