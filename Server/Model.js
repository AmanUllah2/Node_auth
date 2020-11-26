const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SALT_I = 10;

const UserScheme = mongoose.Schema ({
    email: {
        type: String,
        required: true,
        trim: true,        
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: {
        type: String
    }
})

UserScheme.pre('save',function(next){
    var user = this;
    if (user.isModified('password')){
        bcrypt.genSalt(SALT_I, function(err,salt){
            if(err) return next(err);

            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })            
        })
    }
    else {
        next();
    }
})

UserScheme.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'supersecret');

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        else cb(null,user)
    })

}

const User = mongoose.model('User', UserScheme);
module.exports = {User}