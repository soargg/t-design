/*
 *   {\__/}
 *   ( •-•)
 *   /つ 轮播 Swiper
 * @author liyeg
 * @date 20210527
 */
import PropTypes from 'prop-types'
import { Swiper } from './swiper';

Swiper.propTypes = {
    horizontal: PropTypes.bool,
    children: PropTypes.node.isRequired,
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array
    ]),
    scrollViewStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    showsHorizontalScrollIndicator: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    bounces: PropTypes.bool,
    scrollsToTop: PropTypes.bool,
    removeClippedSubviews: PropTypes.bool,
    automaticallyAdjustContentInsets: PropTypes.bool,
    showDots: PropTypes.bool,
    dots: PropTypes.func,
    showsButtons: PropTypes.bool,
    prevButton: PropTypes.bool,
    nextButton: PropTypes.bool,
    disableNextButton: PropTypes.bool,
    disablePrevButton: PropTypes.bool,
    loadMinimal: PropTypes.bool,
    loadMinimalSize: PropTypes.number,
    loadMinimalLoader: PropTypes.element,
    loop: PropTypes.bool,
    autoplay: PropTypes.bool,
    autoplayDuring: PropTypes.number,
    autoplayDirection: PropTypes.bool,
    index: PropTypes.number,
    renderPagination: PropTypes.func,
    dotStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array
    ]),
    activeDotStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array
    ]),
    dotColor: PropTypes.string,
    activeDotColor: PropTypes.string,
    onChange: PropTypes.func
}

Swiper.defaultProps = {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    showDots: true,
    showsButtons: false,
    prevButton: true,
    nextButton: true,
    disableNextButton: false,
    disablePrevButton: false,
    loop: true,
    loadMinimal: false,
    loadMinimalSize: 1,
    autoplay: false,
    autoplayDuring: 3,
    autoplayDirection: true,
    index: 0,
    onChange: () => {}
}

export default Swiper;