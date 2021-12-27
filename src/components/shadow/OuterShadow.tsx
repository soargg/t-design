import React from 'react';
import { View, Platform } from 'react-native';
import OuterShadowART from './OuterShadowART';
import OuterShadowChildren from './OuterShadowChildren';
import { filterShadowProps, transformStyleProps } from './handle';
import { ShadowProps, ShadowState, ViewStyleWithShadow } from './interface';

export default class OuterShadow extends React.PureComponent<
    ShadowProps,
    ShadowState
> {
    state: ShadowState = {
        refresh: false
    };

    private width = 0;
    private height = 0;

    constructor(props: ShadowProps) {
        super(props);
        this.getChildrenSize = this.getChildrenSize.bind(this);
    }

    public render(): JSX.Element {
        if (Platform.OS === 'ios') {
            return this.renderNativeIOS();
        }

        return this.renderArt();
    }

    // 使用原生RN的阴影(only iOS), Android的话，还是会用Art 渲染，但是表现为没有阴影
    protected renderNativeIOS(): JSX.Element {
        const { style, children } = this.props;
        const otherProps = filterShadowProps(this.props, ['style', 'children']);
        const { allShadowProps } = transformStyleProps(this.props);

        return (
            <View
                style={[
                    { shadowOffset: { width: 0, height: 0 } },
                    style,
                    { ...allShadowProps }
                ]}
                {...otherProps}>
                {children}
            </View>
        );
    }

    protected renderArt(): JSX.Element {
        const containerProps: ShadowProps = filterShadowProps(this.props, [
            'style',
            'children'
        ]);
        const { outsideViewStyle, allShadowProps } = transformStyleProps(
            this.props
        );
        const { width, height, borderRadius, backgroundColor } = allShadowProps;
        const viewStyle = { borderRadius, width, height, backgroundColor };

        const tAllShadowProps: ViewStyleWithShadow = {
            shadowOffset: allShadowProps.shadowOffset,
            shadowOpacity: allShadowProps.shadowOpacity,
            shadowColor: allShadowProps.shadowColor,
            shadowRadius: allShadowProps.shadowRadius,
            borderRadius: allShadowProps.borderRadius,
            backgroundColor: allShadowProps.backgroundColor,
            width: this.width,
            height: this.height
        };

        return (
            <View
                style={[
                    {position: 'relative', overflow: 'visible'},
                    viewStyle,
                    outsideViewStyle
                ]}
                {...containerProps}
            >
                {!this.state.refresh ? null : (
                    <OuterShadowART
                        shadowStyle={tAllShadowProps}
                    />
                )}
                <OuterShadowChildren
                    {...this.props}
                    getSize={this.getChildrenSize}
                />
            </View>
        );
    }

    protected getChildrenSize(width: number, height: number): void {
        if (this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;

            this.setState({
                refresh: !this.state.refresh
            });
        }
    }
}
