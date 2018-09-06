const express = require('express')
const nunjucks = require('nunjucks')
const log4js = require('express')
const homeController = require('./home')


const app = express()
const PORT = 4001

nunjucks.configure('home', {
    autoescape: true,
    express: app
});


//express view engine settings
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

app.set('views', '.');

app.use(
    (req, res, next) => {
        res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
        next()
    }
)


app.get('/', homeController.home)


//if (require.main === module) {
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
//}

module.exports = app