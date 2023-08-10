const express = require('express');

const router = express.Router();

const appController = require('../controllers/chatapp');
const userAuthentication = require('../middleware/auth')

router.post('/app', userAuthentication.authenticate, appController.sendMessage)
router.get('/getchat/:userId', userAuthentication.authenticate, appController.getChat)
router.get('/getMessages', userAuthentication.authenticate, appController.getMessages)
//router.get('/getusers', userAuthentication.authenticate, appController.getUsers);

module.exports = router