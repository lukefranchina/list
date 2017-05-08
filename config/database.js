// database.js: Database connection configuration for server.js.

// For local development db use your SPECIFIC local psql information.
// For remote development db use the HEROKU psql connection infromation.

// Export our module for the server.js file. 
module.exports = {
	// Local db (Uncomment to use / Comment when not in use.)
	'url' : 'postgres://force:changeme!@localhost:5432/force'
	// Remote db (Uncomment to use / Comment when not in use.)
	//'url' : 'postgres://trriekipervhpa:yElY5DyRvGu3ZTJ1yXRuc5QiUd@ec2-23-23-237-146.compute-1.amazonaws.com:5432/dddqfpo8b7m1hh',

};