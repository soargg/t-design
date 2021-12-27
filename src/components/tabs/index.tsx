import * as React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Easing } from 'react-native';
import TabPane from './TabPane';
import { isString, isFunction } from '../common/utils';
import { screenWidth, LightFontWeight, THEME_COLOR } from '../common';
import { TabsContext } from './TabsContext';
import AnimateView from '../common/animation';

import type { LayoutRectangle, StyleProp, ViewStyle, TextStyle } from 'react-native';

type TabItem = string | ((active: boolean) => JSX.Element);

type TabOption = {
    tab: TabItem,
    tabkey: string | number;
    forceRender?: boolean;
    renderPane?(activeKey?: any): JSX.Element;
}

export type TabsProps = {
    activeKey?: string | number;
    tabLevel?: 1 | 2;
    style?: StyleProp<ViewStyle>;
    tabBarStyle?: StyleProp<ViewStyle>;
    tabStyle?: StyleProp<ViewStyle>;
    transparent?: boolean;
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | undefined;
    defaultActiveKey?: string | number;
    scrollable?: boolean;
    options?: TabOption [];
    onChange?(tabkey: string | number, index?: number): void;
}

type TabsState = {
    activekey: string | number;
}

export default class Tabs extends React.PureComponent<TabsProps, TabsState>{
    static get displayName() { return 'Tabs' };
    static get TabPane() {
        return TabPane
    };

    state: TabsState = {
        activekey: this.props.activeKey || this.props.defaultActiveKey || null,
    }

    private hasInit: boolean = false;

    private itemLayout: {[key: string]: LayoutRectangle} = {};

    private scroller: ScrollView = null;

    private currentIndex: number = 0; 

    static getDerivedStateFromProps(nextProps: TabsProps) {
        if ('activeKey' in nextProps) {
            return {
                activekey: nextProps.activeKey
            }
        }
        return null;
    }

    componentDidMount() {
        this.toggleTabs(this.props.defaultActiveKey || this.props.activeKey);
        this.hasInit = true;
    }

    componentDidUpdate(_: TabsProps, prevState: TabsState) {
        const {scrollable = false} = this.props;

        // 滚动到中心位置
        if (scrollable && prevState.activekey !== this.state.activekey) {
            this.moveItemTo()
        }
    }

    toggleTabs(tabkey: string | number) {
        if (!('activeKey' in this.props)) {
            this.setState({
                activekey: tabkey
            });
        }

        if (this.state.activekey !== tabkey && this.hasInit) {
            if (isFunction(this.props.onChange)) {
                this.props.onChange(tabkey, this.currentIndex);
            }
        }
    }
    // 居中滚动
    private moveItemTo() {
        if (!this.state.activekey) return;

        const key: string = `${this.state.activekey}_${this.currentIndex}`;
        const layout = this.itemLayout[key];

        if (this.scroller && layout) {
            const helfscreenWidth = screenWidth / 2;
            // 超出了屏幕的一半
            if (layout.x > helfscreenWidth) {
                const offsetX = layout.x + layout.width / 2 - helfscreenWidth;
				this.scroller.scrollTo({ x: offsetX, y: 0, animated: true });
			} else {
				this.scroller.scrollTo({ x: 0, y: 0, animated: true });
			}
        }
    }

    private _renderUnderLine(): JSX.Element {
        return (
            <AnimateView
                active
                animationType='scale'
                easing={Easing.bounce}
                style={[{backgroundColor: THEME_COLOR}, styles.underLine]}
            />
        );

        // return (
        //     <AnimateView easing={Easing.bounce} active animationType='scale'>
        //         <LinearGradient
        //             style={styles.underLine}
        //             colors={['#FFC776', TUJIA_THEME_COLOR]}
        //             start={{x: 0.0, y: 0.0}}
        //             end={{x: 1, y: 0.0}}
        //         />
        //     </AnimateView>
        // );
    }

