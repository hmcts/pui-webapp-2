const path = require('path')

module.exports.home = function (req, res) {
    res.render(path.join(__dirname, '/home'))
}
