import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import { isFunction } from '../common/utils';
export default class CircularProgress extends React.PureComponent {
    renderCircular() {
        const { fill, backgroundWidth = 0, width = 8, tintColor = '#FF9645', size, padding = 0, backgroundColor = '#fff' } = this.props;
        const circularBgSize = size - padding * 2;
        const circularSize = circularBgSize - Math.max(0, (backgroundWidth - width));
        const offset = padding + Math.max(0, (backgroundWidth - width) / 2);
        const circularBgStyle = {
            width: circularBgSize,
            height: circularBgSize,
            borderWidth: backgroundWidth,
            borderColor: backgroundColor,
            borderRadius: circularBgSize / 2
        };
        const halfCircularboxStyle = {
            width: circularSize / 2,
            height: circularSize,
            top: offset,
        };
        const circularStyle = {
            width: circularSize,
            height: circularSize,
            borderWidth: width,
            borderColor: tintColor,
            borderRadius: circularSize / 2,
            top: padding,
            left: padding
        };
        return (<>
                <View style={[styles.bg, circularBgStyle]}/>
                <View style={[
                styles.halfCircularbox,
                halfCircularboxStyle,
                styles.left,
                {
                    left: offset
                }
            ]}>
                    <View style={[
                circularStyle,
                styles.leftCircular,
                {
                    transform: [{
                            rotate: `${45 + (Math.min(100, Math.max(50, fill)) - 50) / 50 * 180}deg`
                        }]
                }
            ]}/>
                </View>
                <View style={[
                styles.halfCircularbox,
                halfCircularboxStyle,
                styles.right,
                {
                    right: offset
                }
            ]}>
                    <View style={[
                circularStyle,
                styles.rightCircular,
                {
                    transform: [{
                            rotate: `${45 + Math.min(50, Math.max(0, fill)) / 50 * 180}deg`
                        }]
                }
            ]}/>
                </View>
            </>);
    }
    render() {
        const { style, padding, containerStyle, children, fill, backgroundWidth, width, size } = this.props;
        const maxWidthCircle = backgroundWidth ? Math.max(width, backgroundWidth) : width;
        return (<View style={[
                {
                    width: size,
                    height: size,
                    padding: padding + maxWidthCircle
                },
                styles.circularbox,
                style
            ]}>
            {this.renderCircular()}
            {isFunction(children) ?
                <View style={containerStyle}>
                    {children(fill)}
                </View>
                :
                    null}
            </View>);
    }
}
const styles = StyleSheet.create({
    circularbox: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bg: {
        position: "absolute",
    },
    halfCircularbox: {
        flexDirection: 'row',
        position: 'absolute',
        zIndex: 2,
        overflow: 'hidden',
    },
    left: {
        justifyContent: 'flex-start',
    },
    right: {
        justifyContent: 'flex-end',
    },
    leftCircular: {
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    rightCircular: {
        borderRightColor: 'transparent',
        borderTopColor: 'transparent'
    }
});
CircularProgress.propTypes = {
    style: ViewPropTypes.style,
    size: PropTypes.number.isRequired,
    fill: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    backgroundWidth: PropTypes.number,
    tintColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    rotation: PropTypes.number,
    lineCap: PropTypes.string,
    arcSweepAngle: PropTypes.number,
    children: PropTypes.func,
    childrenContainerStyle: ViewPropTypes.style,
    padding: PropTypes.number,
    renderCap: PropTypes.func,
    dashedBackground: PropTypes.object
};
CircularProgress.defaultProps = {
    tintColor: '#FF9645',
    arcSweepAngle: 360,
    padding: 0,
    dashedBackground: { width: 0, gap: 0 }
};
