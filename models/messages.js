const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const Messages = sequelize.define('messages', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  text: Sequelize.STRING,
  
})

module.exports = Messages;