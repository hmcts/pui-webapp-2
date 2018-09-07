const path = require('path')

module.exports.createAccount = function (req, res) {
    res.render(path.join(__dirname, '/index'))
}
