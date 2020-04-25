exports.index = function (req, res) {
    res.render('index', { title: 'Webapp' });
};

exports.about = function (req, res) {
    res.send("О сайте");
};

exports.login = function (req, res) {
    res.render('test'), {title: 'Test login'};
};