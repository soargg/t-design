import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Shape } from '@react-native-community/art';
import { isAndroid } from '../common';
import type { StyleProp, ViewStyle } from 'react-native';

type DividerProps = {
    dividerWidth?: number;
    style?: {
        margin?: number | string | undefined;
        marginBottom?: number | string | undefined;
        marginEnd?: number | string | undefined;
        marginHorizontal?: number | string | undefined;
        marginLeft?: number | string | undefined;
        marginRight?: number | string | undefined;
        marginStart?: number | string | undefined;
        marginTop?: number | string | undefined;
        marginVertical?: number | string | undefined;
    };
    dividerColor?: string;
    dashed?: boolean;
    strokeDash?: number[]
}

export const Divider: React.FunctionComponent<DividerProps> = (props) => {
    const {
        dividerWidth = 1,
        dividerColor='#E9E9E9',
        dashed=false,
        style,
        strokeDash= [4, isAndroid ? 12 : 4]
    } = props;

    const height = dividerWidth > 1 ? dividerWidth : 1;
    const [ surfaceWidth, setWidth ] = useState<number>(0);
    const [ show, setShow ] = useState<boolean>(false);

    // solide
    const divStyle: StyleProp<ViewStyle> = [{width: '100%', height, backgroundColor: dividerColor }];
    if (dividerWidth < 1 && dividerWidth >= 0) {
        divStyle.push({
            transform: [{ scaleY: dividerWidth }]
        });
    }

    return (
        <View
            style={[{ width: '100%' }, style, { height }]}
            onLayout={e => {
                setWidth(e.nativeEvent.layout.width);
                setShow(true);
            }}
        >
            {
                dashed ?
                (
                    show ?
                    <Surface height={height} width={surfaceWidth}>
                        <Shape
                            d={`M 0,${height / 2} H ${surfaceWidth},${height / 2}`}
                            stroke={dividerColor}
                            strokeWidth={dividerWidth}
                            strokeCap="round"
                            strokeDash={strokeDash}
                        />
                    </Surface>
                    :
                    null
                )
                :
                <View style={StyleSheet.flatten(divStyle)} />
            }
        </View>
    );
}

