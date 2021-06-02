import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { windowHeight, windowWidth, isAndroid } from '../common';
import { isFunction } from '../common/utils';
import Dot from '../indicator';
import { styles } from './style';

import type { ReactNodeArray } from 'react';
import type { ScrollViewProps, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { SwiperProps, SwiperState, InternalsFlag } from './types';

export class Swiper extends React.PureComponent<SwiperProps, SwiperState> {
    static get displayName() { return 'Swiper' }

    static propTypes: any;
    static defaultProps: SwiperProps;

    private initialRender: boolean = true; // 组件初始化
    private internals: InternalsFlag = {
        isScrolling: false,
        offset: { x: 0, y: 0 },
    };

    private refScrollView: ScrollView;
    private autoplayTimer: any = null;

    constructor(props: SwiperProps) {
        super(props);
        // 初始化的时候需要获取props中的index
        this.state = this.getNextState(props, initialState, true);
    }

    UNSAFE_componentWillReceiveProps(nextProps: SwiperProps) {
        const { width, height, index, children } = this.props;
        if (
            children !== nextProps.children ||
            width !== nextProps.width ||
            height !== nextProps.height ||
            index !== nextProps.index
        ) {
            this.setState(this.getNextState(nextProps, this.state));
        }
    }

    componentDidMount() {
        this.autoplayTimer && clearTimeout(this.autoplayTimer);
        this._autoplay();
    }

    componentWillUnmount() {
        this.autoplayTimer && clearTimeout(this.autoplayTimer);
    }

    componentDidUpdate(prevProps: SwiperProps) {
        if (this.props.autoplay && !prevProps.autoplay) {
            this.autoplayTimer && clearTimeout(this.autoplayTimer);
            this._autoplay()
        }
    }

    /**
     * Scroll by index
     * @param  {number} index offset index
     * @param  {bool} animated
     */
    public scrollTo(index: number, animated: boolean = true) {
        const { index: currIndex, total, width, height, dir = 'x' } = this.state;
        if (
            this.internals.isScrolling ||
            total < 2 ||
            index === currIndex
        ){
            return;
        }

        const diff = currIndex + (index - currIndex) + (this.props.loop ? 1 : 0);
        const x = dir === 'x' ? diff * width : 0;
        const y = dir === 'y' ? diff * height : 0;

        this.refScrollView && this.refScrollView.scrollTo({ x, y, animated });
        // update scroll state
        this.internals.isScrolling = true;
        this.setState({
            autoplayEnd: false
        });

        if (!animated || isAndroid) {
            requestAnimationFrame(() => {
                this._onScrollEnd({
                    nativeEvent: {
                        contentOffset: {
                            x, y
                        }
                    }
                } as NativeSyntheticEvent<NativeScrollEvent>);
            })
        }
    }

    private _scrollByIndexStep(step: number) {
        if (this.internals.isScrolling || this.state.total < 2) return;
        this.scrollTo(this.state.index + step, true);
    }

    private getNextState(props: SwiperProps, state: SwiperState = initialState, updateIndex: boolean = false) {
        // offset是一个对象，这样些取消引用
        const nextState: SwiperState = { ...state, offset: { x: 0, y: 0 } };

        nextState.swiperItems = React.Children.map(props.children, (child) => child).filter(c => c);
        nextState.total = nextState.swiperItems.length;

        // index 处理
        // 子元素数量不变 && 不需要更新索引
        if (nextState.total === state.total && !updateIndex) {
            nextState.index = state.index;
        } else {
            const { index = 0 } = props;
            // 避免数据变少时，下标越界
            nextState.index = nextState.total > 1 ? Math.min(index, nextState.total - 1) : 0;
        }

        // 方向
        nextState.dir = props.horizontal === false ? 'y' : 'x';
        // 宽度
        if (props.width) {
            nextState.width = props.width;
        } else if (state.width > 0) {
            nextState.width = state.width;
        } else {
            nextState.width = windowWidth;
        }

        // 高度
        if (props.height > 0) {
            nextState.height = props.height;
        } else if (state.height > 0) {
            nextState.height = state.height;
        } else {
            nextState.height = windowHeight;
        }
        // 偏移量
        nextState.offset[nextState.dir] = (nextState.dir === 'x' ? nextState.width : nextState.height) * nextState.index;

        this.internals = {
            ...this.internals,
            isScrolling: false
        }

        return {
            ...nextState
        };
    }

    // 初始化时的定位
    private _onLayout(event: LayoutChangeEvent) {
        const { width, height } = event.nativeEvent.layout;
        const offset = this.internals.offset;

        if (this.state.total > 1) {
            const step = this.props.loop ? this.state.index + 1 : this.state.index;
            offset[this.state.dir] = (this.state.dir === 'x' ? width : height) * step;

            if (this.initialRender) {
                this.initialRender = false;
                if (this.refScrollView) {
                    this.refScrollView.scrollTo({ ...offset, animated: false });
                }
            }
        }
        this.setState({
            width,
            height
        });
    }

    private _updateIndex(offset: { x: number, y: number }, callback: (changed: boolean) => void) {
        const { index, total, width, height, dir } = this.state;

        const diff = offset[dir] - this.internals.offset[dir];
        const step = dir === 'x' ? width : height;
        // 循环列表是，是否跳到端点位置
        let loopJump = false;

        // 啥都没干
        if (diff === 0) {
            return;
        }

        let nextIndex = index + Math.round(diff / step);

        // 循环时端点处理
        if (this.props.loop) {
            if (nextIndex <= -1) {
                // 到了开头位置就跳到末尾
                nextIndex = total - 1;
                offset[dir] = step * total;
                loopJump = true;
            } else if (nextIndex >= total) {
                // 到了末尾位置就跳到开头
                nextIndex = 0;
                offset[dir] = step;
                loopJump = true;
            }
        }

        // 存一下新的偏移量
        this.internals.offset = offset;
        if (loopJump) {
            this.setState({
                offset,
                index: nextIndex,
                loopJump
            }, () => {
                callback(index !== nextIndex);
            });
        } else {
            this.setState({
                index: nextIndex,
                loopJump
            }, () => {
                callback(index !== nextIndex);
            });
        }
    }

    /**
     * _loopJump // 循环处理
     * @returns void
     */
    private _loopJump() {
        if (!this.state.loopJump) return;
        // 帧渲染函数来处理
        requestAnimationFrame(() => {
            if (this.refScrollView) {
                if ((this.refScrollView as any).setPageWithoutAnimation) {
                    let index = this.state.index + (this.props.loop ? 1 : 0);
                    ; (this.refScrollView as any).setPageWithoutAnimation(index);
                } else {
                    const offset = this.internals.offset;
                    this.refScrollView.scrollTo({ ...offset, animated: false });
                }
            }
        });
    }

    /**
     * _autoplay 自动轮波
     * @returns void
     */
    private _autoplay() {
        const { autoplay, autoplayDuring, loop, autoplayDirection } = this.props;
        const { swiperItems, autoplayEnd, index, total } = this.state;
        if (swiperItems.length <= 1 || !autoplay || this.internals.isScrolling || autoplayEnd) {
            return;
        }

        this.autoplayTimer && clearTimeout(this.autoplayTimer);
        this.autoplayTimer = setTimeout(() => {
            if (!loop && (autoplayDirection ? index === total : index === 0)) {
                this.setState({
                    autoplayEnd: true
                });
            } else {
                this._scrollByIndexStep(autoplayDirection ? 1 : -1);
            }
        }, autoplayDuring * 1000);
    }

    // ScrollHandle
    // fullState
    private fullState(): SwiperState & InternalsFlag {
        return Object.assign({}, this.state, this.internals);
    }

    private _onScrollBeginDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
        this.internals.isScrolling = true;
        // 开始拖动的回调
        const { onScrollBeginDrag } = this.props;
        if (isFunction(onScrollBeginDrag)) {
            onScrollBeginDrag(event, this.fullState(), this);
        }
    }

    private _onScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const { contentOffset } = event.nativeEvent;
        const { horizontal, onScrollEndDrag } = this.props;
        const { swiperItems, index } = this.state;
        const { offset } = this.internals;
        const previousOffset = horizontal ? offset.x : offset.y;
        const newOffset = horizontal ? contentOffset.x : contentOffset.y;

        // 边缘临界点处的滑动处理
        if (previousOffset === newOffset && (index === 0) || index === swiperItems.length - 1) {
            this.internals.isScrolling = false;
        }

        if (isFunction(onScrollEndDrag)) {
            onScrollEndDrag(event, this.fullState(), this);
        }
    }

    private _onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
        this.internals.isScrolling = false;

        // 更新索引
        this._updateIndex(event.nativeEvent.contentOffset, (changed) => {
            this._loopJump();
            if (this.props.autoplay) {
                this._autoplay();
            };

            if (changed) {
                const { onChange } = this.props;
                if (isFunction(onChange)) {
                    onChange(this.state.index);
                }
            }
        });

        const { onMomentumScrollEnd } = this.props;
        if (isFunction(onMomentumScrollEnd)) {
            onMomentumScrollEnd(event, this.fullState(), this);
        }
    }

    private renderNextButton() {
        const { index, total } = this.state;
        const { loop, nextButton, disableNextButton } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    this._scrollByIndexStep(1);
                }}
                disabled={disableNextButton || (!loop && index === total -1)}
            >
            {
                nextButton && (loop || index !== total -1) ?
                <Text style={styles.buttonText}>›</Text>
                :
                null
            } 
            </TouchableOpacity>
        );
    }

    private renderPrevButton() {
        const { index } = this.state;
        const { loop, prevButton, disablePrevButton } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    this._scrollByIndexStep(-1);
                }}
                disabled={disablePrevButton || (!loop && index === 0)}
            >
            {
                prevButton && (loop || index !== 0) ?
                <Text style={styles.buttonText}>‹</Text>
                :
                null
            } 
            </TouchableOpacity>
        );
    }

    private renderButtons() {
        return (
            <View
                pointerEvents="box-none"
                style={[
                    styles.buttonWrapper,
                    {
                        width: this.state.width,
                        height: this.state.height
                    }
                ]}
            >
                {this.renderPrevButton()}
                {this.renderNextButton()}
            </View>
        )
    }

    private renderIndicator(): JSX.Element {
        const {index, total} = this.state;
        const { dotWrapStyle=null, dots } = this.props;

        if (isFunction(dots)) {
            return dots(index, total);
        }

        return (
            <View pointerEvents="none" style={styles.indicatorWrapper}>
                <View style={[styles.indicator, dotWrapStyle]}>
                    <Dot
                        activeDotColor="#ffffff"
                        containerWidth={50}
                        curPage={index}
                        maxPage={total}
                    />
                </View>
            </View>
        )
    }

    private getScrollViewProps(): ScrollViewProps {
        // 初始化一些ScrollView的Props
        const {
            horizontal = true,
            showsHorizontalScrollIndicator = false,
            showsVerticalScrollIndicator = false,
            bounces = false,
            scrollsToTop = false,
            automaticallyAdjustContentInsets = false,
            removeClippedSubviews = true,
        } = this.props;

        return {
            horizontal,
            showsHorizontalScrollIndicator,
            showsVerticalScrollIndicator,
            bounces,
            scrollsToTop,
            automaticallyAdjustContentInsets,
            removeClippedSubviews
        }
    }

    private renderSwiperItems(): JSX.Element | ReactNodeArray {
        const { swiperItems, index, total, width, height } = this.state;
        const { loop, loadMinimal = false, loadMinimalSize = 1, loadMinimalLoader } = this.props;

        const itemStyle = [{ width, height }, styles.slide];
        const loadingStyle = [{ width, height }, styles.slideLoadWrap];

        if (total > 0) {
            // 有很多个
            const nodeList = loop ? [swiperItems[total - 1], ...swiperItems, swiperItems[0]] : swiperItems;

            const loopVal = loop ? 1 : 0;

            return nodeList.map((swiperItem, idx) => {
                if (loadMinimal) {
                    if (
                        (idx >= index + loopVal - loadMinimalSize &&
                            idx <= index + loopVal + loadMinimalSize) ||
                        // The real first swiper should be keep
                        (loop && idx === 1) ||
                        // The real last swiper should be keep
                        (loop && idx === total - 1)
                    ) {
                        return (
                            <View key={idx} style={itemStyle}>
                                { swiperItem}
                            </View>
                        );
                    } else {
                        return (
                            <View style={loadingStyle} key={idx}>
                                {loadMinimalLoader ? loadMinimalLoader : <ActivityIndicator />}
                            </View>
                        );
                    }
                } else {
                    return (
                        <View key={idx} style={itemStyle}>
                            { swiperItem}
                        </View>
                    );
                }
            });
        } else {
            // 一个也没有
            return null;
        }
    }

    private renderScrollView(): JSX.Element {
        const {
            style,
            scrollViewStyle
        } = this.props;

        return (
            <ScrollView
                ref={scroller => { this.refScrollView = scroller }}
                contentContainerStyle={[styles.wrapper, style]}
                style={scrollViewStyle}
                pagingEnabled
                {...this.getScrollViewProps()}
                contentOffset={this.state.offset}
                onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
                onScrollEndDrag={this._onScrollEndDrag.bind(this)}
                onMomentumScrollEnd={this._onScrollEnd.bind(this)}
            >
                {
                    this.renderSwiperItems()
                }
            </ScrollView>
        );
    }

    render() {
        const {
            containerStyle,
            showsButtons=false,
            showDots=true
        } = this.props;

        return (
            <View
                style={[styles.container, containerStyle]}
                onLayout={this._onLayout.bind(this)}
            >
                {this.renderScrollView()}
                {showsButtons && this.renderButtons()}
                {showDots && this.renderIndicator()}
            </View>
        );
    }
}

export const initialState: SwiperState = {
    index: 0,
    total: 0,
    width: 0,
    height: 0,
    dir: 'x',
    offset: { x: 0, y: 0 },
    swiperItems: [],
    autoplayEnd: false,
    loopJump: false,
};

