import React from 'react';
import { View } from 'react-native';
import { OuterShadowChildrenProps } from './interface';
import { transformStylePropsForChildren } from './handle';

export default class OuterShadowChildren<
    T extends OuterShadowChildrenProps
> extends React.PureComponent<T> {
    render() {
        const { children, getSize } = this.props;
        const {
            insideViewStyle,
            width,
            height,
            borderRadius,
            backgroundColor
        } = transformStylePropsForChildren(this.props);
        const viewStyle = { borderRadius, width, height, backgroundColor };
        return (
            <View
                style={[viewStyle, insideViewStyle]}
                onLayout={(event) => {
                    let { width, height } = event.nativeEvent.layout;
                    if (width === 0 || height === 0) {
                        return;
                    }
                    if (typeof getSize === 'function') {
                        getSize(width, height);
                    }
                }}
            >
                {children}
            </View>
        );
    }
}
