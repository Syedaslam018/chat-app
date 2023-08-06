const express = require('express');

const router = express.Router();

const appController = require('../controllers/chatapp');
const userAuthentication = require('../middleware/auth')

router.post('/app', userAuthentication.authenticate, appController.sendMessage)

module.exports = router