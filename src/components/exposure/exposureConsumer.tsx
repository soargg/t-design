import React, { Component } from 'react';
import { View, Dimensions, UIManager, findNodeHandle } from 'react-native';
import { isFunction } from '../common/utils';
import { windowHeight, windowWidth, isAndroid } from '../common';
import { ExposureMethods } from './exposureContext';

import type { StyleProp, ViewStyle } from 'react-native';

export type ExposureCardProps = {
    children?: JSX.Element; //子元素
    style?: StyleProp<ViewStyle>;
    isLayoutexposure?: boolean; //是否绘制完成就曝光
    referTraceId?: string;
    offsetTail?: number;
    isWholeView?: boolean;
    onAppear?(referTraceId: string): void; //曝光回调执行函数
}

type ExposureConsumerProps = ExposureCardProps & {
    manager: ExposureMethods;
}

export class ExposureConsumer extends Component<ExposureConsumerProps> {
    private windowHeight = windowHeight;
    private windowWidth = windowWidth;

    private viewRef: View
    private isAppeared: boolean = this.props.isLayoutexposure;

    constructor(props: ExposureConsumerProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
        // 挂载
        this.mount();
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.onChange);
    }

    componentWillUnmount() {
        // 移除
        this.unmount()
        Dimensions.removeEventListener('change', this.onChange);
    }

    componentDidUpdate(prevProps: ExposureConsumerProps) {
        const { referTraceId } = prevProps;

        if (referTraceId !== this.props.referTraceId) {
            this.isAppeared = false;
            this.unmount();
            this.mount();
        }
    }

    emit() {
        this.appearHandle();
    }

    private mount() {
        if (this.props.manager && this.props.manager.register) {
            this.props.manager.register(this);
        }
    }

    private unmount() {
        if (this.props.manager && this.props.manager.logoff) {
            this.props.manager.logoff(this);
        }
    }

    private appearHandle() {
        if (this.isAppeared) return;
        this.measure().then((dim) => {
            const { x, y, width, height } = dim;
            const { offsetTail=0, isWholeView=false } = this.props;
            // 出现就曝光
            let canExposure = y >= 0 && y < this.windowHeight - offsetTail && x >= 0 && x < this.windowWidth - offsetTail;
            // 整个出来才曝光
            if (isWholeView) {
                canExposure = (y < this.windowHeight - height - offsetTail) && (x >= 0 && x < this.windowWidth - width - offsetTail);
            }

            if (canExposure) {
                // 已经曝光过
                this.isAppeared = true;
                const { referTraceId, onAppear } = this.props;
                if (isFunction(onAppear)) {
                    onAppear(referTraceId);
                }
                // 曝光完了，就移除
                this.unmount();
            }
        }).catch(() => {
            // console.log(err)
        })
    }

    private layoutAppear() {
        const { referTraceId, onAppear } = this.props;
        if (isFunction(onAppear)) {
            onAppear(referTraceId);
        }
        // 曝光完了，就移除
        this.unmount();
    }

    private onChange() {
        const { width, height } = Dimensions.get('window');
        this.windowWidth = width;
        this.windowHeight = height;
    }

    private measure(): Promise<{ x: number, y: number, width: number, height: number }> {
        return new Promise((resolve) => {
            if (this.viewRef) {
                // 获取元素位置兼容写法
                if (isAndroid) {
                    const viewNode = findNodeHandle(this.viewRef);
                    UIManager.measure(viewNode, (_, __, itemWidth, itemHeight, pageX, pageY) => {
                        resolve({ x: pageX, y: pageY, width: itemWidth, height: itemHeight });
                    });
                } else {
                    this.viewRef.measureInWindow((x, y, width, height) => {
                        resolve({ x, y, width, height });
                    });
                }
            }
        });
    }

    render() {
        const { children, style, isLayoutexposure } = this.props;
        return (
            <View
                ref={(ref) => { this.viewRef = ref }}
                style={[{ backgroundColor: 'transparent' }, style]}
                onLayout={() => {
                    // 渲染到就算曝光
                    if (isLayoutexposure) {
                        this.layoutAppear()
                    } else {
                        // 计算位置曝光
                        this.appearHandle();
                    }
                }}
            >{children}</View>
        )
    }
}