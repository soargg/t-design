const TDesign = {
    get Portal() { return require('./portal').default },
    get PortalProvider() { return require('./portal/portalProvider').default }
}

module.exports = TDesign;