import React from 'react';
import { SafeAreaView, Animated, Easing, Dimensions } from 'react-native';
const DEFAULT_DURATION = 250;
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const AnimationSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
export default class AnimationView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            animate: new Animated.Value(0),
        };
        this.active = (back) => {
            const { loop = false } = this.props;
            let activeAnimation = this.getAnimation(back);
            // 开启无线循环的动画
            if (loop) {
                activeAnimation = Animated.loop(activeAnimation, { iterations: -1 });
            }
            if (activeAnimation) {
                activeAnimation.start((finished) => {
                    /*
                        等动画结束完，执行动画结束回调函数
                        如果是无限动画，则没有动画结束回调
                    */
                    if (back && !loop) {
                        this._finish(finished);
                    }
                });
            }
            else {
                if (back) {
                    this.props.onFinish();
                }
            }
        };
        this.getActiveStyle = () => {
            const { animationType } = this.props;
            let activeStyle = null;
            switch (animationType) {
                case 'fadeInOut':
                    activeStyle = { opacity: this.getInterpolate([0, 1]) };
                    break;
                case 'scale':
                    activeStyle = {
                        transform: [{ scale: this.getInterpolate([0.6, 1]) }]
                    };
                    break;
                case 'fromTop':
                    activeStyle = {
                        transform: [{ translateY: this.getInterpolate([-HEIGHT, 0]) }]
                    };
                    break;
                case 'fromRight':
                    activeStyle = {
                        transform: [{ translateX: this.getInterpolate([WIDTH, 0]) }]
                    };
                    break;
                case 'fromBottom':
                    activeStyle = {
                        transform: [{ translateY: this.getInterpolate([HEIGHT, 0]) }]
                    };
                    break;
                case 'fromLeft':
                    activeStyle = {
                        transform: [{ translateX: this.getInterpolate([-WIDTH, 0]) }]
                    };
                    break;
                case 'rotate':
                    activeStyle = {
                        transform: [{
                                // 角度映射
                                rotateZ: this.getInterpolate(['0deg', '360deg'])
                            }]
                    };
                    break;
                case 'full':
                    activeStyle = {
                        opacity: this.getInterpolate([0, 1]),
                        transform: [{ translateY: this.getInterpolate([150, 0]) }]
                    };
                    break;
                default:
                    break;
            }
            return activeStyle;
        };
        // 动画结束
        this._finish = (finished) => {
            if (!finished) {
                return;
            }
            // 动画结束回调函数
            this.props.onFinish();
        };
    }
    componentDidMount() {
        this.active(!this.props.active);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.active !== this.props.active) {
            this.active(!this.props.active);
        }
    }
    // 动画处理函数
    getAnimation(back) {
        const { during = DEFAULT_DURATION, easing = Easing.linear } = this.props;
        const { animate } = this.state;
        return Animated.timing(animate, {
            toValue: back ? 0 : 1,
            duration: during,
            easing,
            useNativeDriver: true
        });
    }
    // 插值动画转换
    getInterpolate(outputRange) {
        const { animate } = this.state;
        // 传入range优先
        const { range } = this.props;
        outputRange = range ? range : outputRange;
        if (!Array.isArray(outputRange)) {
            return animate;
        }
        return animate.interpolate({
            inputRange: [0, 1],
            outputRange,
            extrapolate: 'clamp'
        });
    }
    render() {
        const { children, style, safeArea = false } = this.props;
        const activeStyle = this.getActiveStyle();
        const viewStye = [style, activeStyle].filter(v => v);
        if (safeArea) {
            return (<AnimationSafeAreaView style={viewStye}>
                    {children}
                </AnimationSafeAreaView>);
        }
        return (<Animated.View style={viewStye}>
                {children}
            </Animated.View>);
    }
}
AnimationView.defaultProps = {
    active: false,
    onFinish: () => { }
};
