/**
 * @component Rating
 * @description 评分
 *  - 点击选择评分
 *  - 自定义分值
 * @date 2020/06/28
 * @author liyeg
 *  */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { getArrayByLength, isFunction } from '../common/utils';
import { icon_rating_star, icon_rating_star_gray } from '../common/icons';
export default class Rating extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            star: this.props.value || 0
        };
    }
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                star: nextProps.value
            };
        }
        return null;
    }
    handleTap(star) {
        if (!('value' in this.props)) {
            this.setState({ star });
        }
        if (isFunction(this.props.onChange)) {
            this.props.onChange(star);
        }
    }
    render() {
        const { total = 5, size = { width: 12, height: 12 }, gap = 5, source = null, graySource = null, readonly = false } = this.props;
        const { star } = this.state;
        return (<View style={styles.rating}>
                {getArrayByLength(total).map((_, index) => {
                const imgBgStyle = [size];
                if (index > 0) {
                    // 间隔
                    imgBgStyle.push({ marginLeft: gap });
                }
                let baseWidth = size.width;
                if (star < index + 1) {
                    let rote = star - index;
                    if (rote > 0 && rote < 1) {
                        baseWidth = baseWidth * rote;
                    }
                    else {
                        baseWidth = 0;
                    }
                }
                return (<TouchableOpacity activeOpacity={0.8} disabled={readonly} onPress={() => {
                        this.handleTap(index + 1);
                    }} key={index}>
                                <ImageBackground resizeMode="cover" style={imgBgStyle} source={graySource || icon_rating_star_gray}>
                                    <View style={{ width: baseWidth, overflow: 'hidden' }}>
                                        <Image resizeMode="cover" style={size} source={source || icon_rating_star}/>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>);
            })}
            </View>);
    }
}
const styles = StyleSheet.create({
    rating: {
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        flexGrow: 0,
        flexShrink: 0
    }
});
Rating.propTypes = {
    value: PropTypes.number,
    size: PropTypes.shape({
        width: PropTypes.number,
        heigth: PropTypes.number
    }),
    gap: PropTypes.number,
    total: PropTypes.number,
    readonly: PropTypes.bool,
    onChange: PropTypes.func
};
Rating.defaultProps = {
    gap: 5,
    total: 5,
    readonly: false
};
