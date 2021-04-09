import React from 'react';
import { View } from 'react-native';
import PortalContext from './portalContext';
import { PortalManager } from './portalManager';
let providerList = [];
let providerIndex = 0;
class PortalProvider extends React.PureComponent {
    constructor(props) {
        super(props);
        this.providerKey = providerIndex++;
        this.nextKey = 0;
        this.queue = [];
        this.manager = null;
        // 闭包存储Provider实例
        providerList.push(this);
    }
    static get displayName() { return 'PortalProvider'; }
    componentDidMount() {
        const manager = this.manager;
        const queue = this.queue;
        while (queue.length && manager) {
            const action = queue.shift();
            if (action) {
                switch (action.type) {
                    case 'mount':
                        manager.mount({
                            key: action.key,
                            children: action.children,
                            zIndex: action.zIndex
                        });
                        break;
                    case 'update':
                        manager.update(action.key, action.children);
                        break;
                    case 'unmount':
                        manager.unmount(action.key);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    componentWillUnmount() {
        // 组件卸载时，实例从存储中移除
        providerList = providerList.filter(p => p.providerKey !== this.providerKey);
    }
    setManager(manager) {
        this.manager = manager;
    }
    // 挂载
    mount(children, zIndex) {
        const key = this.nextKey++;
        if (this.manager) {
            this.manager.mount({ key, children, zIndex });
        }
        else {
            this.queue.push({
                type: 'mount',
                key,
                children,
                zIndex
            });
        }
        return key;
    }
    // 更新
    update(key, children) {
        if (this.manager) {
            this.manager.update(key, children);
        }
        else {
            const op = { type: 'mount', key, children };
            const index = this.queue.findIndex(o => (o.type === 'mount' || (o.type === 'update' && o.key === key)));
            if (index > -1) {
                // @ts-ignore
                this.queue[index] = op;
            }
            else {
                this.queue.push(op);
            }
        }
    }
    // 卸载
    unmount(key) {
        if (this.manager) {
            this.manager.unmount(key);
        }
        else {
            this.queue.push({ type: 'unmount', key });
        }
    }
    render() {
        return (<PortalContext.Provider value={{
                mount: this.mount.bind(this),
                update: this.update.bind(this),
                unmount: this.unmount.bind(this)
            }}>
                <View style={{ flex: 1 }} collapsable={false} pointerEvents="box-none">
                    {this.props.children}
                </View>
                <PortalManager ref={this.setManager.bind(this)}/>
            </PortalContext.Provider>);
    }
}
PortalProvider.mount = function (children, zIndex) {
    checkPortalEmpty(true);
    const provider = providerList[providerList.length - 1];
    return provider.mount(children, zIndex);
};
PortalProvider.update = function (key, children) {
    if (checkPortalEmpty()) {
        return;
    }
    const provider = providerList[providerList.length - 1];
    provider.update(key, children);
};
PortalProvider.unmount = function (key) {
    if (checkPortalEmpty()) {
        return;
    }
    const provider = providerList[providerList.length - 1];
    provider.unmount(key);
};
function checkPortalEmpty(throwError = false) {
    if (providerList.length <= 0) {
        if (throwError) {
            throw new Error('PortalProvider: Looks like you forgot to wrap your root component with `PortalProvider` component from t-design');
        }
        return true;
    }
    return false;
}
export default PortalProvider;
