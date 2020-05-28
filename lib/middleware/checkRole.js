module.exports = function (role) {
    return function checkRole (req, res, next) {
      if (req.user && req.user.role >= role) 
      {
        return next();
      }
      let error = { message: "Not Authorized", status: 401 };
      return next(error);
      //return res.send(401, 'Not authorized.');
    };
  };

