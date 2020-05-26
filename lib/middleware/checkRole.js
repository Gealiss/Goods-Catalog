module.exports = function (role) {
    return function checkRole (req, res, next) {
      if (req.user && req.user.role >= role) 
      {
        return next();
      }
      return res.send(401, 'Not authorized.');
    };
  };