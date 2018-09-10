const express = require('express')
const nunjucks = require('nunjucks')
//const log4js = require('express')
const path = require('path')
const session = require('express-session')
const sessionFileStore = require('session-file-store')

// Components
const homeComponent = require('./components/home/home.js')
const { PUICreateAccountComponent } = require('./components/create-account/create-account.js')

const app = express()
const PORT = 4001

// Read from ENV in prod somehow?
var config = {
  sessionSecret: 's3cretSauc3',
  secureCookie: false // this needs to be 'true' in prod and needs https encryption to be used
}

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

// components
app.get('/', homeComponent.home)

let puiCreateAccountComponent = new PUICreateAccountComponent({
  routingPrefix: '/create-account',
  linkToCreateCasePage: '/create-case',
  linkToManageCasePage: '/manage-case'
})
puiCreateAccountComponent.installToExpress(app)

// Start !
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
