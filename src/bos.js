function analyzeBOS(currentPrice, market, atr) {

  let direction = "None";
  let level = null;
  let status = "Waiting";
  let strength = "Weak";


  const minBreak = atr ? atr * 0.5 : 0;


  // ==========================
  // Bearish BOS
  // ==========================

  if (market.swingLow) {

    const breakDown =
      market.swingLow.price - currentPrice;


    if (breakDown > minBreak) {

      direction = "Bearish";
      level = market.swingLow.price;
      status = "Confirmed";


      if (breakDown > atr) {
        strength = "Strong";
      }

    }

  }



  // ==========================
  // Bullish BOS
  // ==========================

  if (market.swingHigh) {

    const breakUp =
      currentPrice - market.swingHigh.price;


    if (breakUp > minBreak) {

      direction = "Bullish";
      level = market.swingHigh.price;
      status = "Confirmed";


      if (breakUp > atr) {
        strength = "Strong";
      }

    }

  }



  return {

    direction,
    level,
    status,
    strength

  };

}



module.exports = {
  analyzeBOS
};
