import React from 'react';
import type {
    StyleProp,
    ViewStyle,
    TextStyle,
    ImageSourcePropType
} from 'react-native';

/**
 * Protal
 */
export type PortalProps = {
    children: React.ReactNode
    zIndex?: number;
};
declare class Portal extends React.PureComponent<PortalProps> { }

export declare class PortalProvider extends React.PureComponent {
    static mount(children: React.ReactNode): number;
    static update(key: number, children: React.ReactNode): void;
    static unmount(key: number): void;
}

/**
 * Popup
 */
type PopupProps = {
    children: React.ReactNode;
    /**
     * show
     * Popup的展示与隐藏
     */
    show: boolean;
    /**
     * maskStyle
     * 遮罩的样式
     */
    maskStyle?: StyleProp<ViewStyle> | undefined | null;
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
    animate?: 'fadeInOut' | 'scale' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | undefined | null;
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
declare class Popup extends React.PureComponent<PopupProps> { }

/**
 * Rating
 */
export type RatingProps = {
    /**
     * value
     * 评分的值
     */
    value?: number;
    /**
     * size
     * 自定义星星的size， 默认{width: 12, height: 12}
     */
    size?: {
        width: number;
        height: number;
    };
    /**
     * gap
     * 星星之间的间隔
     */
    gap?: number;
    /**
     * source
     * 高亮的小星星
     * 与Image组件source的值一致
     */
    source?: ImageSourcePropType;
    /**
     * source
     * 底图，灰色小星星
     * 与Image组件source的值一致
     */
    graySource?: ImageSourcePropType;
    /**
     * total
     * 小星星的数量 默认 5个
     */
    total?: number;
    /**
     * readonly
     * 小星星是否只读
     * 默认 false，可点击触发 onChange事件
     */
    readonly?: boolean;
    /**
     * onChange
     * 点击小星星时触发当前的
     * @param value { number } 当前值
     */
    onChange?(value: number): void;
}

declare class Rating extends React.PureComponent<RatingProps>{ }

/**
 * CircularProgress
 */
type RenderCapParams = {
    center: {
        x: number,
        y: number
    }
}
export interface CircularProgressProps {
    /**
     * fill
     * 当前进度，封顶100
     */
    fill: number;
    /**
     * size
     * 绘制”纸张“的尺寸
     */
    size: number;
    /**
     * width
     * 圆环的线条宽度
     */
    width: number;
    /**
     * width
     * 圆环的线条背景宽度
     */
    backgroundWidth?: number;
    /**
     * tintColor
     * 绘制颜色
     */
    tintColor?: string;
    /**
     * backgroundColor
     * 线条背景绘制颜色
     */
    backgroundColor?: string;
    /**
     * style
     * "纸张的样式"
     */
    style?: StyleProp<ViewStyle>;
    padding?: number,
    /**
     * rotation
     * 图案的旋转值
     */
    rotation?: number,
    /**
     * lineCap
     * 绘制线的端点样式
     */
    lineCap?: 'butt' | 'square' | 'round',
    /**
     * arcSweepAngle
     * 绘制圆弧的最大的弧度
     * 默认 2π。完整圆环 360°
     */
    arcSweepAngle?: number,
    /**
     * dashedBackground
     * 控制用于笔划路径的虚线和间距的图案
     */
    dashedBackground?: { width: number, gap: number }
    /**
     * containerStyle
     * child容器的样式
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * children
     * @param fill Number
     */
    children?(fill: number): React.ReactNode;
    renderCap?(params: RenderCapParams): React.ReactNode;
}

declare class CircularProgress extends React.PureComponent<CircularProgressProps> { }

/**
 * Popover
 */
export type PopoverProps = {
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
     * offset
     * 气泡不在正中位置的时候，左右半部分的偏移量
     * 默认20
     */
    offset?: number;
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
declare class Popover extends React.PureComponent<PopoverProps> { }

/**
 * Toast
 */
declare const Toast: {
    info(txt: string, during?: number): void;
    success(txt: string, during?: number): void;
    fail(txt: string, during?: number): void;
    loading(txt: string, during?: number): void
};

/**
 * Alert
 */
type AlertContentModule = string
    | (() => React.ReactNode)
    | {
        content: string | (() => React.ReactNode);
        title?: string;
        btnText?: string;
        btnStyle?: StyleProp<TextStyle>;
        cancel?: boolean;
        zIndex?: number;
    }
declare const Alert: (content: AlertContentModule) => Promise<boolean>;

/**
 * Confirm
 */
type ConfirmContentModule = string | (() => React.ReactNode)
    | {
        content: string | (() => React.ReactNode);
        title?: string;
        btnText?: [string, string];
        btnStyles?: StyleProp<ViewStyle>[];
        btnTxtStyles?: StyleProp<TextStyle>[];
        cancel?: boolean;
        zIndex?: number;
    }
declare const Confirm: (content: ConfirmContentModule) => Promise<boolean>;

/**
 * Checkbox
 */
export type CheckboxValueType = string | number | boolean;

export interface CheckboxOptionType {
    label: React.ReactNode;
    value: CheckboxValueType;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    onChange?(next: boolean): void;
}

type CheckboxGroupProps = {
    /**
     * options
     * 选择框列表
     */
    options?: Array<CheckboxOptionType | string>;
    /**
     * defaultValue
     * more值列表
     */
    defaultValue?: CheckboxValueType[];
    /**
     * value
     * 已选值列表
     */
    value?: CheckboxValueType[];
    /**
     * style
     * Group样式
     */
    style?: StyleProp<ViewStyle>;
    /**
     * disabled
     * 禁用
     */
    disabled?: boolean;
    /**
     * onChange
     * 状态变化时回调
     */
    onChange?(checkedValue: CheckboxValueType[]): void;
}

declare class CheckboxGroup extends React.PureComponent<CheckboxGroupProps> { }

interface CheckboxProps {
    children?: React.ReactNode;
    /**
     * value
     * checkbox的值 ，唯一
     */
    value?: string | number | boolean;
    /**
     * checked
     * 是否选中
     */
    checked?: boolean;
    /**
     * disabled
     * 禁用
     */
    disabled?: boolean;
    /**
     * style
     * checkbox 容器的样式
     */
    style?: StyleProp<ViewStyle>;
    /**
     * checkboxType
     * checkbox 类型，圆 或 方
     */
    checkboxType?: 'circle' | 'square';
    /**
     * indeterminate
     * 不确定状态
     */
    indeterminate?: boolean;
    /**
     * onChange
     * checkbox状态变化是回调
     */
    onChange?(next: boolean): void;
}

declare class Checkbox extends React.PureComponent<CheckboxProps> {
    static readonly Group: typeof CheckboxGroup;
}

/**
 * Radio
 */
export type RadioValueType = string | number | boolean;
export type RadioOptionType = {
    label: React.ReactNode;
    value: RadioValueType;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    onChange?(next: boolean): void;
}

type RadioGroupProps = {
    /**
     * options
     * 选择框列表
     */
    options?: Array<RadioOptionType | string>;
    /**
     * defaultValue
     * more值列表
     */
    defaultValue?: RadioValueType;
    /**
     * value
     * 已选值列表
     */
    value?: RadioValueType;
    /**
     * style
     * Group样式
     */
    style?: StyleProp<ViewStyle>;
    /**
     * disabled
     * 禁用
     */
    disabled?: boolean;
    /**
     * onChange
     * 状态变化时回调
     */
    onChange?(checkedValue: RadioValueType): void;
}

declare class RadioGroup extends React.PureComponent<RadioGroupProps>{ }

type RadioProps = {
    children?: React.ReactNode;
    /**
     * value
     * radio的值 ，唯一
     */
    value?: RadioValueType;
    /**
     * checked
     * 是否选中
     */
    checked?: boolean;
    /**
     * disabled
     * 禁用
     */
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    onChange?(next: boolean): void
}

declare class Radio extends React.PureComponent<RadioProps> {
    static readonly Group: typeof RadioGroup;
}