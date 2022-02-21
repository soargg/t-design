/**
 * @component Tips
 * @description 通告栏
 * @date 2022/02/21
 * @author liyeg
 * */
import React from 'react';
import { StyleSheet, Text , ScrollView, View, Animated, Easing, TouchableOpacity } from 'react-native';
import { isFunction } from '../common/utils';
import Button from '../button';
// import Icon, { IconType } from '../icon';
import { Mini } from '../mini';

type TipsProps = {
    tip: string;
    type?: 'info' | 'success' | 'error';
    btnType?: | 'none' | 'btn' | 'close';
    btnTxt?: string;
    // iconType?: IconType;
    invisibleAnimate?: boolean;
    onClose?(): void;
}

const baseDuration = 6500;

type TipsState = {
    visible: boolean;
    wrapWidth: number;
    contentWidth: number;
    slider: Animated.Value;
    opacity: Animated.Value;
}

class Tips extends React.PureComponent<TipsProps, TipsState> {
    state: Readonly<TipsState> = {
        visible: true,
        wrapWidth: 0,
        contentWidth: 0,
        slider: new Animated.Value(0),
        opacity: new Animated.Value(1)
    };

    private animate: Animated.CompositeAnimation = null;

    componentDidUpdate(_: Readonly<TipsProps>, prevState: Readonly<TipsState>): void {
        const { wrapWidth, contentWidth } = this.state;

        if (wrapWidth !== prevState.wrapWidth || contentWidth !== prevState.contentWidth) {
            // 不确定谁先算出来
            if (wrapWidth !== 0 && contentWidth !== 0) {
                if (contentWidth > wrapWidth) {
                    this.rolling();
                } else {
                    this.stopRoll();
                }
            }
        }
    }

    private rolling() {
        this.stopRoll();

        const { contentWidth, wrapWidth, slider } = this.state;
        const step1: number = contentWidth / wrapWidth * baseDuration;
        const step2: number = (contentWidth + wrapWidth) / wrapWidth * baseDuration;
        // 初始动画
        this.animate = Animated.timing(slider, {
            toValue: -contentWidth,
            duration: step1,
            easing: Easing.linear,
            useNativeDriver: true,
        });

        this.animate.start(() => {
            // 跳到末尾
            const reset = Animated.timing(slider, {
                toValue: wrapWidth,
                duration: 0,
                easing: Easing.linear,
                useNativeDriver: true
            });
            // 执行滚动字幕动画
            const showAni = Animated.timing(slider, {
                toValue: -contentWidth,
                duration: step2,
                easing: Easing.linear,
                useNativeDriver: true
            });

            this.animate = Animated.loop(Animated.sequence([reset, showAni]));
            this.animate.start();
        });
    }

    private stopRoll() {
        if (this.animate) {
            this.animate.stop();
            this.animate.reset();
            this.state.slider.setValue(0);
            this.animate = null;
        }
    }
    
    private hidden() {
        const { invisibleAnimate = true, onClose } = this.props;

        if (invisibleAnimate) {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                this.stopRoll();
                this.setState({
                    visible: false
                });
            });
        } else {
            this.stopRoll();
            this.setState({
                visible: false
            });
        }

        if (isFunction(onClose)) {
            onClose();
        }
    }

    render() {
        const { visible, opacity } = this.state;
        const { tip, type, btnType='close', btnTxt='我知道了' } = this.props;
        const bgColor: string = type === 'success' ? '#ECF9F2' : ( type === 'error' ? '#FFF2F0' : '#FFEFE5');
        const color: string = type === 'success' ? '#39AC73' : ( type === 'error' ? '#FA5238' : '#FF6E16');

        // 关闭了
        if (!visible) return null;

        return (
            <Animated.View style={[styles.tips, { backgroundColor: bgColor, opacity }]}>
                {/* 使用ScrollViw，可以让文本撑开宽度，方便做滚动动画 */}
                <View style={styles.wrap}>
                    <ScrollView
                        horizontal
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.tipsTxtWrap}
                        showsHorizontalScrollIndicator={false}
                        alwaysBounceVertical={false}
                        alwaysBounceHorizontal={false}
                        bounces={false}
                        scrollEnabled={false}
                        onLayout={e => {
                            this.setState({
                                wrapWidth: e.nativeEvent.layout.width
                            });
                        }}
                        onContentSizeChange={(w) => {
                            this.setState({contentWidth: w});
                        }}
                    >
                        <Animated.View style={{ transform: [{ translateX: this.state.slider }] }}>
                            <Text style={[ styles.tipsTxt, { color, textAlign: 'center' } ]}>
                                {/* { iconType ? <Icon style={{fontSize: 12, paddingRight: 5}} type={ iconType } /> : null } */}
                                {tip}
                            </Text>
                        </Animated.View>
                    </ScrollView>
                </View>
                {
                    btnType === 'btn' ?
                    <Button
                        style={{ backgroundColor: bgColor, borderColor: color, height: 20, marginHorizontal: 16 }}
                        btnTextStyle={{color, fontSize: 10}}
                        type='outline-week'
                        size="mini"
                        onPress={this.hidden.bind(this)}
                    >{ btnTxt }</Button>
                    :
                    (
                        btnType === 'close' ?
                        <TouchableOpacity
                            style={styles.close}
                            activeOpacity={0.8}
                            onPress={this.hidden.bind(this)}
                        >
                            <Mini.Close color={type === "success" ? 'green' : ( type === "error" ? 'red' : 'orange' ) } />
                        </TouchableOpacity>
                        :
                        null
                    )
                }
            </Animated.View>
        );
    }
}


export default Tips;

const styles = StyleSheet.create({
    tips: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrap: {
        flex: 1,
        height: 34,
        position: 'relative',
        paddingLeft: 16
    },
    tipsTxtWrap: {
        height: 34,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    tipsTxt: {
        fontSize: 11
    },
    optArea: {
        flexGrow: 0,
        flexShrink: 0,
        height: 34,
        alignContent: 'center'
    },
    close: {
        height: 34,
        paddingLeft: 12,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center'
    }
});