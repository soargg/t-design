/**
 * @component Tips
 * @description 通告栏
 * @date 2020/07/06
 * @author liyeg
 * */

import React, { ReactNode } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
    TextStyle,
    Animated,
    Easing,
    findNodeHandle,
    UIManager
} from 'react-native';
import { isString, isFunction } from '../../common/utils';
import Icon from '../icon';
import { Mini } from '../mini';

type TipsProps = {
    /**
     * description
     * tips内容文本 可自定义 JSX
     */
    description?: string | ReactNode;
    /**
     * header
     * title区域内容
     */
    header?: string | ReactNode;
    /**
     * style
     * Tips样式
     */
    style?: StyleProp<ViewStyle>;
    /**
     * textStyle
     * 文本样式
     */
    textStyle?: StyleProp<TextStyle>;
    /**
     * closable
     * 是否可关闭
     * 默认 false 
     */
    closable?: boolean;
    /**
     * closeBtn
     * 露出关闭按钮，默认false x
     */
    closeBtn?: boolean;
    /**
     * btnTxt
     * 关闭按钮自定义文本
     */
    btnTxt?: string;
    /**
     * autoplay
     * 自动播放
     */
    autoplay?: boolean;
    /**
     * collapsable
     * 可隐藏的
     * 默认false
     */
    collapsable?: boolean;
    /**
     * defaultCollapse
     * 是否是隐藏状态
     * 默认false
     */
    defaultCollapse?: boolean;
    /**
     * nextNav
     * 带右箭头指引
     * 默认false
     */
    nextNav?: boolean;
    /**
     * numberOfLines
     * 参照Text组件
     */
    numberOfLines?: number;
    /**
     * ellipsizeMode
     * 参照Text组件
     */
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
    /**
     * onClose
     * 关闭回调
     */
    onClose?(): void;
    /**
     * onNext
     * 带右箭头指引点击回调
     */
    onNext?(): void;
    /**
     * onCollapse
     * 内容折叠时回调
     */
    onCollapse?(): void;
    /**
     * onOpen
     * 内容展开时回调
     */
    onOpen?(): void;
};
type TipsState = {
    visible: boolean;
    opacity: Animated.Value;
    isOpen: boolean,
    boxHeight: number,
};

export default class Tips extends React.PureComponent<TipsProps, TipsState>{
    state: Readonly<TipsState> = {
        visible: true,
        opacity: new Animated.Value(1),
        isOpen: !!this.props.defaultCollapse,
        boxHeight: 0
    }

    private collapseWrap: any = React.createRef();
    private collapseWrapHeight: number = 0;

    componentDidMount() {
        requestAnimationFrame(() => {
            this._getBoxHeight();
        })
    }

    componentDidUpdate(prevProps: TipsProps) {
        if (prevProps.description !== this.props.description) {
            // description 更新时，重新计算高度
            this._getBoxHeight();
        }
    }

