const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware')
const path = require('path')

class PUICreateIdamComponent {
    constructor(config) {
        this.config = config
        this.config.routingPrefix = this.config.routingPrefix
    }

    installToExpress(expressApp) {
        expressApp.use(idamExpressMiddleware.landingPage(this.config)) //store jwt token (if any)
        expressApp.use(idamExpressMiddleware.authenticate(this.config)) // is there a valid token ?
        expressApp.use(idamExpressMiddleware.protect(this.config)) // is this a valid token that matches the session
        expressApp.get(this.config.routingPrefix + '/logout', idamExpressMiddleware.logout(this.config)) //idam middleware redirects withinconfig
        expressApp.get(
            this.config.routingPrefix + '/userdetails',
            idamExpressMiddleware.userDetails(this.config), // idam middleware
            this.renderUserDetails.bind(this) //render user details page
        )
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
