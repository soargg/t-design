import React, { PureComponent } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { THEME_COLOR } from '../common';
import { isFunction } from '../common/utils';
import { styles, txtStyle } from './styles';

import type { TouchableOpacityProps, StyleProp, ViewStyle, TextStyle, LayoutChangeEvent } from 'react-native';


type ButtonProps = {
    /**
     * children
     */
    children?: JSX.Element | string;
    /**
     * type
     * 按钮类型
     */
    type?: 'primary' | 'outline' | 'outline-week' | 'danger';
    /**
     * size
     * 按钮尺寸
     */
    size?: 'large' | 'middle' | 'small' | 'mini';
    /**
     * 按钮样式
     */
    style?: StyleProp<ViewStyle>;
    /**
     * 文本样式
     */
    btnTextStyle?: StyleProp<TextStyle>;
    /**
     * loading
     * 加载中
     */
    loading?: boolean;
} & TouchableOpacityProps;

export default class Button extends PureComponent<ButtonProps, { btnWidth: number }> {
    state = {
        btnWidth: 100
    }

    /**
     * 处理按钮样式
     * @returns StyleProp<ViewStyle>
     */
    private _getButtonStyles(): StyleProp<ViewStyle> {
        const { disabled=false, type='primary', size='middle', style } = this.props;
        const sizeStyle = styles[size] ? {...styles[size]} : {...styles['middle']};

        let backgroundColor = '#FFFFFF', borderWidth = 0, borderColor = 'transparent';

        if (disabled) {
            if (type === 'outline' || type === 'outline-week') {
                borderWidth = 1;
                borderColor = '#CCCCCC';
            } else {
                backgroundColor = '#CCCCCC';
            }
        } else {
            switch (type) {
                case 'primary':
                    backgroundColor = THEME_COLOR;
                    break;
                case 'outline':
                    borderWidth = 1;
                    borderColor = THEME_COLOR;
                    // 减去边框的的宽度
                    sizeStyle.paddingHorizontal -= 1;
                    break;
                case 'outline-week':
                    borderWidth = 1;
                    borderColor = '#CCCCCC';
                    // 减去边框的的宽度
                    sizeStyle.paddingHorizontal -= 1;
                    break;
                case 'danger':
                    backgroundColor = '#FF6666'
                    break;
                default:
                    break;
            }
        }

        return [styles.button, sizeStyle, { backgroundColor, borderWidth, borderColor }, style];
    }

    /**
     * 处理文本颜色
     * @returns StyleProp<TextStyle>
     */
    private _getTextStyle(): StyleProp<TextStyle> {
        const { disabled=false, type='primary', size='middle', btnTextStyle } = this.props;
        const sizeStyle = txtStyle[size] ? txtStyle[size] : txtStyle['middle'];

        // 默认白色
        let color = '#FFFFFF';
        if (type === 'outline') {
            // 主题色
            color = disabled ? '#CCCCCC' : THEME_COLOR; 
        } else if (type === 'outline-week') {
            // 弱button色
            color = disabled ? '#CCCCCC' : '#666666';
        }

        return [txtStyle.base, sizeStyle, { color }, btnTextStyle];
    };

    // btn size
    private _onLayout(event: LayoutChangeEvent) {
        const { width } = event.nativeEvent.layout;

        this.setState({
            btnWidth: width
        });

        if (isFunction(this.props.onLayout)) {
            this.props.onLayout(event);
        }
    }

    private _handleProps() {
        const {
            children,
            size,
            type,
            btnTextStyle,
            style,
            loading,
            disabled,
            activeOpacity = 0.8,
            onLayout,
            ...touchProps
        } = this.props;

        return {
            children,
            size,
            type,
            btnTextStyle,
            style,
            loading,
            disabled,
            activeOpacity,
            onLayout,
            touchProps
        }
    }

    private _handleChildren() {
        const { children } = this.props;

        if (typeof children === 'string') {
            // 文本颜色
            const textStyle = this._getTextStyle();
            return (
                <Text style={textStyle} numberOfLines={1} ellipsizeMode="clip">
                    {children }
                </Text>
            );
        } else if ( React.isValidElement(children)) { // 有效组件
            return children;
        } else {
            return null;
        }
    }

    private renderLoadingView(btnStyles: StyleProp<ViewStyle>): JSX.Element {
        const { size } = this.props; 
        const textStyles = this._getTextStyle();
        const { backgroundColor } = StyleSheet.flatten(btnStyles);
        const { color } = StyleSheet.flatten(textStyles);

        // 超小button的spin处理
        const spanStyle: StyleProp<ViewStyle> = [{ flex: 1 }];
        if (size === 'mini') {
            spanStyle.push(styles.spinMini);
        }

        return (
            <View style={[styles.spinView, {backgroundColor, width: this.state.btnWidth }]}>
                <ActivityIndicator
                    style={spanStyle}
                    size="small"
                    color={color}
                />
            </View>
        );
    }

    render() {
        const { touchProps, activeOpacity, loading, disabled } = this._handleProps();
        const btnStyles = this._getButtonStyles();

        return (
            <TouchableOpacity
                {...touchProps}
                disabled={disabled || loading}
                activeOpacity={activeOpacity}
                style={btnStyles}
                onLayout={this._onLayout.bind(this)}
            >
                { this._handleChildren() }
                { loading ? this.renderLoadingView(btnStyles) : null }
            </TouchableOpacity>
        );
    }
}