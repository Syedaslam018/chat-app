const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt');
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
require('dotenv').config();


const sequelize = require('./routes/util/database');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {cors: {origin:'*'}})


io.on('connection', (socket) => {
    console.log("Socket.io is Conneted");
    socket.on('message',(msg,userName,groupId,userId)=>{
        socket.broadcast.emit("message",msg,userName,groupId,userId)
    });
    socket.on("file",(message,userName,groupId,userId)=>{
        socket.broadcast.emit("file",message,userName,userId)

    })
})
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
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, `public${req.url}`))
})

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
    server.listen(3000)
})
.catch(err => {
    console.log(err)
})