const axios = require("axios");
const config = require("./config");

async function getCandles() {
  const url =
    `https://api.twelvedata.com/time_series` +
    `?symbol=${encodeURIComponent(config.symbol)}` +
    `&interval=${config.interval}` +
    `&outputsize=${config.outputSize}` +
    `&apikey=${config.apiKey}`;

  const response = await axios.get(url);

  return response.data;
}

module.exports = {
  getCandles
};
