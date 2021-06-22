import type {
    StyleProp,
    ViewStyle,
    Animated,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    GestureResponderEvent,
    PanResponderGestureState
} from 'react-native';

type ParallaxProps = {
    scrollPosition: Animated.Value;
    carouselRef: any;
    vertical: boolean;
    sliderWidth: number;
    sliderHeight: number;
    itemWidth: number;
    itemHeight: number;
}

export type CarouselProps<ItemT = any> = {
    /**
     * 数据源 Array
     */
    data: ReadonlyArray<ItemT>,
    /**
     * 自定义子项
     * @param item ItemT
     * @param index number
     * @returns JSX.Element
     */
    renderItem(item: ItemT, index: number, parallaxProps?: ParallaxProps): JSX.Element;
    /**
     * 每一个子项的宽度
     * 横向滑动时，该参数必须
     */
    itemWidth?: number;
    /**
     * @param itemHeight
     * 每一个子项的高度
     * 纵向滑动时，必须
     */
    itemHeight?: number;
    /**
     * 可响应滑动区域的宽度
     * 横向滑动时，该参数必须
     */
    sliderWidth?: number;
    /**
     * 可响应滑动区域的的高度
     * 纵向滑动时，必须
     */
    sliderHeight?: number;
    /**
     * 初始索引
     */
    defaultIndex?: number;
    /**
     * 设置为true时纵向滑动
     * 默认 false
     */
    vertical?: boolean;
    /**
     * 支持停驻点滑动
     * 默认 true
     */
    enableSnap?: boolean;
    /**
     * 视图可滚动
     * 默认true
     */
    scrollEnabled?: boolean;
    /**
     * 支持惯性滚动
     * 默认false
     */
    enableMomentum?: boolean,
    /**
     * 循环 默认false
     */
    loop?: boolean,
    /**
     * 循环轮播时
     * 首尾复制的数量 默认3
     */
    loopClonesPerSide?: number;
    /**
     * Card偏移量
     */
    layoutCardOffset?: number;
    activeAnimationType?: 'timing';
    activeAnimationOptions?: Animated.TimingAnimationConfig;
    activeSlideAlignment?: 'center' | 'end' | 'start';
    /**
     * 更新优化
     * 默认true
     */
    shouldOptimizeUpdates?: boolean,
    /**
     * 手势滑动距离达到该阈值时切下一张卡片
     */
    swipeThreshold?: number;
    apparitionDelay?: number;
    /**
     * 自动轮播
     * 默认false
     */
    autoplay?: boolean;
    /**
     * 自动轮播延迟
     * 1000 ms
     */
    autoplayDelay?: number,
    /**
     * 自动轮播间隔
     * 3000 ms
     */
    autoplayInterval?: number,
    /**
     * 
     */
    callbackOffsetMargin?: number,
    /**
     * inactiveSlideScale
     */
    inactiveSlideScale?: number,
    inactiveSlideShift?: number,
    layout?: 'linear' | 'default' | 'stack' | 'tinder';
    lockScrollTimeoutDuration?: number;
    lockScrollWhileSnapping?: boolean;
    /**
     * 自定义ScrollView组件
     */
    useScrollView?: any;
    /**
     * ScrollView 样式
     */
    containerCustomStyle?: StyleProp<ViewStyle>;
    /**
     * contentContainerCustomStyle
     * ScrollView 的contentContainerStyle属性
     */
    contentContainerCustomStyle?: StyleProp<ViewStyle>;
    /**
     * 子元素样式
     */
    slideStyle?: StyleProp<ViewStyle>;
    /**
     * 
     */
    inactiveSlideOpacity?: number;
    /**
     * 此函数用于为给定的 item 生成一个不重复的 key。
     * Key 的作用是使 React 能够区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，
     * 减少重新渲染的开销。若不指定此函数，则默认抽取item.key作为 key 值。
     * 若item.key也不存在，则使用数组下标。
     * @param item Object
     * @param index Number
     */
    keyExtractor?(item: ItemT, index: number): string;
    /**
     * 滑动回调
     */
    onScroll?(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    onSnapToItem?(index: number): void;
    onBeforeSnapToItem?(index: number): void;
    /**
     * carousel 绘制完成回调
     */
    onLayout?(event: LayoutChangeEvent): void;
    onTouchStart?(): void;
    onTouchEnd?(): void;
    /**
     * 拖拽开始
     * @param event NativeSyntheticEvent<NativeScrollEvent>
     */
    onScrollBeginDrag?(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    /**
     * 拖拽结束
     * @param event NativeSyntheticEvent<NativeScrollEvent>
     */
    onScrollEndDrag?(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    /**
     * 惯性滚动结束
     * @param event NativeSyntheticEvent<NativeScrollEvent>
     */
    onMomentumScrollEnd?(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    /**
     * 自定义动画映射 Interpolator
     * @param index Number
     * @param props CarouselProps<ItemT>
     */
    scrollInterpolator?(index: number, props: CarouselProps<ItemT>): Animated.InterpolationConfigType;
    /**
     * 配合scrollInterpolator
     * 自定义动画实现函数
     */
    slideInterpolatedStyle?(index: number, animatedValue: Animated.AnimatedInterpolation, props: CarouselProps<ItemT>): StyleProp<ViewStyle>;
    /**
     * 有视差图
     * 默认false
     */
    hasParallaxImages?: boolean,
    /**
     * 手势开始捕获阶段
     */
    onStartShouldSetResponderCapture?(event: GestureResponderEvent, gestureState: PanResponderGestureState): void;
}

export type CarouselState = {
    interpolators: Array<Animated.Value | Animated.AnimatedInterpolation>;
    hideCarousel: boolean;
}