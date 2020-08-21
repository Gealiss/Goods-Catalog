const db = require('../db.js')();

exports.addUser = function (req, res) {
    db.CreateUser(req.body, (err, user) => {
        if(err){
            return res.send(err);
        }
        if(!user){
            return res.send("Some error");
        }
        res.send(user);
    });
};

exports.updateUser = function (req, res) {
    let id = req.body.user_id;
    let toChange = req.body.toChange;

    if(!id && !toChange){
        return res.send("Not correct data to update user");
    }

    db.UpdateUser(id, toChange, (err, user) => {
        if(err){
            return res.json({error: err, user: user});
        }
        if(!user){
            return res.json({error: err, user: user});
        }
        res.send(user);
    });
};

exports.deleteUser = function (req, res) {
    let id = req.body.user_id;

    if(!id){
        return res.send("Request did not contain user id");
    }

    db.DeleteUser(id, (err, user) => {
        if(err){
            return res.json({error: err, user: user});
        }
        if(!user){
            return res.json({error: err, user: user});
        }
        res.send(user);
    });
};

exports.getUsers = function (req, res) {
    let filter = {};

    if(req.body.filter){
        filter = req.body.filter;
    }
    if(filter.user && filter.user.email){
        filter.user.email = new RegExp(`^(${filter.user.email}).*`, 'gmi'); //change email to regexp
    }

    db.GetUsers(filter, (err, users) => {
        if(err){
            return res.json({error: err, users: users});
        }
        if(!users){
            return res.json({error: err, users: users});
        }
        res.send(users);
    });
};