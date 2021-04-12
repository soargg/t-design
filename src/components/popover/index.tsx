/**
 * @component Popover
 * @description 伴随气泡
 * @author 
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    UIManager,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
    ImageSourcePropType,
    LayoutChangeEvent,
    findNodeHandle
} from 'react-native';
import Portal from '../portal';
import { screenWidth, screenHeight } from '../common';
import { isNumber, isFunction } from '../common/utils';
import { icon_popover_arrow } from '../common/icons';

type AnchorType = {
    left: number;
    top: number;
    imgLeft: number;
    imgTop: number;
}

interface TargetLayout {
    width: number;
    height: number;
    pageX: number;
    pageY: number;
}

type PopoverProps = {
    children: React.ReactElement;
    /**
     * bubble
     * 气泡里的展示的内容，自定义JSX
     */
    bubble: React.ReactElement;
    /**
     * bubbleStyle
     * 气泡的样式扩展
     */
    bubbleStyle?: StyleProp<ViewStyle>;
    /**
     * placement
     * 气泡出现的12个位置
     * 上、下、左、右、上左、上右、下左、下右、左上、左下、右上、右下
     * 默认展示在上面
     */
    placement?: 'above' | 'below' | 'right' | 'left'
    | 'aboveLeft' | 'aboveRight' | 'belowLeft' | 'belowRight'
    | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    /**
     * sideGap
     * 气泡在屏幕两侧留白
     * 默认 0
     */
    sideGap?: number;
    /**
     * gap
     * 气泡与目标元素的间隔
     */
    gap?: number;
    /**
     * arrowSource
     * 自定义箭头
     */
    arrowSource?: ImageSourcePropType;
    /**
     * 箭头的尺寸
     */
    arrowSize?: {
        width: number,
        height: number
    };
    /**
     * bubbleBorder
     * 气泡有边框时，箭头用来遮挡部分边框
     */
    bubbleBorder?: number;
    /**
     * offset
     * 气泡不在正中位置的时候，左右半部分的偏移量
     * 默认20
     */
    offset?: number;
    /**
     * pressOutSideClose
     * 点击气泡之外关闭气泡，默认值 true
     * 为false时，气泡的关闭逻辑将由用户控制
     */
    pressOutSideClose?: boolean;
    /**
     * visible
     * pressOutSideClose 为false时生效
     */
    visible?: boolean;
    /**
     * defaultVisible
     * 默认展示状态
     * 默认 false
     */
    defaultVisible?: boolean;
    /**
     * touchable
     * 可点击触发气泡的出现
     * 默认 true
     */
    touchable?: boolean;
    /**
     * zIndex
     * 层级，仅限与组件库内浮层类组件层级比较
     */
    zIndex?: number
    /**
     * onOpen
     * 气泡出现时回调
     */
    onOpen?(): void;
    /**
     * onClose
     * 气泡关闭时回调
     */
    onClose?(): void;
}

interface State extends TargetLayout {
    show: boolean;
    bubbleWidth: number;
    bubbleHeight: number;
}

export default class Popover extends React.PureComponent<PopoverProps, State> {
    state: State = {
        show: true,
        bubbleWidth: 0,
        bubbleHeight: 0,
        width: 0,
        height: 0,
        pageX: 0,
        pageY: 0
    };

    private childTarget: number = null;

    private didMount: boolean = false;
    // 初始状态时记录气泡
    private didRecord: boolean = false;

    private gap: number = isNumber(this.props.gap) ? this.props.gap : 5;
    private bubbleBorder = isNumber(this.props.bubbleBorder) && this.props.bubbleBorder >= 0 ? this.props.bubbleBorder : 0

    // 箭头尺寸
    private arrowHeight: number = (this.props.arrowSize && isNumber(this.props.arrowSize.height)) ? this.props.arrowSize.height : 6;
    private arrowWidth: number = (this.props.arrowSize && isNumber(this.props.arrowSize.width)) ? this.props.arrowSize.width : 7;

    componentDidUpdate({ visible }: PopoverProps) {
        if (visible !== this.props.visible) {
            this.props.visible ? this.showBubble() : this.hideBubble();
        }
    }

    componentWillUnmount() {
        this.setState = () => null;
    }

    initial() {
        if (this.didMount) {
            return;
        }
        this.didMount = true;
        setTimeout(() => {
            const { visible, pressOutSideClose = true, defaultVisible } = this.props;
            if ((visible && !pressOutSideClose) || (defaultVisible && pressOutSideClose)) {
                // 如果通过 visible 控制展示，且为true，将不执行关闭
                this.showBubble();
            }
        }, 100);
    }

    getBubbleSizeOnce(e: LayoutChangeEvent) {
        // 气泡出现时算一遍气泡的宽高
        if (this.didRecord) {
            return;
        }
        this.didRecord = true;
        // 先让气泡出现算一下位置信息
        const { visible, pressOutSideClose = true, defaultVisible } = this.props;
        if (!((visible && !pressOutSideClose) || (defaultVisible && pressOutSideClose))) {
            const { width, height } = e.nativeEvent.layout;
            this.setState({
                bubbleWidth: width,
                bubbleHeight: height,
                show: false
            });
        }
    }

