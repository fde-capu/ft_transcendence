const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT id, intra_login FROM users OFFSET $1 LIMIT $2', 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

function validateCreate(user) {
  let messages = [];

  console.log(user);

  if (!user) {
    messages.push('No object is provided');
  }

  if (!user.user) {
    messages.push('Quote is empty');
  }

  if (!user.author) {
    messages.push('Author is empty');
  }

  if (user.user && user.user.length > 255) {
    messages.push('Quote cannot be longer than 255 characters');
  }

  if (user.author && user.author.length > 255) {
    messages.push('Author name cannot be longer than 255 characters');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

async function create(user) {
  validateCreate(user);

  const result = await db.query(
    'INSERT INTO user(user, author) VALUES ($1, $2) RETURNING *',
    [user.user, user.author]
  );
  let message = 'Error in creating user';

  if (result.length) {
    message = 'Quote created successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create
}
