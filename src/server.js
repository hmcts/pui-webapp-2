const express = require('express')
const nunjucks = require('nunjucks')
const log4js = require('log4js')
const path = require('path')
const config = require('./config')
const session = require('express-session')
const sessionFileStore = require('session-file-store')
// need this for idam cookie setting/reading
const cookieParser = require('cookie-parser')
const CoreInstance = require('./core')

// we need this as idam tries to get  to somewhere behind a proxy
// nb. global-tunnel is depricated and broken, that was fun ... Global-tunnel-ng is a newer fork
require('global-tunnel-ng').initialize({
    host: '172.16.0.7',
    port: 8080
})

// Components
const homeComponent = require('./ui/home/home.js')

const app = express()
const PORT = 4001

const logger = log4js.getLogger('server')
logger.level = 'info'

logger.info('Using Config:\n', config)

var viewDirs = [
    __dirname,
    'components',
    'assets/templates',
    '../node_modules/govuk-frontend/',
    '../node_modules/govuk-frontend/components',
    '../node_modules/@hmcts/frontend/components'
]

nunjucks.configure(viewDirs, {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true
})

//sessions
const FileStore = sessionFileStore(session)

app.use(
    session({
        cookie: {
            httpOnly: true,
            maxAge: 31536000,
            secure: config.secureCookie
        },
        name: 'pui-webapp-2',
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret,
        store: new FileStore({
            path: process.env.NOW ? `/tmp/sessions` : `.sessions`
        })
    })
)

app.use(cookieParser())

//express view engine settings
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

app.use(express.static('../dist'))

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    next()
})

// static assets
app.use(express.static('dist'))
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')))
app.use('/assets', express.static(path.join(__dirname, '../node_modules', 'govuk-frontend', 'assets')))
app.use('/assets', express.static(path.join(__dirname, '../node_modules', '@hmcts', 'frontend', 'assets')))

const core = new CoreInstance(config)
core.init(app)

app.get('/', homeComponent.home)

// Start !
app.listen(PORT, () => {
    logger.info(`listening on port ${PORT}`)
})
