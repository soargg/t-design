import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Shape, Group } from '@react-native-community/art';
import { getPathWithRadius, transformShadowProps } from './handle';
import { OuterShadowARTProps } from './interface';

export default class OuterShadowART<
    T extends OuterShadowARTProps
> extends React.PureComponent<T> {
    render(): JSX.Element {
        const { shadowStyle } = this.props;
        const {
            width = 0,
            height = 0,
            borderRadius = 0,
            shadowRadius = 0,
            shadowOffset,
            shadowOpacity,
            shadowColor,
            backgroundColor
        } = shadowStyle!;

        const shadowProps = transformShadowProps({
            shadowOpacity,
            shadowOffset,
            shadowRadius,
            shadowColor
        });

        // 阴影偏移取个正值
        const absOffsetX = Math.abs(shadowOffset.width);
        const absOffsetY = Math.abs(shadowOffset.height);

        // 不管往哪个方向偏移，都要在画布的宽高上加上去
        const boxWidth = width + shadowRadius * 2 + absOffsetX;
        const boxHeight = height + shadowRadius * 2 + absOffsetY;

        // 起始原点位置
        const oX = shadowRadius - shadowOffset.width > 0 ? shadowRadius - shadowOffset.width : 0;
        const oY = shadowRadius - shadowOffset.height > 0 ? shadowRadius - shadowOffset.height : 0;

        const path = getPathWithRadius(width, height, borderRadius, oX, oY);

        return (
            <Surface
                height={boxHeight}
                width={boxWidth}
                style={[
                    styles.surface,
                    { left: -oX, top: -oY }
                ]}
            >
                <Group height={boxHeight} width={boxWidth}>
                    <Shape d={path} fill={backgroundColor} { ...shadowProps }/>
                </Group>
            </Surface>
        )
    }
}

const styles = StyleSheet.create({
    surface: {
        position: 'absolute',
        backgroundColor: 'transparent'
    }
});