    getBubbleSize(e: LayoutChangeEvent) {
        // 气泡出现时算一遍气泡的宽高
        const { width, height } = e.nativeEvent.layout;
        const { bubbleHeight, bubbleWidth } = this.state;
        if (bubbleHeight !== height || bubbleWidth !== width) {
            this.setState({
                bubbleWidth: width,
                bubbleHeight: height
            });
        }
    }

    getTargetLayout(): Promise<TargetLayout> {
        return new Promise(resolve => {
            UIManager.measure(findNodeHandle(this.childTarget), (
                _: number,
                __: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number
            ) => {
                resolve({ width, height, pageX, pageY })
            });
        })
    }

    getImgPlacementX(pageX: number, width: number): number {
        const { placement = 'above' } = this.props;
        let imgLeft = 0;
        switch (placement) {
            case 'left':
            case 'leftTop':
            case 'leftBottom':
                // 
                const offsetL = this.arrowWidth - (this.arrowWidth - this.arrowHeight) / 2;
                imgLeft = pageX - this.gap - offsetL - this.bubbleBorder;
                break;
            case 'right':
            case 'rightTop':
            case 'rightBottom':
                const offsetR = (this.arrowWidth - this.arrowHeight) / 2;
                imgLeft = pageX + width + this.gap - offsetR + this.bubbleBorder;
                break;
            case 'above':
            case 'aboveLeft':
            case 'aboveRight':
            case 'below':
            case 'belowLeft':
            case 'belowRight':
            default:
                imgLeft = pageX + width / 2 - this.arrowWidth / 2;
                break;
        }
        return imgLeft;
    }

    getImgPlacementY(pageY: number, height: number): number {
        const { placement = 'above' } = this.props;
        let imgTop = 0;
        switch (placement) {
            case 'below':
            case 'belowLeft':
            case 'belowRight':
                imgTop = pageY + height + this.gap + this.bubbleBorder;
                break;
            case 'left':
            case 'leftTop':
            case 'leftBottom':
            case 'right':
            case 'rightTop':
            case 'rightBottom':
                imgTop = pageY + height / 2 - this.arrowWidth / 2;
                break;
            case 'above':
            case 'aboveLeft':
            case 'aboveRight':
            default:
                imgTop = pageY - this.gap - this.arrowHeight - this.bubbleBorder;
                break;
        }

        return imgTop;
    }

    getBubblePlacementX(pageX: number, width: number): number {
        const { placement = 'above', offset = 20 } = this.props;
        const { bubbleWidth } = this.state;

        let x = offset;
        if (!isNumber(offset)) {
            x = 20;
        }
        let halfBubble = bubbleWidth / 2;
        let left = 0;
        switch (placement) {
            case 'left':
            case 'leftTop':
            case 'leftBottom':
                left = pageX - bubbleWidth - this.gap - this.arrowHeight;
                break;
            case 'right':
            case 'rightTop':
            case 'rightBottom':
                left = pageX + width + this.gap + this.arrowHeight;
                break;
            case 'aboveLeft':
            case 'belowLeft':
                let offsetL = bubbleWidth - x;
                offsetL = offsetL < halfBubble ? halfBubble : offsetL;
                left = pageX + width / 2 - offsetL;
                break;
            case 'aboveRight':
            case 'belowRight':
                let offsetR = x > halfBubble ? halfBubble : x;
                left = pageX + width / 2 - offsetR;
                break;
            case 'above':
            case 'below':
            default:
                left = pageX + width / 2 - halfBubble;
                break;
        }
        return left;
    }

    getBubblePlacementY(pageY: number, height: number): number {
        const { placement = 'above', offset = 20 } = this.props;
        const { bubbleHeight } = this.state;
        let x = offset;
        if (!isNumber(offset)) {
            x = 20;
        } else if (offset < 5) {
            x = 5
        }
        let halfBubble = bubbleHeight / 2;
        let top = 0;
        switch (placement) {
            case 'below':
            case 'belowLeft':
            case 'belowRight':
                top = pageY + height + this.gap + this.arrowHeight;
                break;
            case 'leftTop':
            case 'rightTop':
                let offsetT = bubbleHeight - x;
                offsetT = offsetT < halfBubble ? halfBubble : offsetT;
                top = pageY + height / 2 - offsetT;
                break;
            case 'left':
            case 'right':
                top = pageY + height / 2 - halfBubble;
                break;
            case 'leftBottom':
            case 'rightBottom':
                let offsetB = x > halfBubble ? halfBubble : x;
                top = pageY + height / 2 - offsetB;
                break;
            case 'above':
            case 'aboveLeft':
            case 'aboveRight':
            default:
                top = pageY - bubbleHeight - this.gap - this.arrowHeight;
                break;
        }

        return top;
    }

