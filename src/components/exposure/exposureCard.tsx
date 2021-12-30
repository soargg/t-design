import React from 'react';
import ExposureContext from './exposureContext';
import { ExposureConsumer, ExposureCardProps } from './exposureConsumer';

export default class ExposureCard extends React.PureComponent<ExposureCardProps> {
    static get displayName() { return 'ExposureCard' };

    render() {
        return (
            <ExposureContext.Consumer>
            {
                (manager) => (<ExposureConsumer {...{ ...this.props, manager }} />)
            }
            </ExposureContext.Consumer>
        );
    }
}