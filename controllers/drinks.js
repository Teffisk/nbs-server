require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../models');
//const jwt = require('jsonwebtoken');

// add a new drink to your list
router.post('/new', (req, res) => {
	db.Drink.create(req.body)
	.then(drink => {
		res.send({ drink: drink })
	})
	.catch(err => {
		console.log('Error in the /drinks/new ')
	})
})