    // 渲染每个Item
    private _renderTabItem(option: TabOption, index: number) {
        const { activekey } = this.state;
        const { tabStyle, tabLevel = 1, transparent=false } = this.props;

        const { tab, tabkey } = option;
        const isActive = tabkey === activekey;
        const key = `${tabkey}_${index}`;

        if (isActive) {
            this.currentIndex = index;
        }
        // 一级tab
        const textStyle: StyleProp<TextStyle> = isActive ? [styles.itemTxt, styles.itemTxtactive] : [styles.itemTxt];
        transparent ? textStyle.push({color: '#FFFFFF'}) : null;
        
        let tabItemView = (
            <View style={[styles.tabItem, styles.tabItemMain, tabStyle]}>
                <Text style={textStyle}>{ tab as string }</Text>
                {
                    isActive ? <View style={styles.avitveTipWrap}>{ this._renderUnderLine() }</View> : null
                }
            </View>
        );

        if (tabLevel === 2) {
            const itemViewColor = isActive ? '#FFEFE5' : '#F4F6F9';
            tabItemView = (
                <View
                    style={[
                        styles.tabItem,
                        styles.tabItemMinor,
                        { marginLeft: index !== 0 ? 8 : 0, backgroundColor: itemViewColor },
                        tabStyle
                    ]}
                >
                    <Text style={isActive ? [styles.itemTxt, {fontWeight: 'bold', color: THEME_COLOR}] : [styles.itemTxt]}>{ tab as string }</Text>
                </View>
            );
        }
        // 

        return (
            <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                onLayout={e => {
                    this.itemLayout[key] = e.nativeEvent.layout
                }}
                onPress={() => {
                    this.currentIndex = index;
                    this.toggleTabs(tabkey);
                }}
            >
                {
                    isFunction(tab) // 是方法的话就是自定
                    ?
                    (tab as (active: boolean) => JSX.Element)(isActive)
                    :
                    ( isString(tab) ? tabItemView : null )
                }
            </TouchableOpacity>
        );
    }

    private _renderPanes() {
        const { children, scrollable=false, style, tabBarStyle, options, justify, tabLevel=1, transparent = false } = this.props;
        let tabs: JSX.Element[] = [];
        const tabPanes: Array<JSX.Element> = [];

        // 传入选项，
        if (Array.isArray(options)) {
            tabs = options.map((item, idx) => {
                const {tabkey, forceRender=false, renderPane} = item;

                if (isFunction(renderPane)) {
                    tabPanes.push(
                        <TabPane {...{tabkey, forceRender, key: `${tabkey}_${idx}`}}>
                            { renderPane(tabkey) }
                        </TabPane>
                    );
                }

                return this._renderTabItem(item, idx);
            });
        } else {
            // TabPane方式
            React.Children.forEach(children, (item: any, idx) => {
                if (item.props && item.props.tab) {
                    const { tab, tabkey } = item.props;
                    tabs.push(this._renderTabItem({
                        tab,
                        tabkey
                    }, idx));
                }
            });
        }

        return (
            <View style={[style]}>
                {
                    scrollable ?
                    <ScrollView
                        ref={s => { this.scroller = s }}
                        horizontal
                        bounces
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        scrollsToTop={false}
                        automaticallyAdjustContentInsets={false}
                        onLayout={() => {
                            requestAnimationFrame(() => {
                                this.moveItemTo();
                            });
                        }}
                        contentContainerStyle={[
                            styles.tabBar,
                            {
                                paddingHorizontal: tabLevel === 2 ? 16 : 5,
                                backgroundColor: transparent ? 'transparent' : '#FFFFFF'
                            },
                            tabBarStyle
                        ]}
                    >
                        { tabs }
                    </ScrollView>
                    :
                    <View style={[styles.tabBar, {justifyContent: justify, backgroundColor: transparent ? 'transparent' : '#FFFFFF'}, tabBarStyle]}>{ tabs }</View>
                }
                {
                    tabPanes.length > 0 ? tabPanes : children
                }
            </View>
        );
    }

    render() {
        return (
            <TabsContext.Provider value={{
                activeKey: this.state.activekey
            }}>
            {
                this._renderPanes()
            }
            </TabsContext.Provider>
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        height: 44,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        flexGrow: 0
    },
    tabItemMain: {
        height: '100%',
        paddingHorizontal: 15,
        position: 'relative',
    },
    tabItemMinor: {
        height: 32,
        paddingHorizontal: 10,
        borderRadius: 4
    },
    itemTxt: {
        fontSize: 14,
        letterSpacing: 0,
        lineHeight: 18,
        color: '#666666',
        fontWeight: LightFontWeight
    },
    itemTxtactive: {
        color: '#333333',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: 'bold'
    },
    avitveTipWrap: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    underLine: {
        height: 4,
        marginBottom: 5,
        width: 15,
        borderRadius: 4
    }
});

