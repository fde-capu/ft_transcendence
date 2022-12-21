const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT id, intra_id FROM users OFFSET $1 LIMIT $2', 
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

  console.log("Validating json for new user:", user);

  if (!user) {
    messages.push('No object is provided');
  }

  if (!user.intra_id) {
    messages.push('Intra ID is empty');
  }

  if (user.intra_id && user.intra_id.length > 255) {
    messages.push('Username cannot be longer than 255 characters');
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
    'INSERT INTO users (intra_id) VALUES ($1) RETURNING *',
    [user.intra_id]
  );
  let message = 'Error in creating user';

  if (result.length) {
    message = 'User created successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create
}
