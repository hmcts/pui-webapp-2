

module.exports.home = function(req, res) {
    res.render("test")
}

module.exports.innex =function(req, res) {
    res.redirect('/home')
}