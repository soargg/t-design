import React from 'react';
import { View, StyleSheet } from 'react-native';

type PortalModel = {
    key: number;
    children: React.ReactNode;
    zIndex?: number;
}

type ManagerState = {
    portals: Array<PortalModel>
}

export class PortalManager extends React.PureComponent<{}, ManagerState> {
    state: ManagerState = {
        portals: []
    };

    // 挂载
    mount(portal: PortalModel) {
        this.setState(state => ({
            portals: [...state.portals, portal]
        }));
    }

    // 更新
    update(key: number, children: React.ReactNode) {
        this.setState(state => ({
            portals: state.portals.map(item => {
                if (item.key === key) {
                    return { ...item, children };
                }
                return item;
            })
        }));
    }

    unmount(key: number) {
        this.setState(state => ({
            portals: state.portals.filter(item => item.key !== key)
        }));
    } 
    
    render() {
        const { portals } = this.state;
        return portals.map(({ key, zIndex = 0, children }) => (
            <View
                key={key}
                collapsable={false}
                pointerEvents="box-none"
                style={{
                    ...StyleSheet.absoluteFillObject,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex
                }}
            >
                { children }
            </View>
        ));
    }
}