const Messages = require('../models/messages')
const User = require('../models/users')
const sequelize = require('../routes/util/database')
const { Op } = require('sequelize')
const AWS = require('aws-sdk');

exports.sendMessage = async (req, res, next) => {
    //console.log(req.user.name);
    const t = await sequelize.transaction();
    try{
        const message = req.body.message
        const post = await Messages.create({text:message, name: req.user.name,type:'text',  userId: req.user.id, groupId: +req.params.groupId}, {transaction: t})  
        t.commit();

        res.status(201).json({success:true, message:'message sent succesfully',text:message, userId:req.user.id,name:req.user.name, type:'text'});
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

exports.uploadFile = async (req, res, next) => {
    try {

        const {groupId}=req.params;
        const userId=req.user.id;
        const userName=req.user.name;
        const filename="File"+userId+"/"+Date.now()+Math.random();
        const fileUrl=await uploadToS3(req.file,filename);
        console.log(fileUrl)
        await Messages.create({groupId,userId,text:fileUrl,name:userName,type:'file'});
        const userFile={
            message:fileUrl,
            name:userName,
            userId
        }
        res.status(201).json({userFile,success:true})  
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({msg:'Error uploading file',error})
    }
}

async function uploadToS3(data, filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
      const IAM_USER_KEY = process.env.IAM_USER_KEY;
      const IAM_USER_SECRET = process.env.IAM_SECRET_KEY;

    const s3= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET

    });
      var params = {
        Bucket: BUCKET_NAME,
            Key: filename,
            Body: data.buffer,
            ACL: 'public-read'         // a Network Access Control List       // privilages 
      };
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.log('Error while Uploading File', err);
            reject(err);
          } else {
            console.log('File Uploaded Successfully:', data.Location);
            resolve(data.Location);
          }
        });
      });
}
// const BUCKET_NAME = process.env.BUCKET_NAME;
//     const IAM_USER_KEY = process.env.IAM_USER_KEY;
//     const IAM_SECRET_KEY= process.env.IAM_SECRET_KEY;

//     let s3bucket = new  AWS.S3({
//         accessKeyId: IAM_USER_KEY,
//         secretAccessKey: IAM_SECRET_KEY
//     })
//         var params = {
//             Bucket: BUCKET_NAME,
//             Key: filename,
//             Body: data,
//             ACL: 'public-read'
//         }
//         return new Promise((resolve, reject) => {
//             s3bucket.upload(params, (err, response) => {
//                 if(err){
//                     console.log(err)
//                     reject(err);
//                 }
//                 else{
//                     //console.log('success', response);
//                     resolve(response.Location);
//                 }
//             })
//         })


