const Groups = require('../models/groups');
const UserGroups = require('../models/user-groups')
const User = require('../models/users')


exports.createGroup = async (req, res, next) => {
    try{
    console.log(req.body.name)
    const data = await req.user.createGroup({name: req.body.name, createdBy: req.user.email},{through: {
        userId:req.user.id
    }})
    console.log(data.dataValues.createdBy);
    res.status(201).json({message: 'created group successfully',name: req.body.name, id: data.dataValues.id, createdBy: data.dataValues.createdBy})
}
catch(err){
    console.log(err)
    res.status(401).json({message: 'something went wrong while creating group :('})
}
}

exports.getGroups =async (req, res, next) => {
    const groups = await req.user.getGroups({
        attributes: ['id', 'name', 'createdBy']
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

exports.changeAdmin =async (req, res, next) => {
    try{
    let id = +req.body.id;
    let email = req.body.mail;
    let group = await Groups.findByPk(id)
    let user = await User.findOne({where: {email:email}})
    let check = await UserGroups.findOne({where: {
        userId :user.id,
        groupId:group.id
    }})
    if(check){
        await group.update({createdBy: email});
        res.status(201).json({message: 'changed admin successfully!'})
    }
    else{
        res.status(401).json({message: "user doesn't exist in the group"})
    }
}
catch(err){
    console.log("Error", err);
    res.status(403).json({message: 'some error occured while changing admin'})
}
}