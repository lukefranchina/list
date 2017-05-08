// user.js: A user account model for sequelize to map to our psql db. 

// Load the things we need
var bcrypt   = require('bcrypt-nodejs');
var Sequelize = require('sequelize');

//Export our module for server.js
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    localemail        : {type : Sequelize.STRING},
    localpassword     : {type : Sequelize.STRING},
    admin			  : {type : Sequelize.BOOLEAN, defaultValue: true}
  }, 
  {
    classMethods: {
      generateHash : function(password) {
      	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },			
    },
      instanceMethods: {			
      validPassword : function(password) {
      	return bcrypt.compareSync(password, this.localpassword);
      }
    },
    getterMethods: {
    	someValue: function() {
    		return this.someValue;
    	}
    },
    setterMethods: {
    	somevalue: function(value) {
    		this.somevalue = value;
    	}
    }
  });
}