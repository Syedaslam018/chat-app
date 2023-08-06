const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt');
require('dotenv').config();


const sequelize = require('./util/database');
const app = express();
app.use(cors())
app.use(bodyParser.json({ extended: false }));

const User = require('./models/users')
const signupRoutes = require('./routes/user')

app.use(signupRoutes);



sequelize
//.sync({force: true})
.sync()
.then(user => {
    app.listen(3000)
})
.catch(err => {
    console.log(err)
})