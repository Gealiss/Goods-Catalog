exports.index = function (req, res) {
    res.send("Главная страница admin");
};
exports.about = function (req, res) {
    res.send("О сайте, user = " + req.user);
};