module.exports.home = function(req, res) {
  res.render("index");
};

module.exports.index = function(req, res) {
  res.redirect("/home");
};
