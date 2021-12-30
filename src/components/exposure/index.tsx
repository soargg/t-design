/**
 *
 * {\__/}
 * ( •-•)
 * /つ 曝光View组件
 * create by zhuhuai
 * create date: 2021-06-02
 */

import React from 'react';
import { throttle } from '../common/utils';
import ExposureContext from './exposureContext';
import ExposureCard from './exposureCard';
import { ExposureConsumer } from './exposureConsumer';

export default class Exposure extends React.PureComponent {
    static get displayName() {
        return 'Exposure'
    };

    static ExposureCard = ExposureCard;

    private throttle: any;

    private cards: ExposureConsumer[] = [];

    constructor(props: any) {
        super(props);

        if (!this.throttle) {
            this.throttle = throttle(() => {
                this.release();
            }, 100);
        }
    }

    componentWillUnmount() {
        this.throttle.cancel && this.throttle.cancel();
        this.throttle = null;
    }

    trigger() {
        this.throttle();
    }

    // 触发
    private release() {
        this.cards.forEach(card => {
            card.emit()
        });
    }

    // 收集
    private register(exp: ExposureConsumer) {
        this.cards.push(exp);
    }

    private logoff(exp: ExposureConsumer) {
        this.cards = [...this.cards.filter(i => i !== exp)];
    }

    render() {
        return (
            <ExposureContext.Provider
                value={{
                    register: this.register.bind(this),
                    logoff: this.logoff.bind(this)
                }}
            >
                { this.props.children }
            </ExposureContext.Provider>
        )
    }
}