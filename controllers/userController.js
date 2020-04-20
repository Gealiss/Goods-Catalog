exports.index = function (req, res) {
    const { _raw, _json, ...userProfile } = req.user;
    res.render('user', {
      userProfile: JSON.stringify(userProfile, null, 2),
      title: 'Profile page'
    });
};