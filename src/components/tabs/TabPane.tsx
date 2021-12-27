import * as React from 'react';
import { View } from 'react-native';
import { TabsContext, TabsContextType } from './TabsContext';

export type TabItemType = ((active: boolean) => React.ReactNode) | string;

type TabPaneProps = {
    tabkey: string | number;
    children?: React.ReactNode,
    tab?: TabItemType;
    forceRender?: boolean;
}

export default class TabPane extends React.PureComponent<TabPaneProps, {}> {
    static get displayName() { return 'TabPane' };
    static get TRN_TABPANE() { return true };

    static contextType = TabsContext;

    static defaultProps: TabPaneProps = {
        tabkey: null,
        children: null,
    }

    context: TabsContextType;

    componentDidMount() {
        if (!this.context) {
            throw new Error('Looks like you forgot to wrap your TabPane component with `Tabs` component from cqtmRNcomponents');
        }
    }

    render() {
        const { children=null, tabkey, forceRender } = this.props;
        const show = this.context?.activeKey === tabkey;
        // 渲染DOM结构
        if (forceRender) {
            return (
                <View
                    style={{
                        flex: 1,
                        display: show ? 'flex' : 'none',
                        position: 'relative'
                    }}
                    collapsable={false}
                >
                    { children }
                </View>
            );
        }

        if (show) {
            return children;
        } else {
            return null;
        }
    }
}