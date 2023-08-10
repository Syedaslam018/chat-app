const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt');
require('dotenv').config();


const sequelize = require('./routes/util/database');
const app = express();
app.use(cors())
app.use(bodyParser.json({ extended: false }));

const User = require('./models/users')
const Messages = require('./models/messages')
const Groups = require('./models/groups')
const UserGroups = require('./models/user-groups')


const signupRoutes = require('./routes/user');
const appRoutes = require('./routes/chatapp');
const groupRoutes = require('./routes/group')

app.use(signupRoutes);
app.use(appRoutes)
app.use(groupRoutes);

User.hasMany(Messages);
Messages.belongsTo(User);

Groups.hasMany(Messages);
Messages.belongsTo(Groups);

Groups.belongsToMany(User, {through: UserGroups})
User.belongsToMany(Groups, {through: UserGroups})
sequelize
//.sync({force: true})
.sync()
.then(user => {
    app.listen(3000)
})
.catch(err => {
    console.log(err)
})