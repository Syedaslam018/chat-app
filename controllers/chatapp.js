const Messages = require('../models/messages')
const User = require('../models/users')
const sequelize = require('../routes/util/database')
const { Op } = require('sequelize')

exports.sendMessage = async (req, res, next) => {
    console.log(req.user.name);
    const t = await sequelize.transaction();
    try{
        const message = req.body.message
        const post = await Messages.create({text:message, name: req.user.name, userId: req.user.id, groupId: req.body.groupId}, {transaction: t})  
        t.commit()
        res.status(201).json({success:true, message:'message sent succesfully'});
    }
    catch(e){
        t.rollback();
        console.log(e)
        res.status(403).json({success:false, message: 'something went wrong'});
    }
}

exports.getChat = async(req, res, next) => {
    const id  = req.params.groupId;
    const chat = await Messages.findAll({
        where:{
            groupId : id
        }
    })
    res.status(200).json({data: chat, success: false})
}

exports.getMessages = async (req, res, next) => {
    const start = +req.query.lastMessageId;
    const data = await Messages.findAll({
        where: {
            id:{
                [Op.gt]:start
            }
        },
        attributes: {
            exclude: ['groupId', 'createdAt', 'updatedAt']
        }
    })
    res.status(201).json({data:data, success:true});
}

// exports.getUsers = async (req, res, next) => {
//     const data = await User.findAll({
//         attributes: ['id','name']
//     })
//     //console.log(data);
//     res.status(201).json(data);
// }