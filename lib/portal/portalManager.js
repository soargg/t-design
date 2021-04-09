import React from 'react';
import { View, StyleSheet } from 'react-native';
export class PortalManager extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            portals: []
        };
    }
    // 挂载
    mount(portal) {
        this.setState(state => ({
            portals: [...state.portals, portal]
        }));
    }
    // 更新
    update(key, children) {
        this.setState(state => ({
            portals: state.portals.map(item => {
                if (item.key === key) {
                    return { ...item, children };
                }
                return item;
            })
        }));
    }
    unmount(key) {
        this.setState(state => ({
            portals: state.portals.filter(item => item.key !== key)
        }));
    }
    render() {
        const { portals } = this.state;
        return portals.map(({ key, zIndex = 0, children }) => (<View key={key} collapsable={false} pointerEvents="box-none" style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex
            }}>
                {children}
            </View>));
    }
}
