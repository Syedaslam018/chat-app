const sequelize = require('../util/database')
const User = require('../models/users')
const bcrypt = require('bcrypt')

exports.addUser = async (req, res, next) => {
    console.log(req.body)
    const t = await sequelize.transaction();
    try{
    const name = req.body.name;
    const email = req.body.email;
    const phonenumber = req.body.phno;
    const password = req.body.password;

    bcrypt.hash(password, 10, async(err, hash) => {
        console.log(err)
        await User.create({name: name, email: email,phonenumber: phonenumber, password: hash, totalExpenses: 0}, {transaction: t});
        await t.commit();
        res.status(201).json({message: 'user created succesfully'});
    })
    
    }
    catch(err) {
        t.rollback();
        console.log(err)
        res.status(403).json({message : err})
    }
}