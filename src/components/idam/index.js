const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware')
const log4js = require('log4js')
const path = require('path')
const conditional = require('express-conditional-middleware')
const logger = log4js.getLogger('idam')
logger.level = 'info'

class PUICreateIdamComponent {
    constructor(config) {
        this.config = config.idam
        this.config.routingPrefix = config.routingPrefix
        this.config.insecure = config.insecure
    }

    installToExpress(expressApp) {
        logger.info('Adding Idam to express')
        // order of routes to strict this has to come before autheticate else there will be a bounce back to auth without issuing the token
        expressApp.get('/oauth2/callback', idamExpressMiddleware.landingPage(this.config), this.redirectUrl.bind(this)) //idam middleware redirects withinconfig

        expressApp.use(
            this.storeUrl.bind(this),
            conditional(this.secureRoute.bind(this), idamExpressMiddleware.authenticate(this.config))
        ) // is there a valid token ?
        //expressApp.use(idamExpressMiddleware.protect(this.config)) // is this a valid token that matches the session
        expressApp.get(
            this.config.routingPrefix + '/logout',
            idamExpressMiddleware.logout(this.config),
            this.logout.bind(this)
        ) //idam middleware redirects withinconfig

        expressApp.get(
            this.config.routingPrefix + '/userdetails',
            idamExpressMiddleware.userDetails(this.config), // idam middleware
            this.renderUserDetails.bind(this) //render user details page
        )
    }

    index(req, res) {
        res.render(path.join(__dirname, '/index'))
    }

    logout(req, res) {
        let redirect = this.config.indexUrl ? this.config.indexUrl : '/'
        res.redirect(redirect)
    }

    secureRoute(req, res, next) {
        let path = req.path
        return !(this.config.insecure.indexOf(path) >= 0)
    }

    storeUrl(req, res, next) {
        const session = req.session
        session.url = req.path
        next()
    }

    redirectUrl(req, res, next) {
        const session = req.session
        if (!session.url) {
            this.redirectUrl.bind(this)
        } else {
            if (req.path !== session.url) res.redirect(session.url)
        }
    }

    renderUserDetails(req, res) {
        // req.idam is populated
        res.json(req.idam)
    }

    isAuthorised(req, res) {
        console.log(res.cookies)
        if (req.idam) {
            return true
        } else {
            return false
        }
    }
}

module.exports.PUICreateIdamComponent = PUICreateIdamComponent
