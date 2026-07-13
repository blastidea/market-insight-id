function analyzeStructure(candles) {

  if (!candles || candles.length < 20) {
    return {
      swingHigh: null,
      swingLow: null,
      prevHigh: null,
      prevLow: null,
      swingHighs: [],
      swingLows: [],
      totalSwingHigh: 0,
      totalSwingLow: 0,
      structure: "Unknown",
      bias: "Unknown"
    };
  }

  // Twelve Data: candle terbaru di index 0
  // Dibalik agar urut dari lama -> baru
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

  const lastHigh = swingHighs.at(-1) || null;
  const prevHigh = swingHighs.at(-2) || null;

  const lastLow = swingLows.at(-1) || null;
  const prevLow = swingLows.at(-2) || null;

  let structure = "Range";
  let bias = "Neutral";

  if (lastHigh && prevHigh && lastLow && prevLow) {

    const HH = lastHigh.price > prevHigh.price;
    const LH = lastHigh.price < prevHigh.price;

    const HL = lastLow.price > prevLow.price;
    const LL = lastLow.price < prevLow.price;

    if (HH && HL) {
      structure = "HH-HL";
      bias = "Bullish";
    }
    else if (LH && LL) {
      structure = "LH-LL";
      bias = "Bearish";
    }
    else if (HH && LL) {
      structure = "Expansion";
      bias = "Neutral";
    }
    else if (LH && HL) {
      structure = "Compression";
      bias = "Neutral";
    }

  }

  return {

    // Swing terakhir
    swingHigh: lastHigh,
    swingLow: lastLow,

    // Swing sebelumnya
    prevHigh,
    prevLow,

    // Semua swing
    swingHighs,
    swingLows,

    totalSwingHigh: swingHighs.length,
    totalSwingLow: swingLows.length,

    structure,
    bias

  };

}

module.exports = {
  analyzeStructure
};
