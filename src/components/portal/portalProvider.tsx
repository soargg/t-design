import React, { ReactNode } from 'react';
import { View } from 'react-native';
import PortalContext from './portalContext';
import { PortalManager } from './portalManager';

type Operation = 
| { type: 'mount'; key: number; children: ReactNode, zIndex?: number }
| { type: 'update'; key: number; children: ReactNode, zIndex?: number }
| { type: 'unmount'; key: number, zIndex?: number };

type ProviderProps = {
    children: ReactNode,
}

let providerList: PortalProvider[] = [];
let providerIndex: number = 0;

class PortalProvider extends React.PureComponent<ProviderProps> {
    static get displayName() { return 'PortalProvider' }
    static mount: (children: ReactNode, zIndex?: number) => number;
    static update: (key: number, children:ReactNode) => void;
    static unmount: (key: number) => void;

    providerKey = providerIndex++;
    private nextKey: number = 0;
    private queue: Operation[] = [];
    private manager: PortalManager | null | undefined = null;

    constructor(props: ProviderProps) {
        super(props);
        // 闭包存储Provider实例
        providerList.push(this);
    }

    componentDidMount() {
        const manager = this.manager;
        const queue = this.queue;

        while(queue.length && manager) {
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
                        break
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

    private setManager(manager: PortalManager | null | undefined) {
        this.manager = manager;
    }

    // 挂载
    mount(children: ReactNode, zIndex: number): number {
        const key = this.nextKey++;
        if (this.manager) {
            this.manager.mount({key, children, zIndex})
        } else {
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
    update(key: number, children: React.ReactNode): void {
        if (this.manager) {
            this.manager.update(key, children);
        } else {
            const op: Operation = { type: 'mount', key, children };
            const index = this.queue.findIndex(o => (
                o.type === 'mount' || (o.type === 'update' && o.key === key)
            ));
            
            if (index > -1) {
                // @ts-ignore
                this.queue[index] = op;
            } else {
                this.queue.push(op);
            }
        }
    }

    // 卸载
    unmount(key: number): void {
        if (this.manager) {
            this.manager.unmount(key);
        } else {
            this.queue.push({ type:'unmount', key });
        }
    }
    
    render() {
        return (
            <PortalContext.Provider value={
                {
                    mount: this.mount.bind(this),
                    update: this.update.bind(this),
                    unmount: this.unmount.bind(this)
                }
            }>
                <View
                    style={{flex: 1}}
                    collapsable={false}
                    pointerEvents="box-none"
                >
                    { this.props.children }
                </View>
                <PortalManager ref={this.setManager.bind(this)}/>
            </PortalContext.Provider>
        );
    }
}

PortalProvider.mount = function(children: ReactNode, zIndex: number): number {
    checkPortalEmpty(true);
    const provider = providerList[providerList.length - 1];
    return provider.mount(children, zIndex);
}

PortalProvider.update = function(key: number, children: ReactNode): void {
    if ( checkPortalEmpty() ) {
        return
    }
    const provider = providerList[providerList.length - 1];
    provider.update(key, children);
}

PortalProvider.unmount = function(key: number): void {
    if ( checkPortalEmpty() ) {
        return
    }
    const provider = providerList[providerList.length - 1];
    provider.unmount(key);
}

function checkPortalEmpty (throwError: boolean = false): boolean {
    if (providerList.length <= 0) {
        if (throwError) {
            throw new Error('PortalProvider: Looks like you forgot to wrap your root component with `PortalProvider` component from t-design');
        }
        return true;
    }
    return false
}

export default PortalProvider;