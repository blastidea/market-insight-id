const axios = require("axios");
const config = require("./config");

async function getCandles() {
  try {

    const url =
      `https://api.twelvedata.com/time_series` +
      `?symbol=${encodeURIComponent(config.symbol)}` +
      `&interval=${config.interval}` +
      `&outputsize=${config.outputSize}` +
      `&apikey=${config.apiKey}`;

    const response = await axios.get(url);

    const raw = response.data;

    if (raw.status === "error") {
      return raw;
    }

    return {
      symbol: raw.meta.symbol,
      interval: raw.meta.interval,
      candles: raw.values.length,
      latest: raw.values[0],
      history: raw.values
    };

  } catch (err) {

    if (err.response) {
      return err.response.data;
    }

    throw err;
  }
}

module.exports = {
  getCandles
};
