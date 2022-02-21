import React, { useState, useEffect } from 'react';
import { Animated, StyleProp, ImageStyle, Easing } from 'react-native';
import { arrow_default, arrow_primary, arrow_minor, solid_arrow_default, solid_arrow_primary } from './icons';

export type ArrowProps = {
    color?: 'default' | 'orange' | 'gray';
    direction?: 'r' | 'l' | 'u' | 'd';
    solid?: boolean;
    style?: StyleProp<ImageStyle>;
    animated?: boolean;
    duration?: number;
    reveserRotation?: boolean;
}

export const Arrow = (props: ArrowProps) => {
    const {
        color= 'default',
        direction='d',
        style,
        solid=false,
        animated=false,
        duration=250
    } = props;

    let initdeg = gitInitDeg(direction);

    const [ aniDeg ] = useState<Animated.Value>(new Animated.Value(initdeg));

    let icon = color === 'orange' ? arrow_primary : (color === 'gray' ? arrow_minor : arrow_default);

    if (solid) {
        // 实心箭头
        icon = color === 'orange' ? solid_arrow_primary : solid_arrow_default
    }

    useEffect(() => {
        const deg = gitInitDeg(direction);
        if (animated) {
            Animated.timing(aniDeg, {
                toValue: deg,
                duration,
                easing: Easing.linear,
                useNativeDriver: true
            }).start()
        } else {
            aniDeg.setValue(deg);
        }
    }, [ direction ]);

    function gitInitDeg(dir: 'r' | 'l' | 'u' | 'd') {
        switch (dir) {
            case 'u':
                return -1; // -180deg
            case 'r':
                return 0; // -90deg
            case 'l':
                return 2; // 90deg
            default:
                return 1; // 0deg
        }
    }

    return (
        <Animated.Image
            source={{ uri: icon }}
            style={[
                {width: 10, height: 10},
                style,
                {
                    transform: [
                        { rotate: aniDeg.interpolate({
                            inputRange: [-1, 2],
                            outputRange: ['-180deg', '90deg'],
                            extrapolate: 'clamp'
                        })}
                    ]
                }
            ]}
        />
    );
}


