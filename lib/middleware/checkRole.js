module.exports = function (role) {
    return function checkRole (req, res, next) {
      if (req.user && req.user.role >= role) 
      {
        return next();
      }
      res.redirect('/login');
    };
  };