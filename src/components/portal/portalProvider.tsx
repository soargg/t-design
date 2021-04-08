import React from 'react';
import { View } from 'react-native';
import PortalContext from './portalContext';
import { PortalManager } from './portalManager';

type Operation = 
| { type: 'mount'; key: number; children: React.ReactNode, zIndex?: number }
| { type: 'update'; key: number; children: React.ReactNode, zIndex?: number }
| { type: 'unmount'; key: number, zIndex?: number };

type ProviderProps = {
    children: React.ReactNode,
}

export default class PortalProvider extends React.PureComponent<ProviderProps> {
    private nextKey: number = 0;

    private queue: Operation[] = [];

    private manager: PortalManager | null | undefined = null;

    private setManager(manager: PortalManager | null | undefined) {
        this.manager = manager;
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

    // 挂载
    private mount(children: React.ReactNode, zIndex: number): number {
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
    private update(key: number, children: React.ReactNode): void {
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
    private unmount(key: number): void {
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