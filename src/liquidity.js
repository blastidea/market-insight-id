function analyzeLiquidity(candles, market, bos, atr) {

  let type = "None";
  let level = null;
  let status = "Waiting";
  let strength = "Weak";
  let candle = null;


  if (!candles || candles.length < 10) {

    return {
      type,
      level,
      status,
      strength,
      candle
    };

  }


  // Scan 10 candle terbaru
  const recent = candles.slice(0, 10);


  const buffer = atr ? atr * 0.5 : 0;



  // ==========================
  // Sell Side Liquidity Sweep
  // Sweep bawah swing low
  // ==========================

  if (market.swingLow) {

    const lowLevel = market.swingLow.price;


    for (const item of recent) {

      const high = Number(item.high);
      const low = Number(item.low);
      const close = Number(item.close);


      if (
        low < lowLevel &&
        close > lowLevel
      ) {

        type = "Sell Side";
        level = lowLevel;
        status = "Detected";
        candle = item.datetime;


        if (
          lowLevel - low > buffer
        ) {
          strength = "Strong";
        }


        break;

      }

    }

  }




  // ==========================
  // Buy Side Liquidity Sweep
  // Sweep atas swing high
  // ==========================

  if (market.swingHigh && type === "None") {

    const highLevel = market.swingHigh.price;


    for (const item of recent) {

      const high = Number(item.high);
      const low = Number(item.low);
      const close = Number(item.close);


      if (
        high > highLevel &&
        close < highLevel
      ) {

        type = "Buy Side";
        level = highLevel;
        status = "Detected";
        candle = item.datetime;


        if (
          high - highLevel > buffer
        ) {
          strength = "Strong";
        }


        break;

      }

    }

  }



  return {

    type,
    level,
    status,
    strength,
    candle

  };

}



module.exports = {
  analyzeLiquidity
};
