import React from 'react';
import { Image, StyleProp, ImageStyle } from 'react-native';
import { close_default, close_orange, close_green, close_gray, close_red } from './icons';

export type CloseProps = {
    color?: 'default' | 'red' | 'green' | 'orange' | 'gray';
    style?: StyleProp<ImageStyle>;
}

export const Close = (props: CloseProps) => {
    const { style, color } = props;

    let icon = close_default;
    if ( color === 'red' ) {
        icon = close_red;
    } else if (color === 'orange') {
        icon = close_orange;
    } else if (color === 'green') {
        icon = close_green;
    } else if ( color === 'gray' ) {
        icon = close_gray;
    }

    return <Image source={{ uri: icon }} style={[{ width: 12, height: 12 }, style]} />;
}