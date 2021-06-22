/*
 *   {\__/}
 *   ( •-•)
 *   /つ 轮播 Carousel
 * @author liyeg
 * @date 20210608
 */
import PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';
import Carousel, { AnimatedFlatList } from './carousel';
Carousel.propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    sliderWidth: PropTypes.number,
    sliderHeight: PropTypes.number,
    activeAnimationType: PropTypes.string,
    activeAnimationOptions: PropTypes.object,
    activeSlideAlignment: PropTypes.oneOf(['center', 'end', 'start']),
    apparitionDelay: PropTypes.number,
    autoplay: PropTypes.bool,
    autoplayDelay: PropTypes.number,
    autoplayInterval: PropTypes.number,
    callbackOffsetMargin: PropTypes.number,
    containerCustomStyle: ViewPropTypes.style,
    contentContainerCustomStyle: ViewPropTypes.style,
    enableMomentum: PropTypes.bool,
    enableSnap: PropTypes.bool,
    defaultIndex: PropTypes.number,
    hasParallaxImages: PropTypes.bool,
    inactiveSlideOpacity: PropTypes.number,
    inactiveSlideScale: PropTypes.number,
    inactiveSlideShift: PropTypes.number,
    layout: PropTypes.oneOf(['linear', 'default', 'stack', 'tinder']),
    layoutCardOffset: PropTypes.number,
    lockScrollTimeoutDuration: PropTypes.number,
    lockScrollWhileSnapping: PropTypes.bool,
    loop: PropTypes.bool,
    loopClonesPerSide: PropTypes.number,
    scrollEnabled: PropTypes.bool,
    scrollInterpolator: PropTypes.func,
    slideInterpolatedStyle: PropTypes.func,
    slideStyle: ViewPropTypes.style,
    shouldOptimizeUpdates: PropTypes.bool,
    swipeThreshold: PropTypes.number,
    useScrollView: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    vertical: PropTypes.bool,
    onBeforeSnapToItem: PropTypes.func,
    onSnapToItem: PropTypes.func
};
Carousel.defaultProps = {
    activeAnimationType: 'timing',
    activeAnimationOptions: null,
    activeSlideAlignment: 'center',
    apparitionDelay: 0,
    autoplay: false,
    autoplayDelay: 1000,
    autoplayInterval: 3000,
    callbackOffsetMargin: 5,
    containerCustomStyle: null,
    contentContainerCustomStyle: null,
    enableMomentum: false,
    enableSnap: true,
    defaultIndex: 0,
    hasParallaxImages: false,
    inactiveSlideOpacity: 0.7,
    inactiveSlideScale: 0.9,
    inactiveSlideShift: 0,
    layout: 'linear',
    lockScrollTimeoutDuration: 1000,
    lockScrollWhileSnapping: false,
    loop: false,
    loopClonesPerSide: 3,
    scrollEnabled: true,
    slideStyle: null,
    shouldOptimizeUpdates: true,
    swipeThreshold: 20,
    useScrollView: !AnimatedFlatList,
    vertical: false
};
export default Carousel;
