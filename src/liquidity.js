function analyzeLiquidity(candles, market, bos, atr) {

  let type = "None";
  let level = null;
  let status = "Waiting";
  let strength = "Weak";


  if (!candles || candles.length < 10) {
    return {
      type,
      level,
      status,
      strength
    };
  }


  const current = candles[0];

  const currentHigh = Number(current.high);
  const currentLow = Number(current.low);
  const currentClose = Number(current.close);


  const buffer = atr ? atr * 0.5 : 0;



  // ==========================
  // Sell Side Liquidity Sweep
  // Sweep bawah swing low
  // ==========================

  if (market.swingLow) {

    const lowLevel = market.swingLow.price;


    if (
      currentLow < lowLevel &&
      currentClose > lowLevel
    ) {

      type = "Sell Side";
      level = lowLevel;
      status = "Detected";


      if (
        lowLevel - currentLow > buffer
      ) {
        strength = "Strong";
      }

    }

  }



  // ==========================
  // Buy Side Liquidity Sweep
  // Sweep atas swing high
  // ==========================

  if (market.swingHigh) {

    const highLevel = market.swingHigh.price;


    if (
      currentHigh > highLevel &&
      currentClose < highLevel
    ) {

      type = "Buy Side";
      level = highLevel;
      status = "Detected";


      if (
        currentHigh - highLevel > buffer
      ) {
        strength = "Strong";
      }

    }

  }



  return {

    type,
    level,
    status,
    strength

  };

}



module.exports = {
  analyzeLiquidity
};
