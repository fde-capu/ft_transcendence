const express = require('express');
const login = express();

login.get('/', async function(req, res, next) {
	res.send('Login page goes here.');
});

module.exports = login;
