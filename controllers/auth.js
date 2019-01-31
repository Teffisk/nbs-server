require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');

// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
  // Debug statements; remove when no longer needed
  console.log('In the POST /auth/login route');
  console.log(req.body);

  // find out if the user's email is in the db
  db.User.findOne({ email: req.body.email })
  .then(user => {
  	//Make sure there's a user and password
  	if(!user || !user.password){
  		return res.status(400).send('User not found.');
  	}
  	//The User exists, now check the password
  	if(!user.isAuthenticated(req.body.password)){
  		return status(401).send('Invalid Credentials')
  	}
  	//Valid user; passed authentication. Need to make them a token.
  	const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
  		expiresIn: 60 * 60 * 24 // is equal to 24hrs in seconds
	});
	//Send the token
	res.send({ token: token })
  })
  .catch(err => {
  	console.log('Error in the POST /auth/login route when finding user');
  	res.status(503).send('Database Error');
  })
});

// POST /auth/signup route - create a user in the DB and then log them in
router.post('/signup', (req, res) => {
  // Debug statements; remove when no longer needed
  console.log('In the POST /auth/signup route');
  console.log(req.body);

  db.User.findOne({ email: req.body.email })
  .then(user =>{
  	if(user){
  		//if the user exists, don't let them create a duplicate account
  		return res.status(409).send('Email already in use.')
  	} else {
  		// Good the email is new and unique
  		db.User.create(req.body)
  		.then(createdUser => {
  			// We created a new user. Let's create and send a token for them.
  			const token = jwt.sign(createdUser.toJSON(), process.env.JWT_SECRET, {
  				expiresIn: 60 * 60 * 24 // is equal to 24hrs in seconds
  			});
  			res.send({ token: token })
  		})
  		.catch(err => {
  			console.log('Error in the POST auth/signup when creating a new user.', err);
  			res.status(500).send('Database error!')
  		})
  	}
  })
  .catch(err => {
  	console.log('Error in POST /auth/signup', err);
  	res.status(503).send('Database error. Make an error.ejs');
  })
});

// This is what is returned when client queries for new user data
router.post('/current/user', (req, res) => {
  db.User.findById(req.user.id)
  .then(user => {
  	res.send({ user: user });
  })
  .catch(err => {
  	console.log('Error in the GET /auth/current/user route:', err);
  	res.status(503).send({ user: null });
  })
});

module.exports = router;






















