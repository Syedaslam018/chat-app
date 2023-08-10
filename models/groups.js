const Sequelize = require('sequelize');

const sequelize = require('../routes/util/database')

const Groups = sequelize.define('groups', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: Sequelize.STRING
})

module.exports = Groups;