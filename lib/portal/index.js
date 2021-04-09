/**
 * @component Portal
 * @description 渲染到顶层结构的入口组件
 *  1、在项目的根节点，一定使用 PortalProvider 组件嵌套
 *  2、Toast Popover Popup Alert Confirm ... 会依赖该组件提供的环境
 * @author liyeg
 *  */
import React from 'react';
import PortalContext from './portalContext';
import { PortalConsumer } from './portalConsumer';
import PortalProvider from './portalProvider';
export default class Portal extends React.PureComponent {
    static get displayName() { return 'Portal'; }
    ;
    render() {
        const { zIndex } = this.props;
        return (<PortalContext.Consumer>
            {manager => (<PortalConsumer {...{ zIndex, manager }}>
                        {this.props.children}
                    </PortalConsumer>)}
            </PortalContext.Consumer>);
    }
}
Portal.Provider = PortalProvider;
