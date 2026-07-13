function analyzeStructure(candles) {

  if (!candles || candles.length < 20) {
    return {
      swingHigh: null,
      swingLow: null,
      prevHigh: null,
      prevLow: null,
      totalSwingHigh: 0,
      totalSwingLow: 0,
      structure: "Unknown",
      bias: "Unknown"
    };
  }

  // Twelve Data: candle terbaru di index 0
  const history = [...candles].reverse();

  const lookback = 3;

  const swingHighs = [];
  const swingLows = [];

  for (let i = lookback; i < history.length - lookback; i++) {

    const currentHigh = Number(history[i].high);
    const currentLow = Number(history[i].low);

    let isSwingHigh = true;
    let isSwingLow = true;

    for (let j = 1; j <= lookback; j++) {

      if (
        currentHigh <= Number(history[i - j].high) ||
        currentHigh <= Number(history[i + j].high)
      ) {
        isSwingHigh = false;
      }

      if (
        currentLow >= Number(history[i - j].low) ||
        currentLow >= Number(history[i + j].low)
      ) {
        isSwingLow = false;
      }

    }

    if (isSwingHigh) {
      swingHighs.push({
        price: currentHigh,
        datetime: history[i].datetime
      });
    }

    if (isSwingLow) {
      swingLows.push({
        price: currentLow,
        datetime: history[i].datetime
      });
    }

  }

  const lastHigh = swingHighs[swingHighs.length - 1] || null;
  const prevHigh = swingHighs[swingHighs.length - 2] || null;

  const lastLow = swingLows[swingLows.length - 1] || null;
  const prevLow = swingLows[swingLows.length - 2] || null;

  let structure = "Range";
  let bias = "Neutral";

  if (lastHigh && prevHigh && lastLow && prevLow) {

    const higherHigh = lastHigh.price > prevHigh.price;
    const lowerHigh = lastHigh.price < prevHigh.price;

    const higherLow = lastLow.price > prevLow.price;
    const lowerLow = lastLow.price < prevLow.price;

    if (higherHigh && higherLow) {
      structure = "HH-HL";
      bias = "Bullish";
    }
    else if (lowerHigh && lowerLow) {
      structure = "LH-LL";
      bias = "Bearish";
    }
    else if (higherHigh && lowerLow) {
      structure = "Expansion";
      bias = "Neutral";
    }
    else if (lowerHigh && higherLow) {
      structure = "Compression";
      bias = "Neutral";
    }

  }

  return {

    swingHigh: lastHigh,
    swingLow: lastLow,

    prevHigh,
    prevLow,

    totalSwingHigh: swingHighs.length,
    totalSwingLow: swingLows.length,

    structure,
    bias

  };

}

module.exports = {
  analyzeStructure
};
