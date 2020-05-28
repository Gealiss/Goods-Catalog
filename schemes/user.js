const mongoose = require('mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const Roles = Object.freeze({"basic":1, "admin":2, "owner":3});

const userSchema = new mongoose.Schema({
    displayName: String,
    email: {
      type: String,
      required: 'Укажите e-mail',
      unique: 'Такой e-mail уже существует',
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    role: {
      type: Number,
      default: Roles.basic,
      required: true
    },
    passwordHash: String,
    salt: String,
  }, {
    timestamps: true
});

userSchema.virtual('password') //Виртуальное поле
    .set(function (password) {
    this._plainPassword = password;
    if (password) {
        this.salt = crypto.randomBytes(128).toString('base64');
        this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'sha512').toString('hex');
    } else {
        this.salt = undefined;
        this.passwordHash = undefined;
    }
    })
    .get(function () {
    return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
if (!password) return false;
if (!this.passwordHash) return false;
return crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'sha512').toString('hex') == this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);
module.exports.Roles = Roles;