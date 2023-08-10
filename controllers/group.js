const Groups = require('../models/groups');
const UserGroups = require('../models/user-groups')
const User = require('../models/users')


exports.createGroup = (req, res, next) => {
    try{
    console.log(req.body.name)
    req.user.createGroup({name: req.body.name, createdBy: req.user.email},{through: {
        userId:req.user.id
    }})
    res.status(201).json({message: 'created group successfully'})
}
catch(err){
    console.log(err)
    res.status(401).json({message: 'something went wrong while creating group :('})
}
}

exports.getGroups =async (req, res, next) => {
    const groups = await req.user.getGroups({
        attributes: ['id', 'name']
    })
    //console.log(groups);
    res.status(200).json({data:groups, success:true})
}

exports.addUser = async (req, res, next) => {
    try{
    const id = req.body.id
    const mail = req.body.mail
    const user = await User.findOne({
        where: {
            email: mail
        }
    })
    await UserGroups.create({userId: user.id, groupId: id})
    res.status(201).json({message: 'added user successfully'})
}
catch(err){
    console.log(err)
    res.status(401).json({message: 'error while adding the user'})
}

}

exports.removeUser = async (req, res, next) => {
    try{
        const id = req.body.id
        const mail = req.body.mail
        const user = await User.findOne({
            where: {
                email: mail
            }
        })
        await UserGroups.destroy({where: {userId: user.id, groupId: id}})
        res.status(201).json({message: 'removed user successfully'})
    }
    catch(err){
        console.log(err)
        res.status(401).json({message: 'error while removing the user'})
    }
}