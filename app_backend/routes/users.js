const express = require('express');
const router = express.Router();
const users = require('../services/users');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await users.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
});

/* POST users */
router.post('/', async function(req, res, next) {
  try {
    res.json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while posting users `, err.message);
    next(err);
  }
});

module.exports = router;
