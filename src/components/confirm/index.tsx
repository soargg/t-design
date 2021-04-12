/**
 * @component Confirm
 * @description 确认弹窗组件，居中展现需要关注的信息
 * 
 * - 类似浏览器原生API调用方式。
 * - 返回一个Promise实例对象，可通过then方法绑定确定按钮回调。
 * 
 * @author liyeg
 * @Date 2020/06/17
 */

import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, BackHandler } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { screenWidth } from '../common';
import { isFunction, isString } from '../common/utils';
import Portal from '../portal/portalProvider';
import PortalContext from '../portal/portalContext';
import AnimationView from '../common/animation';

type contentModule = string | (() => React.ReactNode)
    | {
        content: string | (() => React.ReactNode);
        title?: string;
        btnText?: [string, string];
        btnStyles?: StyleProp<ViewStyle>[];
        btnTxtStyles?: StyleProp<TextStyle>[];
        cancel?: boolean;
        zIndex?: number;
    }

type ConfirmProps = {
    children: React.ReactNode | string,
    title?: string;
    okText?: string;
    cancelText?: string;
    okBtnStyle?: StyleProp<ViewStyle>;
    cancelBtnStyle?: StyleProp<ViewStyle>;
    okStyle?: StyleProp<TextStyle>;
    cancelStyle?: StyleProp<TextStyle>;
    showCancelBtn?: boolean;
    onCancelPress: (() => void) | false;
    onOkPress(): void;
    onFinish(): void;
}
type ComfirmState = {
    visible: boolean
}
class ConfirmView extends React.PureComponent<ConfirmProps, ComfirmState> {
    static contextType = PortalContext;

    state: ComfirmState = {
        visible: true
    }

    render() {
        const {
            children,
            title,
            okText = '我知道',
            cancelText = '取消',
            okStyle,
            cancelStyle,
            okBtnStyle,
            cancelBtnStyle,
            onCancelPress,
            onOkPress,
            onFinish
        } = this.props;

        return (
            <View style={styles.mask}>
                <AnimationView
                    active={this.state.visible}
                    animationType="fadeInOut"
                    style={styles.card}
                    onFinish={onFinish}
                >
                    {title ? <Text style={styles.title}>{title}</Text> : null}
                    <View style={styles.content}>
                        {
                            isString(children) ?
                                <Text style={styles.contentTxt}>{children}</Text>
                                :
                                children
                        }
                    </View>
                    <View style={[styles.footer, { justifyContent: onCancelPress ? 'space-between' : 'center' }]}>
                        {
                            // 取消按钮
                            onCancelPress ?
                                <TouchableOpacity
                                    style={[styles.confirmButton, styles.division, cancelBtnStyle]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        this.setState({
                                            visible: false
                                        });
                                        onCancelPress();
                                    }}
                                >
                                    <Text style={[styles.btnTxt, styles.cancel, cancelStyle]}>{cancelText}</Text>
                                </TouchableOpacity>
                                :
                                null
                        }
                        {/* 确认按钮 */}
                        <TouchableOpacity
                            style={[styles.confirmButton, okBtnStyle]}
                            activeOpacity={0.8}
                            onPress={() => {
                                // 消失动画
                                this.setState({
                                    visible: false
                                });
                                onOkPress();
                            }}
                        >
                            <Text style={[styles.btnTxt, styles.ok, okStyle]}>{okText}</Text>
                        </TouchableOpacity>
                    </View>
                </AnimationView>
            </View>
        );
    }
}

/**
 * @method Confirm
 * @param {String | Function | Object} option 为配置对象是，可以接受以下参数
 * @param { String | Function } [option.content] 组件显示的内容，支持字符串和 jsx（返回 jsx 的回调函数，`() => jsx`）
 * @param { String } [option.title] 组件展示的标题
 * @param { Array } [option.btnText] 按钮的文本 两个元素分别表示右/左按钮的文本
 * @param { Boolean } [option.cancel] 是否展示取消按钮
 */
export default function Confirm(content: contentModule): Promise<boolean> {
    let title: string = '', btnText: [string, string] = ['确认', '取消'], cancel: boolean = true, zIndex: number = 99;
    let btnTxtStyles: StyleProp<TextStyle>[] = [null, null];
    let btnStyles: StyleProp<ViewStyle>[] = [null, null];

    if (typeof content === 'object') {
        const opt = content;
        title = opt.title !== undefined ? opt.title : title;
        content = opt.content !== undefined ? opt.content : '';
        btnText = Array.isArray(opt.btnText) ? opt.btnText : btnText;
        cancel = opt.cancel !== undefined ? opt.cancel : cancel;
        btnTxtStyles = ('btnTxtStyles' in opt) ? opt.btnTxtStyles : btnTxtStyles;
        btnStyles = ('btnStyles' in opt) ? opt.btnStyles : btnStyles;
        zIndex = ('zIndex' in opt) ? opt.zIndex : zIndex;
    }

    // 判断 content 是字符串还是方法类型
    const contentEle: React.ReactNode = isFunction(content) ? (content as Function)() : content;
    const [okText, cancelText] = btnText;
    const [okStyle, cancelStyle] = btnTxtStyles;
    const [okBtnStyle, cancelBtnStyle] = btnStyles;

    // 拦截Android返回键
    const handleBack = () => true;
    BackHandler.addEventListener('hardwareBackPress', handleBack);

    return new Promise(resolve => {
        const handleResolve = (confirm: boolean) => {
            // 释放Android返回
            BackHandler.removeEventListener('hardwareBackPress', handleBack);
            Portal.unmount(key);
            resolve(confirm);
        }

        // 是否展示取消按钮判断
        const onCancelPress = cancel ? () => { handleResolve(false) } : false;
        const key: number = Portal.mount(
            <ConfirmView
                title={title}
                okText={okText}
                cancelText={cancelText}
                okStyle={okStyle}
                cancelStyle={cancelStyle}
                okBtnStyle={okBtnStyle}
                cancelBtnStyle={cancelBtnStyle}
                onOkPress={() => {
                    handleResolve(true);
                }}
                onCancelPress={onCancelPress}
                onFinish={() => {
                    // 卸载Comfirm
                }}
            >
                {
                    contentEle
                }
            </ConfirmView>
            , zIndex);
    })
}

const cardWidth: number = screenWidth * 542 / 750;
const styles = StyleSheet.create({
    mask: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    card: {
        width: cardWidth,
        paddingTop: 30,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
    },
    title: {
        marginBottom: 10,
        fontSize: 16,
        letterSpacing: 0,
        fontWeight: '600',
        textAlign: 'center',
        color: '#030303',
    },
    content: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 30
    },
    contentTxt: {
        fontSize: 14,
        lineHeight: 23,
        letterSpacing: 0,
        color: '#333333'
    },
    footer: {
        height: 45,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#E9E9E9'
    },
    confirmButton: {
        flex: 1,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    division: {
        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#E9E9E9'
    },
    btnTxt: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        letterSpacing: 0
    },
    ok: {
        color: '#FF9645'
    },
    cancel: {
        color: '#999999'
    }
});
