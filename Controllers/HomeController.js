exports.index = function (req, res) {
    res.render('index', { title: 'Auth0 Webapp sample Nodejs' });
};
exports.about = function (req, res) {
    res.send("О сайте");
};