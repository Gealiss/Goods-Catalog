const passport = require('passport');

module.exports = () => {
    return function requestAuth(req, res, next){
        //if user have jwt cookie or auth header
        if(req.cookies['jwt'] || req.headers["Authorization"] || req.headers["authorization"]){
            //set auth header if there is no such
            if(!req.headers["Authorization"] && !req.headers["authorization"]){ 
                req.headers["authorization"] = "Bearer " + req.cookies['jwt'];
            }

            //try to auth user
            passport.authenticate('jwt', {session: false}, (err, user) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            if(!user){
                res.clearCookie('jwt');
                return res.redirect('/');
            }
            req.logIn(user, {session: false}, function(err) { // create req.user
                if (err) { return next(err); }
                return next();
            });      
            })(req, res, next);

        } else {
            console.log('no header');
            return next();
        }
    }
}