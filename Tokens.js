'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');

// Try different roles to test authorization
const payload = {
  id: 1,
  username: 'adminUser',
  roles: ['user']   // <-- Change this later to ['user']
};

const token = jwt.sign(payload, process.env.JWT_SECRET, {
  algorithm: 'HS256',
  expiresIn: '20m'
});

console.log('TOKEN:', token)