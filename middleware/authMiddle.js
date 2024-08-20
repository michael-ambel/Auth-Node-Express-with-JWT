const jwt = require('jsonwebtoken');
const User = require('../models/User');

const routeProtect = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'secrate code', (err, decodedToken) => {
            if(err){
                console.log(err);
                res.redirect('/login')
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

//identify and disply user 

const identifyUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'secrate code', async (err, decoddedtoken) => {
            if(err){
                res.locals.user = null;
                next()
            }
            else{
                let user = await User.findById(decoddedtoken.id)
                res.locals.user = user;
                next()
            }
        })
    }
    else{
        res.locals.user = null;
        next()
    }
}


module.exports = {routeProtect, identifyUser}