const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware')
const log4js = require('log4js')
const path = require('path')

const logger = log4js.getLogger('idam')
logger.level = 'info'

class PUICreateIdamComponent {
    constructor(config) {
        this.config = config.idam
        this.config.routingPrefix = this.config.routingPrefix
    }

    installToExpress(expressApp) {
        logger.info('Adding Idam to express')

        expressApp.get('/oauth2/callback', idamExpressMiddleware.landingPage(this.config), this.index.bind(this)) //idam middleware redirects withinconfig
        // order of routes to strict
        expressApp.use(idamExpressMiddleware.authenticate(this.config)) // is there a valid token ?

        //expressApp.use(idamExpressMiddleware.protect(this.config)) // is this a valid token that matches the session
        expressApp.get(this.config.routingPrefix + '/logout', idamExpressMiddleware.logout(this.config)) //idam middleware redirects withinconfig
        expressApp.get(
            this.config.routingPrefix + '/userdetails',
            idamExpressMiddleware.userDetails(this.config), // idam middleware
            this.renderUserDetails.bind(this) //render user details page
        )
    }

    index(req, res) {
        console.log('triggerd')
        res.render(path.join(__dirname, '/index'))
    }

    isAuthenticated(req, res, next) {
        if (req) {
            // req.<something> depends what idam returns
            next()
        } else {
            //redirect to login
            const session = req.session
            session.redirectTo = req.originalUrl // save to redirect to page user was on eventually ?
            session.save(() => {
                res.redirect('/authenticate')
            })
        }
    }

    renderUserDetails(res) {
        // req.idam is populated
        res.render(path.join(__dirname, '/userDetails'))
    }
}

module.exports.PUICreateIdamComponent = PUICreateIdamComponent
