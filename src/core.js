const decamelize = require('decamelize')
const log4js = require('log4js')

const logger = log4js.getLogger('core')
logger.level = 'info'

class core {
    constructor(config) {
        this.componentStack = {}
        this.config = config
    }

    init(app) {
        const componentDir = this.config.core.componentDir

        this.config.core.components.forEach(component => {
            let componentSlot = {}
            const componentKey = Object.keys(component)[0]
            const normalisedKey = decamelize(componentKey, '-')
            logger.info('Instigating ', component[componentKey].class)
            const requireFile = component[componentKey].file
                ? componentDir + normalisedKey + '/' + component[componentKey].file
                : componentDir + normalisedKey
            const ComponentRequire = require(requireFile)[component[componentKey].class]
            componentSlot = new ComponentRequire(component[componentKey].config)
            this.componentStack[Object.keys(component)[0]] = componentSlot
            componentSlot.installToExpress(app)
        })

        app.use(this.coreInstance.bind(this))
    }

    getInstanceOf(instanceKey) {
        return this.componentStack[instanceKey]
    }

    coreInstance(req, res, next) {
        res.getInstanceOf = this.getInstanceOf.bind(this)
        next()
    }
}

module.exports = core
