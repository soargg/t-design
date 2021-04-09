/**
 * @component Popup
 * @description 弹窗
 * @author liyeg
 */
import React from 'react';
import { StyleSheet, View, BackHandler, TouchableWithoutFeedback, Easing } from 'react-native';
import { isFunction } from '../common/utils';
import AnimationView from '../common/animation';
import { andriodStatusBarHeight } from '../common';
import Portal from '../portal';
export default class Popup extends React.PureComponent {
    constructor(props) {
        super(props);
        this.isAnimationFinished = true;
        this.handleBack = () => {
            const { onHardwareBackPress } = this.props;
            const hardwareBack = isFunction(onHardwareBackPress);
            let suspend = false;
            if (hardwareBack) {
                suspend = onHardwareBackPress();
            }
            return hardwareBack && suspend;
        };
        this.handleHardwareBack = () => {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
            BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        };
        this.hiddePopup = () => {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
            this.isAnimationFinished = true;
            this.setState({ visible: false });
        };
        this.state = {
            visible: props.show
        };
        this.isRender = props.show;
    }
    static get displayName() { return 'Popup'; }
    static getDerivedStateFromProps(nextProps) {
        if ('show' in nextProps && nextProps.show) {
            return {
                visible: true
            };
        }
        return null;
    }
    componentDidUpdate(prevProps) {
        // Popup出现时 Android物理返回时处理
        if (prevProps.show !== this.props.show && this.props.show) {
            if (prevProps.show || !this.isRender) {
                this.isRender = true;
            }
            this.handleHardwareBack();
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }
    render() {
        const { children, show, forceRender = false, style, maskStyle, position = 'center', animate, zIndex = 9999, isFullScreen = false, onMaskPress = () => { }, } = this.props;
        const { visible } = this.state;
        // 过滤掉无效的样式
        const popupMaskStyle = [styles.mask, maskStyle].filter(i => i);
        const wrapStyle = [styles.wrap, styles[position]].filter(i => i);
        // 内容样式
        const aniStyle = [styles.content];
        if (isFullScreen) {
            aniStyle.push(styles.fullScreen);
        }
        aniStyle.push(style);
        return (<Portal zIndex={zIndex}>
                {visible || (forceRender && this.isRender) ?
                // position: 'relative' 兼容 Android 端display:none 不生效
                <View style={[wrapStyle, { display: visible ? 'flex' : 'none', position: 'relative' }]}>
                        <TouchableWithoutFeedback onPress={() => {
                        // 动画执行期间不可点击 mask
                        if (!this.isAnimationFinished) {
                            return;
                        }
                        onMaskPress();
                        this.isAnimationFinished = false;
                    }}>
                            <View style={popupMaskStyle}/>
                        </TouchableWithoutFeedback>
                        <AnimationView active={show} safeArea={isFullScreen} style={aniStyle} animationType={animate} onFinish={() => {
                        this.hiddePopup();
                    }} easing={Easing.out(Easing.ease)}>
                            {children}
                        </AnimationView>
                    </View>
                :
                    null}
            </Portal>);
    }
}
// 默认Props
Popup.defaultProps = {
    show: false
};
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
