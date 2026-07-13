function analyzeBOS(currentPrice, market, atr) {

  let direction = "None";
  let level = null;
  let status = "Waiting";
  let strength = "Weak";

  if (
    currentPrice == null ||
    !market ||
    !market.prevHigh ||
    !market.prevLow ||
    !market.swingHigh ||
    !market.swingLow
  ) {

    return {
      direction,
      level,
      status,
      strength
    };

  }

  currentPrice = Number(currentPrice);

  const minBreak =
    atr
      ? atr * 0.30
      : 3;

  // ==========================
  // Bullish BOS
  // Higher High + harga sudah break
  // ==========================

  if (
    market.swingHigh.price > market.prevHigh.price &&
    currentPrice > market.prevHigh.price
  ) {

    const distance =
      currentPrice -
      market.prevHigh.price;

    if (distance >= minBreak) {

      direction = "Bullish";
      level = market.prevHigh.price;
      status = "Confirmed";

      strength =
        distance >= atr
          ? "Strong"
          : "Normal";

    }

  }

  // ==========================
  // Bearish BOS
  // Lower Low + harga sudah break
  // ==========================

  if (
    market.swingLow.price < market.prevLow.price &&
    currentPrice < market.prevLow.price
  ) {

    const distance =
      market.prevLow.price -
      currentPrice;

    if (distance >= minBreak) {

      direction = "Bearish";
      level = market.prevLow.price;
      status = "Confirmed";

      strength =
        distance >= atr
          ? "Strong"
          : "Normal";

    }

  }

  // ==========================
  // Expansion
  // HH + LL sama-sama terjadi
  // ==========================

  const bullishExpansion =
    market.swingHigh.price > market.prevHigh.price &&
    currentPrice > market.prevHigh.price;

  const bearishExpansion =
    market.swingLow.price < market.prevLow.price &&
    currentPrice < market.prevLow.price;

  if (
    bullishExpansion &&
    bearishExpansion
  ) {

    const midpoint =
      (
        market.prevHigh.price +
        market.prevLow.price
      ) / 2;

    if (currentPrice < midpoint) {

      direction = "Bearish";
      level = market.prevLow.price;

    } else {

      direction = "Bullish";
      level = market.prevHigh.price;

    }

    status = "Confirmed";
    strength = "Strong";

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
