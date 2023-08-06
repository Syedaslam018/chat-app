const sequelize = require('../util/database')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function getWebToken(id,name, boolSome){
    return jwt.sign({id: id, name: name}, '1qwrte4favsf4AhtqwoT')
}

exports.addUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    const name = req.body.name;
    const email = req.body.email;
    const phonenumber = req.body.phno;
    const password = req.body.password;

    bcrypt.hash(password, 10, async(err, hash) => {
        try{
        console.log(err)
        const result = await User.create({name: name, email: email,phonenumber: phonenumber, password: hash}, {transaction: t})
            if(!result){
                throw new Error("User already exists")
            }
            else{
                t.commit();
                res.status(201).json({message: "user created successfully"})
            }
        }
        catch(err) {
            t.rollback();
            return res.status(500).json({message: 'user already exists'});
        };
    })
}

exports.getUser = async (req, res, next) => {
    const name = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({where: {email:name}})
    if(!user){
        res.status(404).json({message: "User doesn't exist", success:false})
    }
    else{
        bcrypt.compare(password , user.password, (err, result) => {
            if(err){
                throw new Error("Something went wrong")
            }
            if(!result){
                res.status(401).json({success: false, message: 'incorrect password'});
            }
            if(result){
                res.status(201).json({success: true, message: 'user logged in successfully', token: getWebToken(user.id, user.name)});
            }
        })
    }
}
