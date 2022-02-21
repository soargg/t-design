
import React from 'react';
import type { ArrowProps } from './arrow';
import type { CloseProps } from './close';

export class Mini extends React.PureComponent {
    static get Arrow(): React.FunctionComponent<ArrowProps> {
        return require('./arrow').Arrow;
    }

    static get Close(): React.FunctionComponent<CloseProps> {
        return require('./close').Close;
    }

    render(): React.ReactNode {
        return this.props.children;
    }
}