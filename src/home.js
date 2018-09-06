

module.exports.home = function(req, res) {
    res.render("index.html")
}

module.exports.innex =function(req, res) {
    res.redirect('/home')
}