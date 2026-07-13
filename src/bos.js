function analyzeBOS(currentPrice, market) {

  let direction = "None";
  let level = null;
  let status = "Waiting";


  // ==========================
  // Bearish BOS
  // Break Last Swing Low
  // ==========================

  if (
    market.swingLow &&
    currentPrice < market.swingLow.price
  ) {

    direction = "Bearish";
    level = market.swingLow.price;
    status = "Confirmed";

  }


  // ==========================
  // Bullish BOS
  // Break Last Swing High
  // ==========================

  else if (
    market.swingHigh &&
    currentPrice > market.swingHigh.price
  ) {

    direction = "Bullish";
    level = market.swingHigh.price;
    status = "Confirmed";

  }


  return {

    direction,
    level,
    status

  };

}


module.exports = {
  analyzeBOS
};
