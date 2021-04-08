import React from 'react';
import { PortalMethods } from './portalContext';

type ConsumerProps = {
    manager: PortalMethods;
    children: React.ReactNode;
    zIndex: number;
}

export class PortalConsumer extends React.PureComponent<ConsumerProps> {
    private key: number;

    async componentDidMount() {
        this.checkManager();
        // 延时更新，防止React进入是循环
        await Promise.resolve();
        const { zIndex = 1, children } = this.props;
        this.key = this.props.manager.mount(children, zIndex);
    }

    componentDidUpdate() {
        this.checkManager();
        this.props.manager.update(this.key, this.props.children);
    }

    componentWillUnmount() {
        this.checkManager();
        this.props.manager.unmount(this.key);
    }

    private checkManager() {
        if (!this.props.manager) {
            throw new Error('PortalConsumer: Looks like you forgot to wrap your root component with `PortalProvider` component from t-design');
        }
    }

    render(): null {
        return null;
    }
}