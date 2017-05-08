// routes.js: express routes used for links and consumed by angular.
// *** Application URLS and how they respond to client requests ***

/*******************************************************************************
 * 
 * List of routes: (/) Home (/login) Login Page (/signup) Signup Page Handle
 * POST for login Handle POST for signup User Profile Page (after Login)
 * 
 */


// Load the things we need.
var configDB = require('./config/database.js');
var Sequelize = require('sequelize');
var pg = require('pg').native;
var pghstore = require('pg-hstore');
var sequelize = new Sequelize(configDB.url);
var userModel = sequelize.import('./models/user.js');
var wishListModel = sequelize.import('./models/wishlist__c.js');
var retrieveWishes = sequelize.import('./models/retrieveWishes.js');
var optionsModel = sequelize.import('./models/options.js');

// If  model has been dropped resync. Keep this commented out when deploying to Heroku.
//wishListModel.sync();
//optionsModel.sync();

// Wrap our routes in a export module to use it in server.js
module.exports = function(app, passport) {
	// This SHALL contain routes HTTP Get requests.
	// https://expressjs.com/en/starter/basic-routing.html

	// Home, get function to display page
	app.get('/', function(req, res) {
		// render page
		res.render('index.ejs');
	});

	// Login, get function to display page
	app.get('/login', function(req, res) {
		// render page | pass flash data
		console.log("Displaying login page.");
		res.render('login.ejs', {
			message : req.flash('loginMessage')
		});
	});

	// Login, post function to redirect
	app.post('/login', passport.authenticate('local-login', {

		successRedirect : '/userhome',
		failureRedirect : '/login',
		failureFlash : true
	}));

	// Signup, get function to display page
	app.get('/signup', function(req, res) {
		// render page | pass flash data
		res.render('signup.ejs', {
			message : req.flash('signupMessage')
		});
	});

	// Process signup form, post function to redirect
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/userhome', // redirect to the secure profile
		// section
		failureRedirect : '/signup', // redirect back to the signup page
		// if there is an error
		failureFlash : true
	// allow flash messages
	}));

	// Profile
	// Note the isLoggedIn call inside the get request verifies session
	app.get('/profile', isLoggedIn, function(req, res) {
		// render page
		res.render('profile.ejs', {
			// extract user from session and pass to template.
			user : req.user
		});
	});

	// userHome, get function to redirect depending on if they are a regular user or an Admin
	app.get('/userhome', isLoggedIn, function(req, res) {
		console.log("Rendering user home");

		var view;
		console.log("What value is in our admin space? " + req.user.admin);
		console
				.log("What value is in our local passowrd"
						+ req.user.localemail);
		if (req.user.admin)
			view = 'adminHome.ejs';
		if (!req.user.admin)
			view = 'userHome.ejs';
		res.render(view, {
			// extract user from session and pass to template.
			user : req.user
		});
	});

	// adminHome, get function to show page if they are admin
	app.get('/adminhome', isLoggedIn, function(req, res) {
		// render page

		res.render('adminHome.ejs', {
			// extract user from session and pass to template.
			user : req.user

		});
	});

	// Logout
	app.get('/logout', function(req, res) {
		// Interact with handler function
		req.logout();
		res.redirect('/');
	});

	// Renders Manage Wishlists Page
	app.get('/manageWishlists', isLoggedIn, checkAdmin, function(req, res) {
		// render page | pass flash data
		res.render('manageWishlists.ejs', {
			message : req.flash('wishlistMessage')
		});
	});

	// Renders Manage Users Page
	app.get('/manageUsers', isLoggedIn, checkAdmin, function(req, res) {
		// render page | pass flash data
		console.log('render manageUser');
		res.render('manageUsers.ejs', {
			message : req.flash('usersMessage')
		});

	});
	
	// Delete All Wishes function
	app.get('/deleteAllWishes', isLoggedIn, checkAdmin, function(req, res) {
		// render page | pass flash data
		console.log('Delete Wishes');
		
		wishListModel.destroy({
			raw : true
			}).then(function(remove) {
			console.log(remove);
			res.json(remove);
		});

	});

	// Retrieve a list of users from DB
	app.get('/retrieveUsers', isLoggedIn, checkAdmin, function(req, res) {

		userModel.findAll({
			raw : true
		}).then(function(users) {
			console.log(users);
			res.json(users);
		});
	});

	// Retrieve a list of wishlists from DB
	app.get('/retrieveWishes', isLoggedIn, checkAdmin, function(req, res) {
		console.log('retrieveWishes');

		retrieveWishes.findAll({
			raw : true
		}).then(function(wish) {
			console.log(wish);
			res.json(wish);
		});
	});
		
	//Retrieve a list of options from DB
	app.get('/retrieveOptions', isLoggedIn, function(req, res) {
		console.log('retrieveOptions');

		optionsModel.findAll({
			raw : true
		}).then(function(options) {
			console.log(options);
			res.json(options);
		});
	});
		
	
	// Delete User Function
	app.get('/deleteUser', isLoggedIn, checkAdmin, function(req, res) {
		console.log(req.query.userId);
		
		userModel.destroy({
			where : {
				id : req.query.userId
			}
		});
		
		res.end();
		res.render('manageUsers.ejs');
	
	});
	
	// Delete a Wish function
	app.get('/deleteWish', isLoggedIn, checkAdmin, function(req, res) {
		console.log(req.query.id);
		wishListModel.destroy({
			where : {
				id : req.query.id
			}
		});
	
	});

	// Create Wishlist Page
	app.get('/createWishlist', isLoggedIn, function(req, res) {
		// render page | pass flash data
		res.render('createWishlist.ejs', {
			message : req.flash('createWishlistMessage')
		});
	});
	
	// Update Password for User
	app.post('/updatePassword', function(req, res) {
		console.log(' UpdatePassword ');
		
		userModel.destroy({
				where : {
					id : req.body.id
					}
			});
		
		var newUser = userModel.build ({
			localemail: req.body.email, 
			localpassword: userModel.generateHash(req.body.password), 
			admin: req.body.userType});	
		
		newUser.save();
	

			res.end();
			res.render('manageUsers.ejs', {
				message : req.flash('manageUsersMessage')
			});	
		
	});
	
	// Update Wish Received on Manage Wishlist Page
	app.post('/updateWishes', function(req, res) {
		console.log(' UpdateWishesPost ' + req.body.WishReceived1 + req.body.wishlistid__c);
		
		wishListModel.update({
			wishreceived1__c : req.body.WishReceived1,
			wishreceived2__c : req.body.WishReceived2,
			wishreceived3__c : req.body.WishReceived3,
			wishreceived4__c : req.body.WishReceived4,
			wishreceived5__c : req.body.WishReceived5,
			donor__c : req.body.Donor},
			{
				where : {
					id : req.body.id
					}
			})

			res.end();
			res.render('manageWishlists.ejs', {
				message : req.flash('manageWishlistsMessage')
			});	
		
	});

	// Update the wishlist reminder information
	app.post('/updateOptions', function(req, res) {
		console.log('Field value');
	
		optionsModel.update({
			wishlist_warning : req.body.wishlist_warning},
			{
				where : {
					id : req.body.id
					}
			})

			res.end();
			res.render('adminHome.ejs', {
				message : req.flash('adminHomeMessage')
			});	
		
	});
	
	// Create Wish in Database
	app.post('/add-wish', function(req, res) {
		console.log('Field value');
	
		// Create Child Model Fields
		wishListModel.create({
			firstname__c : req.body.FirstName,
			lastinitial__c : req.body.LastInitial,
			age__c : req.body.Age,
			gender__c : req.body.Gender,
			placementtype__c : req.body.PlacementType,
			placementname__c : req.body.PlacementName.join(''),
			caseworker__c : req.body.CaseWorker,
			shirtsize__c : req.body.ShirtSize,
			shirtsizetype__c : req.body.ShirtSizeType,
			pantsize__c : req.body.PantSize,
			pantsizetype__c : req.body.PantSizeType,
			dresssize__c : req.body.DressSize,
			dresssizetype__c : req.body.DressSizeType,
			shoesize__c : req.body.ShoeSize,
			shoesizetype__c : req.body.ShoeSizeType,
			favcolor__c : req.body.FavColor,
			favsportteam__c : req.body.FavSportTeam,
			favbook__c : req.body.FavBook,
			favmovieshow__c : req.body.FavMovieShow,
			favhobby__c : req.body.FavHobby,
			favmusician__c : req.body.FavMusician,
			wishdescription1__c : req.body.wishDescription1,
			wishreceived1__c : null,
			wishdescription2__c : req.body.wishDescription2,
			wishreceived2__c : null,
			wishdescription3__c : req.body.wishDescription3,
			wishreceived3__c : null,
			wishdescription4__c : req.body.wishDescription4,
			wishreceived4__c : null,
			wishdescription5__c : req.body.wishDescription5,
			wishreceived5__c : null,
			enteredby__c : req.body.EnteredBy,
			donor__c : null
		}).then(function(data){
			console.log(data)			
		}).catch(function(error){
			//error
		});
		
		res.end();
		res.render('createWishlist.ejs');
		
	});

	// Route for Create User
	app.route('/createUser').get(isLoggedIn, checkAdmin, function(req, res) {
		// render page | pass flash data
		res.render('createUser.ejs', {
			message : req.flash('createUserMessage')
		});
	}).post(passport.authenticate('local-AccountCreation', {
		successRedirect : '/manageUsers', // redirect to the secure profile
		// section
		failureRedirect : '/createUser', // redirect back to the signup page
		// if there is an error
		failureFlash : true
	// allow flash messages
	}));

	// Account Details Page
	app.get('/accountDetails', isLoggedIn, function(req, res) {
		// render page | pass flash data
		res.render('accountDetails.ejs', {
			message : req.flash('accountDetailsMessage')
		});
	});

	// Verify if user is logged on
	function isLoggedIn(req, res, next) {

		console.log("Is user Logged in?");
		// if user is auth. Carry ON GOOD SIR.
		if (req.isAuthenticated()) {
			console.log("User Authenticated");
			return next();
		}
		// if user is not auth. BANISH THEM
		console.log("Redirecting User back, NOT AUTHENTICATED")
		res.redirect('/');
	}
	// Verify admin or reg. user.
	function checkAdmin(req, res, next) {

		if (req.user.admin == true)
			return next();
		res.redirect('/userhome');
	}

};