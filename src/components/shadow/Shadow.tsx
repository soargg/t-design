import React from 'react';
import { ShadowProps } from './interface';
import OuterShadow from './OuterShadow';

export default class Shadow<T extends ShadowProps> extends React.PureComponent<T> {
    static defaultProps = {
        useArt: false, // iOS优先使用原生阴影
        shadowPosition: 'all'
    };

    public render(): JSX.Element {
        return <OuterShadow {...this.props} />;
    }
}
