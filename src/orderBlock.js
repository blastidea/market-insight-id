function analyzeOrderBlock(candles, bos, atr) {

  let type = "None";
  let high = null;
  let low = null;
  let status = "Waiting";
  let strength = "Weak";
  let datetime = null;


  if (!candles || candles.length < 10) {

    return {
      type,
      high,
      low,
      status,
      strength,
      datetime
    };

  }


  const history = [...candles].reverse();


  const range = atr ? atr : 0;



  // ==========================
  // Bearish Order Block
  // Candle bullish terakhir
  // sebelum impuls turun
  // ==========================

  if (bos.direction === "Bearish") {


    for (let i = history.length - 2; i >= 1; i--) {


      const current = history[i];
      const next = history[i + 1];


      const open = Number(current.open);
      const close = Number(current.close);

      const nextClose = Number(next.close);



      // Candle bullish
      if (close > open) {


        // Candle berikutnya turun kuat
        if (nextClose < close - range) {


          type = "Bearish";
          high = Number(current.high);
          low = Number(current.low);
          datetime = current.datetime;
          status = "Valid";


          if (
            close - open > range
          ) {
            strength = "Strong";
          } else {
            strength = "Normal";
          }


          break;

        }

      }

    }

  }





  // ==========================
  // Bullish Order Block
  // Candle bearish terakhir
  // sebelum impuls naik
  // ==========================

  if (bos.direction === "Bullish") {


    for (let i = history.length - 2; i >= 1; i--) {


      const current = history[i];
      const next = history[i + 1];


      const open = Number(current.open);
      const close = Number(current.close);

      const nextClose = Number(next.close);



      // Candle bearish
      if (close < open) {


        // Candle berikutnya naik kuat
        if (nextClose > close + range) {


          type = "Bullish";
          high = Number(current.high);
          low = Number(current.low);
          datetime = current.datetime;
          status = "Valid";


          if (
            open - close > range
          ) {
            strength = "Strong";
          } else {
            strength = "Normal";
          }


          break;

        }

      }

    }

  }



  return {

    type,
    high,
    low,
    status,
    strength,
    datetime

  };

}



module.exports = {
  analyzeOrderBlock
};
