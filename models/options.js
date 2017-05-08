// options.js: A model wishlist for sequelize to map to our psql db. 

// Load the things we need
var bcrypt = require('bcrypt-nodejs');
var Sequelize = require('sequelize');

// Export our module for server.js
module.exports = function(sequelize, DataTypes) {
	var options = sequelize.define("options", {
		id : {
			type : Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		wishlist_warning : {
			type : DataTypes.STRING,
			allowNull : true
		}}, 
			{
				freezeTableName: true,
				timestamps: false
			},
			{ 
				getterMethods : {
					someValue : function() {
					return this.someValue;
					}
				},
				setterMethods : {
					somevalue : function(value) {
					this.somevalue = value;
					}
				}
			}
		);
	return options;
	};