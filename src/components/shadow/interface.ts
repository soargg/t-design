import { ViewProps, ViewStyle } from 'react-native';
import { ShadowLevelType, ShadowPosition } from './types';

export interface ViewStyleWithShadow extends ViewStyle {
    [key: string]: any;
    // 阴影偏移量
    shadowOffset?: {
        width: number;
        height: number;
    };
    // 阴影不透明度
    shadowOpacity?: number;
    // 阴影颜色
    shadowColor?: string;
    // 阴影模糊半径
    shadowRadius?: number;
    // 边框圆角半径
    borderRadius?: number;
    // 背景颜色
    backgroundColor?: string;
    // 阴影宽度（如果已知，建议赋值，能减少自适应计算消耗）
    width?: number;
    // 阴影高度（如果已知，建议赋值，能减少自适应计算消耗）
    height?: number;
}

export interface ShadowProps extends ViewProps {
    [key: string]: any;
    // 阴影位置
    shadowPosition?: ShadowPosition;
    // 阴影的等级
    shadow?: ShadowLevelType;
    // 自定义样式
    style?: ViewStyleWithShadow;
}

// 给OuterShadowART组件定义的Props接口
export interface OuterShadowARTProps {
    // 阴影样式
    shadowStyle?: ViewStyleWithShadow;
}

export interface OuterShadowChildrenProps extends ShadowProps {
    getSize?: (width: number, height: number) => void;
}

// 阴影样式，用在Handle.ts中
export interface ShadowStyle {
    // 阴影偏移量
    shadowOffset?: {
        width: number;
        height: number;
    };
    // 阴影不透明度
    shadowOpacity?: number;
    // 阴影颜色
    shadowColor?: string;
    // 阴影模糊半径
    shadowRadius?: number;
}

// 阴影默认样式定义
export interface ShadowLevel {
    // 无阴影
    none: ShadowStyle;
    // 一级阴影样式
    shadow1: ShadowStyle;
    // 二级阴影样式
    shadow2: ShadowStyle;
    // 三级阴影样式
    shadow3: ShadowStyle;
}

// 为了阴影宽高自适应定义的State接口
export interface ShadowState {
    // 是否需要重新Render 组件
    refresh: boolean;
}
