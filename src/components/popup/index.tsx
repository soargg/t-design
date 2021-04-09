/**
 * @component Popup
 * @description 弹窗
 * @author liyeg
 */

import React from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    TouchableWithoutFeedback, /* 为了popup内容不受透明触碰的影响 */
    StyleProp,
    ViewStyle,
    Easing
} from 'react-native';
import { isFunction } from '../common/utils';
import AnimationView from '../common/animation';
import { andriodStatusBarHeight } from '../common';
import Portal from '../portal';

type PopupProps = {
    children: React.ReactNode;
    /**
     * show
     * Popup的展示与隐藏
     */
    show: boolean;
    /**
     * zIndex
     * 层级
     */
    zIndex?: number;
    /**
     * isFullScreen
     * 内容是否全屏
     */
    isFullScreen?: boolean;
    /**
     * forceRender
     * 隐藏时不销毁DOM结构
     * 默认false
     */
    forceRender?: boolean;
    /**
     * maskStyle
     * 遮罩的样式
     */
    maskStyle?: StyleProp<ViewStyle> | undefined | null;
    /**
     * style
     * 内容区域额外样式
     */ 
    style?: StyleProp<ViewStyle> | undefined | null;
    /**
     * position
     * 内容区域展示在屏幕中的位置，默认 center
     */
    position?: 'center' | 'top' | 'left' | 'bottom' | 'right';
    /**
     * animate
     * 入场动画
     * 淡入淡出、底部进入、顶部进入、左侧进入、右侧进入、缩放
     * 默认： 无
     */ 
    animate?: 'fadeInOut' | 'scale' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | undefined | null | 'full';
    /**
     * onMaskPress
     * 遮罩被点击回调
     */ 
    onMaskPress?: () => void
    /**
     * onHardwareBackPress
     * Android端物理返回按钮，回调
     * 可以执行销毁Popup的逻辑处理
     */
    onHardwareBackPress?: () => boolean;
}

type PopupState = {
    visible: boolean
}

export default class Popup extends React.PureComponent<PopupProps, PopupState> {
    static get displayName() { return 'Popup' }

    private isRender: boolean;

    // 默认Props
    static defaultProps = {
        show: false
    }

    constructor(props: PopupProps) {
        super(props);
        this.state = {
            visible: props.show
        }
        this.isRender = props.show;
    }

    private isAnimationFinished: boolean = true;

    static getDerivedStateFromProps(nextProps: PopupProps) {
        if ('show' in nextProps && nextProps.show) {
            return {
                visible: true
            }
        }
        return null;
    }

    componentDidUpdate(prevProps: PopupProps) {
        // Popup出现时 Android物理返回时处理
        if (prevProps.show !== this.props.show && this.props.show) {
            if (prevProps.show || !this.isRender) {
                this.isRender = true
            }
            this.handleHardwareBack();
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    private handleBack = (): boolean => {
        const { onHardwareBackPress } = this.props;
        const hardwareBack = isFunction(onHardwareBackPress);
        let suspend: boolean = false;
        if (hardwareBack) {
            suspend = onHardwareBackPress();
        }
        return hardwareBack && suspend;
    }

    private handleHardwareBack = (): void => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    };
    
    private hiddePopup = (): void => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
        this.isAnimationFinished = true;
        this.setState({ visible: false });
    };
    
    render() {
        const {
            children,
            show,
            forceRender = false,
            style,
            maskStyle,
            position = 'center',
            animate,
            zIndex=9999,
            isFullScreen = false,
            onMaskPress= () => {},
        } = this.props;
        const { visible } = this.state;

        // 过滤掉无效的样式
        const popupMaskStyle = [styles.mask, maskStyle].filter(i => i);
        const wrapStyle = [styles.wrap, styles[position]].filter(i => i);
        // 内容样式
        const aniStyle: StyleProp<ViewStyle>[] = [styles.content];
        if (isFullScreen) {
            aniStyle.push(styles.fullScreen);
        }
        aniStyle.push(style);

        return (
            <Portal zIndex={zIndex}>
                {
                    visible || (forceRender && this.isRender) ?
                    // position: 'relative' 兼容 Android 端display:none 不生效
                    <View style={[wrapStyle, { display: visible ? 'flex' : 'none', position: 'relative' }]}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                // 动画执行期间不可点击 mask
                                if (!this.isAnimationFinished) {
                                    return;
                                }
                                onMaskPress();
                                this.isAnimationFinished = false;
                            }}
                        >
                            <View style={popupMaskStyle} />
                        </TouchableWithoutFeedback>
                        <AnimationView
                            active={show}
                            safeArea={ isFullScreen }
                            style={aniStyle}
                            animationType={animate}
                            onFinish={() => {
                                this.hiddePopup();
                            }}
                            easing={Easing.out(Easing.ease)}
                        >
                            { children }
                        </AnimationView>
                    </View>
                    :
                    null
                }
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%'
    },
    mask: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    content: {
        backgroundColor: '#FFFFFF'
    },
    top: {
        alignItems: 'flex-start'
    },
    right: {
        justifyContent: 'flex-end'
    },
    bottom: {
        alignItems: 'flex-end'
    },
    left: {
        justifyContent: 'flex-start'
    },
    center: null,
    fullScreen: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingTop: andriodStatusBarHeight
    }
});