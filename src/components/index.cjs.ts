const TDesign = {
    get Portal() {
        return require('./portal').default;
    },
    get PortalProvider() {
        return require('./portal/portalProvider').default;
    },
    get Popup() {
        return require('./popup').default;
    },
    get Rating() {
        return require('./rating').default;
    },
    get CircularProgress() {
        return require('./circularProgress').default;
    },
    get Popover() {
        return require('./popover').default;
    },
    get Toast() {
        return require('./toast').default;
    },
    get Confirm() {
        return require('./confirm').default;
    },
    get Alert() {
        return require('./alert').default;
    },
    get Checkbox() {
        return require('./checkbox').default;
    },
    get Radio() {
        return require('./radio').default;
    },
    get Calendar() {
        return require('./calendar').default;
    },
    get Swiper() {
        return require('./swiper').default;
    },
    get Tabs() {
        return require('./tabs').default;
    },
    get Shadow() {
        return require('./shadow').default;
    }
}

module.exports = TDesign;

