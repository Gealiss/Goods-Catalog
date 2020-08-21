exports.index = function (req, res) {
  let displayName = req.user.displayName;
  let email = req.user.email;
  let id = req.user.id;
  const { _raw, _json, ...userProfile } = req.user;
  res.render('user', {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'Profile page'
  });
};
//test