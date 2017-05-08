// server.js
// Lightweight and can handle multiple simultaneous requests.

// *** Setup and Modules ****


// Load express module
var express = require('express');

// Create an express application.
var app = express();

// Use the environments provided port.
// If Port not available use port 808*.
var port = process.env.PORT || 8080;

// Load sequelize
var Sequelize = require('sequelize');

// Load pg
var pg = require('pg').native;

// Load pghstore
var pghstore = require('pg-hstore');

//Load database.js module
var configDB = require('./config/database.js');

// Load sequelize with config
var sequelize = new Sequelize(configDB.url);

// Test Connection
sequelize.authenticate().then(function(err){
	console.log('Connection has been established successfully.');
})
.catch(function(err){
	console.log('Unable to connect to database:' + err);
});

// Associate the model
var User = sequelize.import('./models/user.js'); 
var wishListModel = sequelize.import('./models/wishlist__c.js');
var optionsModel = sequelize.import('./models/options.js');

// Load passport module | Authentication middleware for Node.js
var passport = require('passport');

// Load connect-flash module | Allows session messages.
var flash = require('connect-flash');

// Load morgan module | HTTP request logger
var morgan = require('morgan');

// Load cookieParser | Parses/populates cookies
var cookieParser = require('cookie-parser');

// Load bodyParser | Parses incoming requests
var bodyParser = require('body-parser');

// Load express-session | Allows client sessions
var session = require('express-session');

require('./config/passport')(passport);

// *** Setup Express ***
// app.use mounts specified middleware functions.

// Log requests to console
app.use(morgan('dev'));

// read cookies for auth
app.use(cookieParser());

// receive information from html forms
app.use(bodyParser());

// Use template engine to separate program-logic and presentation into two
// separate parts. Thus we can separate the presentation(=view) from the
// logic(=model). Extends functionality of html
app.set('view engine', 'ejs');

// session secret to compute hash
app.use(session({
	secret : 'ILoveCatsCatsCats'
}));

// Initialize passport middleware to authenticate requests.
app.use(passport.initialize());

// create a persistent login session
app.use(passport.session());


//Allows use of flash messages stored in session.
app.use(flash());

//
app.use(express.static(__dirname + '/views'));

// *** Routes ***
// How we respond to client requests
// Load routes.js | pass in our application and passport)
require('./routes.js')(app, passport);

// *** LAUNCH THE APPLICATION ***
app.listen(port);

// On error.
console.log('Listening on port ' + port);
