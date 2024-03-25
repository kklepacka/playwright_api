// setup-auth.js
require('dotenv').config(); // If you need to load existing .env variables first
const fs = require('fs');
const path = require('path');

const username = `HROTFNARIQQXNSTBIOIWFEUYJYHXRMIH`;
const encodedCredentials = Buffer.from(`${username}:`).toString('base64');

// Optionally write to a .env file for later use
const envVariables = `TEST_BASIC_AUTH=${encodedCredentials}\n`;
fs.writeFileSync(path.join(__dirname, '.env'), envVariables, { flag: 'a' });

// Set the environment variable for the current process
process.env.TEST_BASIC_AUTH = encodedCredentials;

console.log('Authentication setup complete.');