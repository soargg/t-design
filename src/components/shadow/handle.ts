import { Platform, StyleSheet } from 'react-native';
import { ShadowProps, ShadowStyle } from './interface';
import shadowStyles from './styles';
import { ShadowLevelType } from './types';

const baseColor = {
    white: '#fffFff'
}

export function getShadowStyles(shadow: ShadowLevelType): ShadowStyle {
    return shadowStyles[shadow] || shadowStyles['none']; // none 为默认值，如果用户写错了，按none
}

/**
 * 过滤组件props属性
 * @param props
 * @param excludesProps
 */
export function filterShadowProps(
    props: ShadowProps,
    excludesProps: Array<string> = []
): ShadowProps {
    const shadowProps: ShadowProps = {};

    Object.keys(props).forEach((key) => {
        if (!excludesProps.includes(key)) {
            shadowProps[key] = props[key];
        }
    });

    return shadowProps;
}

export function getPathWithRadius(
    width: number,
    height: number,
    borderRadius: number,
    oX: number,
    oY: number
): string {
    if (borderRadius) {
        // 画圆角的前缀
        const APrefix = `A ${borderRadius}, ${borderRadius}, 0 0 1`;
        // 上左圆角
        const ATopLeft = `${APrefix} ${oX + borderRadius}, ${oY}`;
        // 上右圆角
        const ATopRight = `${APrefix} ${oX + width},${oY + borderRadius}`;
        // 下右圆角
        const ABottomRight = `${APrefix} ${oX + width - borderRadius},${oY + height}`;
        // 下左圆角
        const ABottomLeft = `${APrefix} ${oX},${oY + height - borderRadius}`;

        // 圆角矩形
        return `M ${oX},${oY + borderRadius} ${ATopLeft} H ${oX + width - borderRadius} ${ATopRight} V ${oY + height - borderRadius} ${ABottomRight} H ${oX + borderRadius} ${ABottomLeft} Z`;
    } else {
        return `M ${oX},${oY} H ${width + oX} V ${height + oY} H ${oX} Z`;
    }
}

export function transformShadowProps(props: any): any {
    const shadowProps = { ...props };
    const offsetX = props.shadowOffset.x
        ? props.shadowOffset.x
        : props.shadowOffset.width;
    const offsetY = props.shadowOffset.y
        ? props.shadowOffset.y
        : props.shadowOffset.height;

    if (Platform.OS === 'android') {
        shadowProps.shadowRadius = props.shadowRadius * 2.5;
        shadowProps.shadowOffset.x = offsetX * 3;
        shadowProps.shadowOffset.y = offsetY * 3;
    } else {
        shadowProps.shadowRadius = props.shadowRadius;
        shadowProps.shadowOffset.x = offsetX;
        shadowProps.shadowOffset.y = offsetY;
    }

    return shadowProps;
}

export function transformStyleProps(props: ShadowProps) {
    const { style, shadow, shadowPosition='bottom' } = props;
    let styleProps = style instanceof Array ? StyleSheet.flatten(style) : style;
    styleProps = styleProps ? styleProps : {};
    let {
        /* start shadow props */
        width,
        height,
        borderRadius = 0,
        backgroundColor,
        shadowOpacity = 1,
        shadowOffset = { width: 0, height: 0 },
        shadowRadius,
        shadowColor,
        /* end shadow props */
        bottom,
        direction,
        display,
        end,
        left,
        margin,
        marginBottom,
        marginEnd,
        marginHorizontal,
        marginLeft,
        marginRight,
        marginStart,
        marginTop,
        marginVertical,
        position,
        right,
        start,
        top,
        zIndex,
        backfaceVisibility,
        opacity,
        transform
    } = styleProps;

    const outsideViewStyle = {
        bottom,
        direction,
        display,
        end,
        left,
        margin,
        marginBottom,
        marginEnd,
        marginHorizontal,
        marginLeft,
        marginRight,
        marginStart,
        marginTop,
        marginVertical,
        position,
        right,
        start,
        top,
        zIndex,
        backfaceVisibility,
        opacity,
        transform
    };
    if (borderRadius > width / 2) {
        borderRadius = width / 2;
    }
    if (borderRadius > height / 2) {
        borderRadius = height / 2;
    }

    if (!backgroundColor) {
        backgroundColor = baseColor.white;
    }
    if (shadow) {
        const shadowStyles: ShadowStyle = getShadowStyles(shadow);
        return {
            outsideViewStyle,
            allShadowProps: {
                width,
                height,
                borderRadius: borderRadius < 0 ? 0 : borderRadius,
                backgroundColor:
                    backgroundColor === 'transparent'
                        ? '#00000000'
                        : backgroundColor,
                shadowOpacity: shadowStyles!.shadowOpacity,
                shadowOffset: {
                    width: shadowStyles.shadowOffset!.width,
                    height: shadowPosition === 'top' ? -shadowStyles.shadowOffset!.height : shadowStyles.shadowOffset!.height
                },
                shadowRadius: shadowStyles.shadowRadius
                    ? shadowStyles.shadowRadius * 2
                    : 0.1,
                shadowColor: shadowStyles.shadowColor
            }
        };
    } else {
        return {
            outsideViewStyle,
            allShadowProps: {
                width,
                height,
                borderRadius: borderRadius < 0 ? 0 : borderRadius,
                backgroundColor:
                    backgroundColor === 'transparent'
                        ? '#00000000'
                        : backgroundColor,
                shadowOpacity,
                shadowOffset: {
                    width: shadowOffset.width,
                    height: shadowOffset.height
                },
                shadowRadius: shadowRadius ? shadowRadius * 2 : 0.1,
                shadowColor
            }
        };
    }
}

export function transformStylePropsForChildren(props: ShadowProps) {
    const { style } = props;
    let styleProps = style instanceof Array ? StyleSheet.flatten(style) : style;
    styleProps = styleProps ? styleProps : {};
    let { width, height, borderRadius = 0, backgroundColor } = styleProps;

    const excludesProps = [
        'width',
        'height',
        'borderRadius',
        'backgroundColor',
        'shadowOpacity',
        'shadowOffset',
        'shadowRadius',
        'shadowColor',
        'bottom',
        'direction',
        'display',
        'end',
        'left',
        'margin',
        'marginBottom',
        'marginEnd',
        'marginHorizontal',
        'marginLeft',
        'marginRight',
        'marginStart',
        'marginTop',
        'marginVertical',
        'position',
        'right',
        'start',
        'top',
        'zIndex',
        'backfaceVisibility',
        'opacity',
        'transform',
        'alignSelf',
        'borderBottomEndRadius',
        'borderBottomLeftRadius',
        'borderBottomRightRadius',
        'borderBottomStartRadius',
        'borderTopEndRadius',
        'borderTopLeftRadius',
        'borderTopRightRadius',
        'borderTopStartRadius',
        'flex',
        'flexBasis',
        'flexGrow',
        'flexShrink',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'elevation'
    ];
    const insideViewStyle: any = {};
    Object.keys(styleProps).forEach((key) => {
        if (!excludesProps.includes(key)) {
            if (styleProps) {
                insideViewStyle[key] = styleProps[key];
            }
        }
    });

    if (borderRadius > width / 2) {
        borderRadius = width / 2;
    }
    if (borderRadius > height / 2) {
        borderRadius = height / 2;
    }

    if (!backgroundColor) {
        backgroundColor = baseColor.white;
    }
    return {
        insideViewStyle,
        width,
        height,
        borderRadius: borderRadius < 0 ? 0 : borderRadius,
        backgroundColor:
            backgroundColor === 'transparent' ? '#00000000' : backgroundColor
    };
}
