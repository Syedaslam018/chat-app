const Messages = require('../models/messages')
const sequelize = require('../routes/util/database')

exports.sendMessage = async (req, res, next) => {
    console.log(req.user.name);
    const t = await sequelize.transaction();
    try{
        const message = req.body.message
        const post = await Messages.create({text:message, name: req.user.name, userId: req.user.id}, {transaction: t})  
        t.commit()
        res.status(201).json({success:true, message:'message sent succesfully'});
    }
    catch(e){
        t.rollback();
        console.log(e)
        res.status(403).json({success:false, message: 'something went wrong'});
    }
}

exports.getMessages = async(req, res, next) => {
    const data = await Messages.findAll({
        attributes: {
            exclude: ['id', 'userId']
        }
    })
    res.status(200).json({data: data, success: false})
}