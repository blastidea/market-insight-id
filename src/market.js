// src/market.js
// Market Data Engine v1.1
// Support Multi Timeframe


const axios = require("axios");
const config = require("./config");


async function getCandles(interval = config.interval) {

  try {


    const url =
      `https://api.twelvedata.com/time_series` +
      `?symbol=${encodeURIComponent(config.symbol)}` +
      `&interval=${interval}` +
      `&outputsize=${config.outputSize}` +
      `&apikey=${config.apiKey}`;



    const response = await axios.get(url);


    const raw = response.data;



    if (raw.status === "error") {

      return raw;

    }



    return {

      status:"ready",

      symbol: raw.meta.symbol,

      interval: raw.meta.interval,

      candles: raw.values.length,


      latest: {

        datetime: raw.values[0].datetime,

        open: Number(raw.values[0].open),

        high: Number(raw.values[0].high),

        low: Number(raw.values[0].low),

        close: Number(raw.values[0].close)

      },


      history: raw.values.map(candle => ({

        datetime:candle.datetime,

        open:Number(candle.open),

        high:Number(candle.high),

        low:Number(candle.low),

        close:Number(candle.close)

      }))


    };



  } catch(err){


    if(err.response){

      return err.response.data;

    }


    throw err;


  }

}



module.exports = {

  getCandles

};
