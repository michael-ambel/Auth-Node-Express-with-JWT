const { application } = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

//error handler
const errHandler = (err) => {

    let errors = {email:'', password:''}

    // validation

    if(err.message === 'password error'){
        errors.password = 'Incorrect password';
        return errors;
    }
    if(err.message === 'email error'){
        errors.email = 'This email is not registerd';
        return errors;
    }

    if(err.code === 11000){
        errors.email = 'Email alredy registerd'
        return errors
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
            
        } );
       
        return errors
    }
}

const maxAge = 60*60*24;
const jwtToken = (id) => {
    return jwt.sign({id}, 'secrate code', {expiresIn: maxAge})
}

module.exports.login_get = (req, res) => {
    res.render('../views/login')
    // console.log(req.body);
    // const {email, password} = req.body
    // console.log(email, password);
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.login(email, password)
        if(user){
            const token = jwtToken(user._id)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
            res.status(200).json({user: user._id})
        }
    }
    catch(err){
        const errors = errHandler(err)
        res.status(400).json({errors: errors})
    }
}

module.exports.signup_get = (req, res) => {
    res.render('../views/signup')
}

module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await User.create({email, password})
        const token = jwtToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({user: user._id})
    }
    catch(err){
        const errors = errHandler(err)
        res.status(400).json({ errors: errors })
        //console.log(errors);
    }
    
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}
