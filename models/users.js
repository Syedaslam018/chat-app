const Sequelize = require('sequelize');

const sequelize = require('../routes/util/database')

const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
    
  },
  phonenumber: {
    type: Sequelize.BIGINT(10),
    allowNull:false,
    unique:true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = User;