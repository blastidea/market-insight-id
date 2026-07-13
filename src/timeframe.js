// src/timeframe.js
// Multi Timeframe Data Loader v1.0


const { getCandles } = require("./market");


async function loadTimeframe(interval){


  const data = await getCandles(interval);


  if(data.status === "error"){

    return {

      interval,
      status:"error"

    };

  }


  return {

    interval,

    status:"ready",

    symbol:data.symbol,

    latest:data.latest,

    history:data.history

  };


}



async function getMultiTimeframe(){


  const H4 = await loadTimeframe("4h");

  const H1 = await loadTimeframe("1h");

  const M30 = await loadTimeframe("30min");

  const M15 = await loadTimeframe("15min");

  const M5 = await loadTimeframe("5min");



  return {

    H4,

    H1,

    M30,

    M15,

    M5

  };


}



module.exports = {

  loadTimeframe,

  getMultiTimeframe

};