    private _disappear() {
        // Tips消失的动画
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true
        }).start((finish) => {
            if (finish) {
                this.setState({
                    visible: false
                }, () => {
                    if (isFunction(this.props.onClose)) {
                        this.props.onClose();
                    }
                })
            }
        })
    }

    // 带有关闭按钮的
    private container() {
        const { opacity } = this.state;
        const {
            closable = false,
            closeBtn = false,
            nextNav = false,
            style,
            textStyle,
            description = "",
            btnTxt = '我知道了',
            numberOfLines,
            ellipsizeMode,
            onNext
        } = this.props;

        // 
        const textProps: any = {};
        numberOfLines && (textProps.numberOfLines = numberOfLines);
        ellipsizeMode && (textProps.ellipsizeMode = ellipsizeMode);
        // 计算左文本有间隔
        const marginRight = nextNav ? 0 : (closeBtn ? 15 : 20);

        return (
            <Animated.View style={{ opacity }}>
                <View style={[styles.tipsMain, style]}>
                    {
                        // 文本展示
                        isString(description) ?
                        <Text style={[styles.txt, styles.closeTxt, { marginRight }, textStyle]} {...textProps}>
                            {description}
                        </Text>
                        :
                        description
                    }
                    {
                        // 关闭按钮处理
                        closable && !nextNav ?
                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={() => {
                                    this._disappear();
                                }}
                            >
                                {
                                    // 关闭按钮的样式
                                    closeBtn ?
                                        <View style={styles.closeBtn}>
                                            <Text style={styles.closeBtnTxt}>{btnTxt}</Text>
                                        </View>
                                        :
                                        <Icon type="close" style={{ fontSize: 16, color: '#FF9645' }} />
                                }
                            </TouchableOpacity>
                            : null
                    }
                    {
                        nextNav ?
                            <TouchableOpacity
                                style={styles.arrowBtn}
                                activeOpacity={0.75}
                                onPress={() => {
                                    if (isFunction(onNext)) {
                                        onNext();
                                    }
                                }}
                            >
                                <Mini.Arrow color="orange" direction='r' />
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>
            </Animated.View>
        );
    }

    // 收起和展开内容
    private _onToggleCollapse() {
        const { isOpen } = this.state;

        this.setState((state: TipsState) => ({
            isOpen: !state.isOpen,
            boxHeight: state.isOpen ? 0 : this.collapseWrapHeight
        }));

        const { onCollapse, onOpen } = this.props;
        isOpen ? isFunction(onCollapse) && onCollapse() : isFunction(onOpen) && onOpen();
    }

    private collapsableContainer() {
        const { isOpen, boxHeight } = this.state;
        const { header, description } = this.props;
        return (
            <View style={styles.collapseContainer}>
                {
                    isString(header) ? <Text style={styles.txt}>{header}</Text> : header
                }
                <Animated.View style={{ height: boxHeight, overflow: 'hidden' }}>
                    {/* 嵌套ScrollView的目的主要是为了计算内容大高度 */}
                    <ScrollView
                        style={{ flex: 1 }}
                        alwaysBounceVertical={false}
                        alwaysBounceHorizontal={false}
                        overScrollMode="never"
                    >
                        <View ref={this.collapseWrap}>
                            {
                                isString(description) ?
                                    <Text style={styles.txt}>{description}</Text>
                                    :
                                    description
                            }
                        </View>
                    </ScrollView>
                </Animated.View>
                <View style={styles.collapseFooter}>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        style={styles.collapseBtn}
                        onPress={() => {
                            this._onToggleCollapse();
                        }}
                    >
                        <Text style={styles.txt}>{isOpen ? '收起' : '展开'}</Text>
                        <Mini.Arrow duration={300} animated direction={ isOpen ? 'u' : 'd'} color="orange" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    private _getBoxHeight() {
        if (this.props.collapsable && this.collapseWrap.current) {
            const cnode = findNodeHandle(this.collapseWrap.current);
            UIManager.measure(cnode, (_: number, __: number, ___: number, height: number) => {
                this.collapseWrapHeight = height;
            });
        }
    }

    // 强只更新折叠区域的高度
    refresh() {
        this._getBoxHeight();
    }

    render() {
        const { collapsable } = this.props;

        if (!this.state.visible) {
            return null
        }
        // 可折叠
        if (collapsable) {
            return this.collapsableContainer();
        }

        return this.container();
    }
}

const styles = StyleSheet.create({
    tipsMain: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 8,
        flexWrap: 'nowrap',
        flexDirection: 'row',
        backgroundColor: '#FFF4EC',
        overflow: 'hidden',
        alignItems: 'center',
    },
    txt: {
        fontSize: 12,
        lineHeight: 16,
        color: '#FF9645'
    },
    closeTxt: {
        flexGrow: 1,
        flexShrink: 1,
    },
    closeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
        borderRadius: 10,
        lineHeight: 20,
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
        borderColor: '#FF9645'
    },
    closeBtnTxt: {
        fontSize: 10,
        lineHeight: 10,
        color: '#FF9645',
    },
    arrowBtn: {
        height: '100%',
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrow: {
        width: 16,
        height: 16,
    },

    collapseContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#FFF4EC',
    },
    collapseFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    collapseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5
    },
    collapseBtnArrow: {
        width: 14,
        height: 10
    }
});