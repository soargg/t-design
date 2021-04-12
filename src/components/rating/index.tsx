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
import type { ImageSourcePropType, StyleProp, ImageStyle } from 'react-native';
import { getArrayByLength, isFunction } from '../common/utils';
import { icon_rating_star, icon_rating_star_gray } from '../common/icons';

type RatingProps = {
    /**
     * value
     * 评分的值
     */
    value?: number;
    /**
     * size
     * 自定义星星的size， 默认{width: 12, height: 12}
     */
    size?: {
        width: number;
        height: number;
    };
    /**
     * gap
     * 星星之间的间隔
     */
    gap?: number;
    /**
     * source
     * 高亮的小星星
     * 与Image组件source的值一致
     */
    source?: ImageSourcePropType;
    /**
     * source
     * 底图，灰色小星星
     * 与Image组件source的值一致
     */
    graySource?: ImageSourcePropType;
    /**
     * total
     * 小星星的数量 默认 5个
     */
    total?: number;
    /**
     * readonly
     * 小星星是否只读
     * 默认 false，可点击触发 onChange事件
     */
    readonly?: boolean;
    /**
     * onChange
     * 点击小星星时触发当前的
     * @param value { number } 当前值
     */
    onChange?(value: number):void;
}

type RatingState = {
    star: number
}

export default class Rating extends React.PureComponent<RatingProps, RatingState> {
    static propTypes: any;
    static defaultProps: any;

    state: RatingState = {
        star: this.props.value || 0
    }

    static getDerivedStateFromProps(nextProps: RatingProps) {
        if ('value' in nextProps) {
            return {
                star: nextProps.value
            }
        }

        return null;
    }

    handleTap(star: number) {
        if (!('value' in this.props)) {
            this.setState({star});
        }
        
        if (isFunction(this.props.onChange)) {
            this.props.onChange(star);
        }
    }

    render() {
        const {
            total=5,
            size={width: 12, height: 12},
            gap=5,
            source=null,
            graySource=null,
            readonly=false
        } = this.props;

        const { star } = this.state;

        return (
            <View style={ styles.rating }>
                {
                    getArrayByLength(total).map((_, index) => {
                        const imgBgStyle: StyleProp<ImageStyle>[] = [size];
                        if (index > 0) {
                            // 间隔
                            imgBgStyle.push({marginLeft: gap});
                        }

                        let baseWidth = size.width;
                        if (star < index + 1) {
                            let rote = star - index;
                            if ( rote > 0 && rote < 1 ) {
                                baseWidth = baseWidth * rote
                            } else {
                                baseWidth = 0;
                            }
                        }

                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={readonly}
                                onPress={() => {
                                    this.handleTap(index + 1);
                                }}
                                key={index}
                            >
                                <ImageBackground
                                    resizeMode="cover"
                                    style={imgBgStyle}
                                    source={graySource || icon_rating_star_gray}
                                >
                                    <View style={{width: baseWidth, overflow: 'hidden'}}>
                                        <Image
                                            resizeMode="cover"
                                            style={ size }
                                            source={ source || icon_rating_star }
                                        />
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
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