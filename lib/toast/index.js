/**
 * @component Toast
 * @description 提示
 * @author liyeg
 */
import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { screenWidth } from '../common';
import Portal from '../portal/portalProvider';
import AnimationView from '../common/animation';
import { icon_toast_success, icon_toast_fail, icon_toast_loading } from '../common/icons';
class ToastView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            show: true
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ show: false });
        }, this.props.during - 250);
    }
    componentWillUnmount() {
        this.setState = () => null;
    }
    render() {
        const { children, onFinish } = this.props;
        return (<AnimationView animationType="fadeInOut" active={this.state.show} onFinish={() => {
                if (onFinish) {
                    onFinish();
                }
            }}>
                {React.Children.only(children)}
            </AnimationView>);
    }
}
class ToastConstructor {
    get displayName() { return 'Toast'; }
    createToast(toast, during = 3000) {
        const key = Portal.mount(<ToastView during={during < 2000 ? 2000 : during} onFinish={() => {
                Portal.unmount(key);
            }}>
                {toast}
            </ToastView>, 10000);
    }
    iconToast(txt, during, type) {
        // require 不可使用变量路径作为参数
        let icon = null;
        if (type === 'success') {
            icon = icon_toast_success;
        }
        else if (type === 'fail') {
            icon = icon_toast_fail;
        }
        else if (type === 'loading') {
            icon = icon_toast_loading;
        }
        const Img = (<Image source={icon} resizeMode="cover" style={styles.icon}/>);
        const toast = (<View style={[styles.wrap, styles.iconToast]}>
                {type === 'loading' ?
                <AnimationView animationType="rotate" active during={1500} loop>
                    {Img}
                    </AnimationView>
                :
                    Img}
                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.font, styles.iconFont]}>{txt}</Text>
            </View>);
        this.createToast(toast, during);
    }
    info(txt, during) {
        const toast = (<View style={[styles.wrap, styles.txtToast]}>
                <Text style={styles.font}>{txt}</Text>
            </View>);
        this.createToast(toast, during);
    }
    success(txt, during) {
        this.iconToast(txt, during, 'success');
    }
    fail(txt, during) {
        this.iconToast(txt, during, 'fail');
    }
    loading(txt, during) {
        this.iconToast(txt, during, 'loading');
    }
}
export default new ToastConstructor();
const txtToastWidth = screenWidth * 542 / 750;
const styles = StyleSheet.create({
    wrap: {
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'rgba(17, 17, 17, 0.7)'
    },
    txtToast: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 15,
        paddingRight: 15,
        maxWidth: txtToastWidth
    },
    iconToast: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 106,
        width: 106,
        paddingLeft: 15,
        paddingRight: 15
    },
    font: {
        fontSize: 14,
        lineHeight: 21,
        color: '#fff',
        textAlign: 'center'
    },
    icon: {
        height: 42,
        width: 42
    },
    iconFont: {
        marginTop: 10
    }
});
