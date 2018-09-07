const express = require('express')
const nunjucks = require('nunjucks')
//const log4js = require('express')
//const path = require('path')
const homeComponent = require('./components/home/home.js')

const app = express()
const PORT = 4001

var viewDirs = [
    __dirname,
    'views',
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

//express view engine settings
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

app.use(express.static('../dist'))

app.use(
    (req, res, next) => {
        res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
        next()
    }
)

app.use(express.static('dist'))

app.get('/', homeComponent.home)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

module.exports = app