    getDynamicAnchor(): AnchorType {
        const { show } = this.state;
        if (!show) {
            return { left: 0, top: 0, imgLeft: 0, imgTop: 0 };
        }

        if (show && !this.didRecord) {
            // 初始状态时为了计算气泡的宽度，只能假装隐藏气泡了
            return { left: -screenWidth, top: -screenHeight, imgLeft: -screenWidth, imgTop: -screenHeight };
        }

        try {
            const { placement = 'above' } = this.props;
            const { width, height, pageX, pageY, bubbleWidth } = this.state;

            let left = this.getBubblePlacementX(pageX, width);
            let top = this.getBubblePlacementY(pageY, height);
            const imgLeft = this.getImgPlacementX(pageX, width);
            const imgTop = this.getImgPlacementY(pageY, height);

            if (['above', 'below', 'aboveLeft', 'aboveRight', 'belowLeft', 'belowRight'].findIndex(i => i === placement) !== -1) {
                let { sideGap = 0 } = this.props;
                if (!isNumber(sideGap)) {
                    sideGap = 0;
                    console.warn('Popover prop sideGap must be a numeric type');
                }
                // 当气泡的位置在上或者下面的时候。优先判断气泡是否超出了右侧侧屏幕
                if (left + bubbleWidth > screenWidth - sideGap) {
                    left = screenWidth - bubbleWidth - sideGap;
                }
                // 然后在判断是否超出了左侧屏幕
                if (left < sideGap) {
                    left = sideGap;
                }
            }

            return { left, top, imgTop, imgLeft };
        } catch (error) {
            return { left: 0, top: 0, imgLeft: 0, imgTop: 0 };
        }
    };

    showBubble = () => {
        if (this.childTarget) {
            this.getTargetLayout().then((layout: TargetLayout) => {
                const { width = 0, height = 0, pageX = 0, pageY = 0 } = layout;
                this.setState({
                    width, height, pageX, pageY,
                    show: true,
                }, () => {
                    const { onOpen } = this.props;
                    if (isFunction(onOpen)) {
                        onOpen();
                    }
                })
            });
        }
    };

    hideBubble = () => {
        this.setState({ show: false });
        const { onClose } = this.props;
        if (isFunction(onClose)) {
            onClose();
        }
    };

    render() {
        const { show } = this.state;
        const { left, top, imgLeft, imgTop } = this.getDynamicAnchor();
        const {
            children,
            placement = 'above',
            bubble,
            pressOutSideClose = true,
            bubbleStyle,
            sideGap = 0,
            arrowSource,
            touchable = true,
            zIndex
        } = this.props;

        if (!children) {
            return null
        }

        return (
            <React.Fragment>
                <TouchableOpacity
                    ref={(r: any) => { this.childTarget = r }}
                    activeOpacity={0.8}
                    disabled={!(touchable && pressOutSideClose)}
                    onLayout={() => {
                        this.initial();
                    }}
                    onPress={() => {
                        this.showBubble();
                    }}
                >
                    {children}
                </TouchableOpacity>
                <Portal zIndex={zIndex}>
                    {
                        show ?
                            <View
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    flex: 1
                                }}
                                pointerEvents="box-none"
                            >
                                {
                                    pressOutSideClose ?
                                        <TouchableWithoutFeedback onPress={this.hideBubble}>
                                            <View style={StyleSheet.absoluteFillObject}></View>
                                        </TouchableWithoutFeedback>
                                        :
                                        null
                                }
                                <View
                                    style={[
                                        styles.bubble,
                                        { left: left, top: top, maxWidth: screenWidth - sideGap * 2 },
                                        bubbleStyle
                                    ]}
                                    onLayout={(e: LayoutChangeEvent) => {
                                        this.getBubbleSizeOnce(e);
                                        this.getBubbleSize(e);
                                    }}
                                >
                                    {bubble}
                                </View>
                                {/* 自定义箭头 */}
                                <Image
                                    source={arrowSource ? arrowSource : icon_popover_arrow}
                                    style={[styles.arrow, {
                                        left: imgLeft,
                                        top: imgTop,
                                        height: this.arrowHeight,
                                        width: this.arrowWidth
                                    }, styles[placement]]}
                                />
                            </View>
                            :
                            null
                    }
                </Portal>
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    bubble: {
        position: 'absolute',
        padding: 5,
        borderRadius: 4,
        backgroundColor: 'rgba(38,39,40,0.80)',
        zIndex: 9
    },
    arrow: {
        position: 'absolute',
        height: 6,
        width: 7,
        zIndex: 10
    },
    above: null,
    aboveLeft: null,
    aboveRight: null,
    right: {
        transform: [{ rotate: '90deg' }]
    },
    rightBottom: { transform: [{ rotate: '90deg' }] },
    rightTop: { transform: [{ rotate: '90deg' }] },
    below: {
        transform: [{ rotate: '180deg' }]
    },
    belowLeft: { transform: [{ rotate: '180deg' }] },
    belowRight: { transform: [{ rotate: '180deg' }] },
    left: {
        transform: [{ rotate: '270deg' }]
    },
    leftTop: { transform: [{ rotate: '270deg' }] },
    leftBottom: { transform: [{ rotate: '270deg' }] }
});