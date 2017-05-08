// passport.js: Handles authentication for the application

// Load the things we need.
var LocalStrategy    = require('passport-local').Strategy;
var configDB = require('./database.js');
var Sequelize = require('sequelize');
var pg = require('pg').native;
var pghstore = require('pg-hstore');
var sequelize = new Sequelize(configDB.url);
var User  = sequelize.import('../models/user');

// Check existance of user model in database. If it DNE create it.
User.sync();

// Export our module for server.js
module.exports = function(passport) {
	
	
	
    // Serialize User.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize User.
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user){
			done(null, user);
		}).catch(function(e){
			done(e, false);
		});
    });

    // Local Login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // Pass the req to route.
    },
    function(req, email, password, done) {	
    		// Find our user in the database.
			User.findOne({ where: { localemail: email }})
				.then(function(user) {
					// if we find user or user has wrong pswrd error then done,
					if (!user) {
						done(null, false, req.flash('loginMessage', 'Unknown User or Password'));
					} else if (!user.validPassword(password)) {
						done(null, false, req.flash('loginMessage', 'Unknown User or Password'));
					} else {
						done(null, user);
					}
				})
				.catch(function(e) { 
					done(null, false, req.flash('loginMessage',e.name + " " + e.message));
				});				
	}));

    

    // local signup
    passport.use('local-signup', new LocalStrategy({
     	usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our
									// route (lets us check if a user is logged
									// in or not)
    },
    function(req, email, password, done) {        
		// Check db if username is taken
		User.findOne({ where: { localemail: email }})
			.then(function(existingUser) {
			
				// if user From Serializable already exists
				if (user) 
					return done(null, false, req.flash('loginMessage', 'Please try a different email.'));

				// if already logged in
				if(req.user) {
					var user           	 = req.user;
					user.localemail   	 = email;
					user.localpassword 	 = User.generateHash(password);
					user.save().catch(function (err) {
						throw err;
					}).then (function() {
						done(null, user);
					});
				} 
				// NOT logged in. Username NOT taken. Create new User.
				else {
					// create user
					var newUser = User.build ({localemail: email, localpassword: User.generateHash(password)});	
					newUser.save().then(function() {done (null, newUser);}).catch(function(err) { done(null, false, req.flash('loginMessage', err));});
				}
			})
			.catch(function (e) {
				done(null, false, req.flash('loginMessage',e.name + " " + e.message));				
			})

    }));

    // local account creation
    passport.use('local-AccountCreation', new LocalStrategy({
    	// email instead of username
    	usernameField : 'email',
        passwordField : 'password',
        adminField: 'admin',
        passReqToCallback : true // allows us to pass in the req from our
									// route (lets us check if a user is logged
									// in or not)
    },
    function(req, email, password, done) {        
	
    
    	
    	// Look for name similar to new user request.
		User.findOne({ where: { localemail: email }})
			.then(function(existingUser) {
				console.log("existingUser: " + existingUser);
				// if user already exists
				if (existingUser) {
					console.log("Found an exisiting user!");
					return done(null, false);
				}
				
					// create user
					console.log('Creating a user with the following values: ');
					console.log(email);
					console.log(password);
					// Commenting out ! console.log(passwordd);
					console.log('req.body: ' + req.body);
					console.log('req.body.userType' + req.body.userType);
					console.log('');
				
					var newUser = User.build ({localemail: email, localpassword: User.generateHash(password), admin: req.body.userType});	
					newUser.save().then(function() {return done (null, false);}).catch(function(err) { done(null, false, req.flash('loginMessage', err));});
				
			})
			.catch(function (e) {
				console.log("Error catch!");
				return done(null, false);				
			})

    }));

 


	
};