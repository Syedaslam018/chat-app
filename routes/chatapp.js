const express = require('express');
const multer = require('multer');
const router = express.Router();

const appController = require('../controllers/chatapp');
const userAuthentication = require('../middleware/auth')
const upload = multer();

router.post('/app/:groupId', userAuthentication.authenticate, appController.sendMessage)
router.get('/getchat/:groupId', userAuthentication.authenticate, appController.getChat)
router.get('/getMessages', userAuthentication.authenticate, appController.getMessages)
router.post('/app/upload/:groupId',userAuthentication.authenticate,upload.single('file'),appController.uploadFile)
//router.get('/getusers', userAuthentication.authenticate, appController.getUsers);

module.exports = router