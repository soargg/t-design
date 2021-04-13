const TDesign = {
    get Portal() { return require('./portal').default; },
    get PortalProvider() { return require('./portal/portalProvider').default; },
    get Popup() { return require('./popup').default; },
    get Rating() { return require('./rating').default; },
    get CircularProgress() { return require('./circularProgress').default; },
    get Popover() { return require('./popover').default; },
    get Toast() { return require('./toast').default; },
    get Confirm() { return require('./confirm').default; },
    get Alert() { return require('./alert').default; }
};
module.exports = TDesign;
