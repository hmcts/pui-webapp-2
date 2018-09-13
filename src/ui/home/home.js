const path = require('path')

module.exports.home = function(req, res) {
    let idam = res.getInstanceOf('idam')
    const idamLabel = idam.isAuthorised(req, res) ? 'Sign Out' : ''
    const idamlink = idam.isAuthorised(req, res) ? idam.config.routingPrefix + '/logout' : ''
    res.render(path.join(__dirname, '/home'), { idamlabel: idamLabel, idamLink: idam.config.routingPrefix + '/logout' })
}
