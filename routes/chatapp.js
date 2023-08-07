const express = require('express');

const router = express.Router();

const appController = require('../controllers/chatapp');
const userAuthentication = require('../middleware/auth')

router.post('/app', userAuthentication.authenticate, appController.sendMessage)
router.get('/getchat', userAuthentication.authenticate, appController.getChat)
router.get('/getMessages', userAuthentication.authenticate, appController.getMessages)

module.exports = router