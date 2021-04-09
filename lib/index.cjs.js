const TDesign = {
    get Portal() { return require('./portal').default; },
    get PortalProvider() { return require('./portal/portalProvider').default; },
    get Toast() { return require('./toast').default; },
    get Popup() { return require('./popup').default; }
};
module.exports = TDesign;
