const path = require('path')
const should = require('should') // eslint-disable-line

class SessionTempDataStore {
    constructor(req) {
        this.expressReq = req
    }

    get(key, defaultValue) {
        let rv = defaultValue
        if (typeof this.expressReq.session[key] !== 'undefined') {
            rv = this.expressReq.session[key]
        }
        return rv
    }

    set(key, value) {
        this.expressReq.session[key] = value
    }
}

class AbstractComponentState {
    constructor(req, res, next, config) {
        this.req = req
        this.res = res
        this.next = next
        this.config = config
    }

    fetchFormInputsStore() {
        this.formInputsStore = new SessionTempDataStore(this.req)
    }

    importFormData() {
        this.fetchFormInputsStore()

        let createAccountTempData = this.formInputsStore.get('createAccount', {})
        console.log('createAccountTempData:', createAccountTempData)

        let formDefaultData = {
            name: 'xx'
        }
        this.formData = Object.assign({}, formDefaultData, createAccountTempData)
        console.log('formData is', this.formData)
    }

    processDataSubmit() {
        console.log('AbstractComponentState::processInputs() should be overriden')
    }
}

class RenderSimpleViewState extends AbstractComponentState {
    processDataSubmit() {}

    convertMetaRoutesToPlainRoutes(linksIn) {
        let rv = {}
        for (let key in linksIn)
        {
            rv[key] = this.config.component.convertMetaRouteToRoute(linksIn[key])
        }
        return rv
    }

    prepareNunjucksVariables() {
        let nunjucksVariables = {}
        if (this.config.stateMeta.nunjucks) {
            nunjucksVariables.link = this.convertMetaRoutesToPlainRoutes(this.config.stateMeta.nunjucks.link)
        }
        return nunjucksVariables
    }

    render() {
        this.res.render(this.config.stateMeta.nunjucks.renderFile, this.prepareNunjucksVariables())
    }
}

class YourName extends RenderSimpleViewState {
    processDataSubmit() {
        console.log('processDataSubmit')
        this.importFormData()

        let formAccepted = false

        if (typeof this.req.query.name === 'string') {
            // we are happy with the form data
            let createAccountTempData = this.formInputsStore.get('createAccount', {})
            createAccountTempData.name = this.req.query.name
            this.formInputsStore.set('createAccount', createAccountTempData)
            console.log('STORING', createAccountTempData)

            if (createAccountTempData.name.length > 1) {
                formAccepted = true
            }
        }

        if (formAccepted) {
            this.next()
        } else {
            console.log('ERROR in form data')
            this.renderState()
        }
    }

    render() {
        this.importFormData()
        let nunjucksVariables = this.prepareNunjucksVariables()
        nunjucksVariables.formData = this.formData
        this.res.render(path.join(__dirname, '/name'), nunjucksVariables)
    }
}

class ConfirmationState extends RenderSimpleViewState {
    render() {
        this.importFormData()
        let nunjucksVariables = this.prepareNunjucksVariables()
        nunjucksVariables.link = {
            createCasePage: this.config.componentConfig.linkToCreateCasePage,
            manageCasePage: this.config.componentConfig.linkToManageCasePage
        }
        this.res.render(path.join(__dirname, '/confirmation'), nunjucksVariables)
    }
}

const PUICreateAccountComponentDefaultConfig = {
    states: {
        'home': {
            HandlerClass: RenderSimpleViewState,
            nunjucks: {
                renderFile: path.join(__dirname, '/index'),
                link: {
                    nextPage: '$/organisation-name'
                }
            }
        },
        'organisation-name': {
            HandlerClass: RenderSimpleViewState,
            nunjucks: {
                renderFile: path.join(__dirname, '/organisation-name'),
                link: {
                    prevPage: '$',
                    nextPage: '$/check-organisation'
                }
            }
        },
        'check-organisation': {
            HandlerClass: RenderSimpleViewState,
            nunjucks: {
                renderFile: path.join(__dirname, '/check-organisation'),
                link: {
                    prevPage: '$/organisation-name',
                    nextPage: '$/name'
                }
            }
        },
        'name': {
            HandlerClass: YourName,
            nunjucks: {
                link: {
                    prevPage: '$/check-organisation',
                    nextPage: '$/email'
                }
            }
        },
        'email': {
            HandlerClass: RenderSimpleViewState,
            nunjucks: {
                renderFile: path.join(__dirname, '/email'),
                link: {
                    prevPage: '$/name',
                    nextPage: '$/password'
                }
            }
        },
        'password': {
            HandlerClass: RenderSimpleViewState,
            nunjucks: {
                renderFile: path.join(__dirname, '/password'),
                link: {
                    prevPage: '$/email',
                    nextPage: '$/check'
                }
            }
        },
        'check': {
            HandlerClass: RenderSimpleViewState,
            nunjucks: {
                renderFile: path.join(__dirname, '/check'),
                link: {
                    nextPage: '$/confirmation'
                }
            }
        },
        'confirmation': {
            HandlerClass: ConfirmationState
        }
    }
}

/*
    PUICreateAccountComponent config (passed in constructor):
        config.routingPrefix
            if it's "/create-account", then all internal component's links
            will be in the form of "/create-account/xxxx/yyyy"
        config.linkToCreateCasePage
        config.linkToManageCasePage
            on the final screen, we render link to "create a case" and "manage a case"
*/
class PUICreateAccountComponent {
    constructor(config) {
        // TODO: some good dev-level checks for config validation needed below
        config.should.have.property('routingPrefix').which.is.a.String()
        config.routingPrefix.length.should.be.above(1)
        config.should.have.property('linkToCreateCasePage').which.is.a.String()
        config.should.have.property('linkToManageCasePage').which.is.a.String()

        this.config = Object.assign({}, PUICreateAccountComponentDefaultConfig, config)
        this.config.routingPrefix = this.config.routingPrefix
    }

    convertMetaRouteToRoute(metaRoute) {
        let rv = metaRoute
        if (metaRoute.indexOf('$') === 0) {
            rv = this.config.routingPrefix + metaRoute.substring(1)
        }
        return rv
    }

    addRenderRoute(metaPath, httpVerb, stateHandlerId, stateHandlerMethod) {
        const path = this.convertMetaRouteToRoute(metaPath)
        this.expressApp[httpVerb](path, (req, res, next) => {
            const stateMeta = this.config.states[stateHandlerId]
            if (stateMeta) {
                let config = {}
                config.stateMeta = stateMeta
                config.component = this
                config.componentConfig = this.config
                let state = new stateMeta.HandlerClass(req, res, next, config)
                state[stateHandlerMethod]()
            } else {
                console.log('state meta [id:', stateHandlerId, '] not found')
                next()
            }
        })
    }

    installToExpress(expressApp) {
        this.expressApp = expressApp
        this.addRenderRoute('$', 'get', 'home', 'render')
        this.addRenderRoute('$/organisation-name', 'get', 'organisation-name', 'render')
        this.addRenderRoute('$/check-organisation', 'get', 'check-organisation', 'render')
        this.addRenderRoute('$/name', 'post', 'name', 'render')
        this.addRenderRoute('$/name', 'get', 'name', 'render')
        this.addRenderRoute('$/email', 'get', 'name', 'processDataSubmit')
        this.addRenderRoute('$/email', 'get', 'email', 'render')
        this.addRenderRoute('$/password', 'get', 'password', 'render')
        this.addRenderRoute('$/check', 'get', 'check', 'render')
        this.addRenderRoute('$/confirmation', 'get', 'confirmation', 'render')
    }
}

module.exports.PUICreateAccountComponent = PUICreateAccountComponent
