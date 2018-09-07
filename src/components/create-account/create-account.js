const path = require('path')
const should = require('should') // eslint-disable-line

/*
    PUICreateAccountComponent config (passed in constructor):
        config.routingPrefix
            if it's "/create-account", then all internal component's links
            will be in the form of "/create-account/xxxx/yyyy"
*/

class PUICreateAccountComponent {
    constructor (config) {
        // TODO: some good dev-level checks for config validation needed below
        config.should.have.property('routingPrefix').which.is.a.String()
        config.routingPrefix.length.should.be.above(1)

        this.config = config
        this.config.routingPrefix = this.config.routingPrefix
    }

    installToExpress (expressApp) {
        expressApp.get(this.config.routingPrefix, this.routeCreateAccount.bind(this))
        expressApp.get(this.config.routingPrefix + '/organisation-name', this.routeOrganisationName.bind(this))
        expressApp.get(this.config.routingPrefix + '/check-organisation', this.routeCheckOrganisationName.bind(this))
    }

    routeCreateAccount (req, res) {
        let nunjucksVariables = {
            link:
            {
                nextPage: this.config.routingPrefix + '/organisation-name'
            }
        }
        res.render(path.join(__dirname, '/index'), nunjucksVariables)
    }

    routeOrganisationName (req, res) {
        let nunjucksVariables = {
            link:
            {
                prevPage: this.config.routingPrefix,
                nextPage: this.config.routingPrefix + '/check-organisation'
            }
        }
        res.render(path.join(__dirname, '/organisation-name'), nunjucksVariables)
    }

    routeCheckOrganisationName (req, res) {
        let nunjucksVariables = {
            link:
            {
                //prevPage: this.config.routingPrefix,
                //nextPage: this.config.routingPrefix + '/check-organisation'
            }
        }
        res.render(path.join(__dirname, '/check-organisation'), nunjucksVariables)
    }
}

module.exports.PUICreateAccountComponent = PUICreateAccountComponent
