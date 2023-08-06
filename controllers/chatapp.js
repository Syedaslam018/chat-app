const Messages = require('../models/messages')
const sequelize = require('../util/database')

exports.sendMessage = async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const message = req.body.message
        const post = await Messages.create({text:message}, {transaction: t})  
        t.commit()
        res.status(201).json({success:true, message:'message sent succesfully'});
    }
    catch(e){
        t.rollback();
        res.status(403).json({success:false, message: 'something went wrong'});
    }
}