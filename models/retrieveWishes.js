// wishlist__c.js: A model wishlist for sequelize to map to our psql db. 

// Load the things we need
var bcrypt = require('bcrypt-nodejs');
var Sequelize = require('sequelize');

// Export our module for server.js
module.exports = function(sequelize, DataTypes) {
	var wishlist__c = sequelize.define("wishlist__c", {
		name : {
			type : DataTypes.INTEGER,
			allowNull : true
		},
		firstname__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		lastinitial__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		age__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		gender__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		placementtype__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		placementname__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		caseworker__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		shirtsize__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		shirtsizetype__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		pantsize__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		pantsizetype__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		dresssize__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		dresssizetype__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		shoesize__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		shoesizetype__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		favcolor__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		favsportteam__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		favbook__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		favmovieshow__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		favhobby__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		favmusician__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		wishdescription1__c : {
			type : DataTypes.STRING,
			allowNull : false
		},
		wishreceived1__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishdescription2__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishreceived2__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishdescription3__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishreceived3__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishdescription4__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishreceived4__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishdescription5__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		wishreceived5__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		enteredby__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		donor__c : {
			type : DataTypes.STRING,
			allowNull : true
		},
		id : {
			type : Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}}, 
			{
				schema: "salesforce",
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
	return wishlist__c;
	};