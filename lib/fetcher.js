const axios = require('axios');
const headers = require('../req-headers.json');

const linkedinFetcher = axios.create({
  baseURL: 'https://www.linkedin.com/',
  headers,
});

module.exports = { linkedinFetcher }
