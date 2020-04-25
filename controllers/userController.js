exports.index = function (req, res) {
  res.send(req.user);
/*     const { _raw, _json, ...userProfile } = req.user;
    res.render('user', {
      userProfile: JSON.stringify(userProfile, null, 2),
      title: 'Profile page'
    }); */
};