const express = require('express')
const nunjucks = require('nunjucks')
const log4js = require('express')
<<<<<<< HEAD
const path = require('path')
const homeController = require('./home')
=======
>>>>>>> 338339f3cbfaa8a092de7c1a4078daaa0d752fa1

//
// Components
//
const homeComponent = require('./components/home/home.js')

//
// Express App
//
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

app.use(
    (req, res, next) => {
        res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
        next()
    }
)

<<<<<<< HEAD
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')))

app.get('/', homeController.home)
=======
app.get('/', homeComponent.home)
>>>>>>> 338339f3cbfaa8a092de7c1a4078daaa0d752fa1

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

module.exports = app
