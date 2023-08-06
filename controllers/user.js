const sequelize = require('../util/database')
const User = require('../models/users')
const bcrypt = require('bcrypt')

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