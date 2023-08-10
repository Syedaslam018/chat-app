const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group')
const userAuthentication = require('../middleware/auth')

router.post('/createGroup', userAuthentication.authenticate, groupController.createGroup);
router.get('/getGroups', userAuthentication.authenticate, groupController.getGroups);
router.post('/addToGroup', userAuthentication.authenticate, groupController.addUser)
router.post('/removeFromGroup', userAuthentication.authenticate, groupController.removeUser)
router.post('/changeAdmin', userAuthentication.authenticate, groupController.changeAdmin)
module.exports = router