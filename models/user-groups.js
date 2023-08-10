const Sequelize = require('sequelize');

const sequelize = require('../routes/util/database')

const UserGroups = sequelize.define('user-groups', {
  userId : {
    type: Sequelize.INTEGER,
    allowNull: false
  }
  , groupId:{
    type:Sequelize.INTEGER,
    allowNull: false
    },
})

module.exports = UserGroups;