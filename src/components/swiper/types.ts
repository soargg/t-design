import type { ReactNodeArray } from 'react';
import type { StyleProp, ViewStyle, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { Swiper } from './swiper';

export interface SwiperProps {
    children?: ReactNodeArray;
    /**
     * @param index
     * 定位索引 不完全受控组件
     */
    index?: number;
    /**
     * @param style
     * 样式会应用到一个内层的内容容器上，所有的子视图都会包裹在内容容器内
     * ScrollView 的 contentContainerStyle
     */
    style?: StyleProp<ViewStyle>;
    /**
     * @param containerStyle
     * 容器样式
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * @param width
     * 预设宽度
     */
    width?: number;
    /**
     * @param height
     * 预设高度
     */
    height?: number;
    /**
     * @param loadMinimal
     * 未出现的展示loading
     */
    loadMinimal?: boolean;
    /**
     * @param loadMinimalSize
     */
    loadMinimalSize?: number;
    loadMinimalLoader?: JSX.Element;
    /**
     * @param loop
     * 循环轮播
     */
    loop?: boolean;
    /**
     * @param autoplay
     * 自动轮播
     */
    autoplay?: boolean;
    /**
     * @param autoplayDuring
     * 自动轮播间隔 单位s
     */
    autoplayDuring?: number; // 单位s
    /**
     * @param autoplayDirection
     * 自动轮播切换方向
     */
    autoplayDirection?: true;
    /**
     * @param nextButton
     * 切换下一帧按钮
     */
    nextButton?: boolean;
    /**
     * @param prevButton
     * 切换上一帧按钮
     */
    prevButton?: boolean;
    /**
     * @param showsButtons
     * 是否展示导航按钮
     */
    showsButtons?: boolean;
    /**
     * @param showsPagination
     * 展示轮播点点
     */
    disableNextButton?: boolean;
    disablePrevButton?: boolean;
    showDots?: boolean;
    dotWrapStyle?: StyleProp<ViewStyle>;
    dots?: (index: number, total: number) => JSX.Element;
    onChange?(index: number): void;

    // ScrollViewProps
    /**
     * @param scrollViewStyle
     * 滑动区域样式
     */
    scrollViewStyle?: StyleProp<ViewStyle>;
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    bounces?: boolean;
    scrollsToTop?: boolean;
    removeClippedSubviews?: boolean;
    automaticallyAdjustContentInsets?: boolean;
    onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>, state: SwiperState & InternalsFlag, swipper: Swiper ) => void;
    onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>, state: SwiperState & InternalsFlag, swipper: Swiper ) => void;
    onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>, state: SwiperState & InternalsFlag, swipper: Swiper ) => void;
}

export interface SwiperState {
    total: number; // 子元素数量
    index: number; // 当前索引
    width: number; // Swiper 宽
    height: number; // Swiper 高
    offset: {
        x: number;
        y: number;
    },
    dir: 'y' | 'x';
    swiperItems: ReactNodeArray; // Swiper子列表
    autoplayEnd: boolean;
    loopJump: boolean;
}

export type InternalsFlag = {
    isScrolling: boolean;
    offset: {
        x: number;
        y: number;
    }
}