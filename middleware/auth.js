const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    try{
    const token = req.header('Authorization');
    const tokenV = jwt.verify(token, '1qwrte4favsf4AhtqwoT');
    const user = await User.findByPk(tokenV.id)
        if(!user){
            res.status(401).json({success: false, message: 'User Not Found'})
        }
        else{
            req.user = user;
            next();
        }
    }
    catch(err) {
        console.log(err)
    } 
}