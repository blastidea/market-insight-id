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



    if(raw.status === "error"){

      return {

        status:"error",

        message:raw.message || "API Error"

      };

    }



    if(
      !raw.values ||
      raw.values.length === 0
    ){

      return {

        status:"error",

        message:"No candle data"

      };

    }



    // ==========================
    // Normalize Candle Data
    // ==========================

    const candles =
    raw.values.map(candle => ({

      datetime:candle.datetime,

      open:Number(candle.open),

      high:Number(candle.high),

      low:Number(candle.low),

      close:Number(candle.close),

      volume:Number(candle.volume || 0)

    }));




    // TwelveData biasanya newest dulu
    // pastikan urutan benar

    candles.sort(
      (a,b)=>
      new Date(b.datetime)
      -
      new Date(a.datetime)
    );




    return {


      status:"ready",


      symbol:
      raw.meta.symbol,


      interval:
      raw.meta.interval,


      candles:
      candles.length,


      latest:
      candles[0],


      history:
      candles


    };



  } catch(err){


    if(err.response){

      return {

        status:"error",

        message:
        err.response.data

      };

    }


    return {

      status:"error",

      message:
      err.message

    };


  }

}



module.exports = {

  getCandles

};
