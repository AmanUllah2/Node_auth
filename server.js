const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth');

const {User} = require('./Server/Model');
app.use(bodyparser.json());

app.post('/api/user',(req,res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })

    user.save((err,doc)=>{
        if(err) res.status(400).send(err)
        res.status(200).send(doc)
    })
})

app.post('/api/user/login',(req,res)=>{
    User.findOne({'email': req.body.email},(err,user)=>{
        if(!user) res.send('Auth Failed.! User not found.')
                
        else {
        bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
            if(err) throw err;
            else if(!isMatch) res.status(400).json({message:'Incorrect Password'})
            else res.status(200).send(isMatch)
        })
        user.generateToken((err,user)=>{
            if(err) return res.status(400).send(err);
            else res.cookie('auth',user.token).send('ok')
        })
    }
    })
})

app.get('/user/profile',(req,res)=>{
    res.status(200).send('ok')
})

app.listen(3004,()=>{
    console.log("running on port 3004")
});