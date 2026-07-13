function analyzeBOS(currentPrice, market, atr) {

  let direction = "None";
  let level = null;
  let status = "Waiting";
  let strength = "Weak";

  if (
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

  const minBreak =
    atr
      ? atr * 0.3
      : 3;

  // ==========================
  // Bullish BOS
  // ==========================

  if (

    market.swingHigh.price >
    market.prevHigh.price

  ) {

    const distance =
      market.swingHigh.price -
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
  // ==========================

  if (

    market.swingLow.price <
    market.prevLow.price

  ) {

    const distance =
      market.prevLow.price -
      market.swingLow.price;

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
  // Jika keduanya terjadi
  // ==========================

  if (

    market.swingHigh.price >
    market.prevHigh.price &&

    market.swingLow.price <
    market.prevLow.price

  ) {

    if (
      currentPrice <
      (
        market.prevHigh.price +
        market.prevLow.price
      ) / 2
    ) {

      direction = "Bearish";

      level =
        market.prevLow.price;

    } else {

      direction = "Bullish";

      level =
        market.prevHigh.price;

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
