function filterMajorSwings(swings, type, atr) {

  if (!swings || swings.length < 2) {
    return swings;
  }

  // Minimal jarak antar swing berdasarkan ATR
  const minDistance = atr ? atr * 1.5 : 10;

  const filtered = [];

  for (const current of swings) {

    if (filtered.length === 0) {
      filtered.push(current);
      continue;
    }

    const last = filtered[filtered.length - 1];

    const distance = Math.abs(current.price - last.price);

    // Jika terlalu dekat, pilih swing yang lebih ekstrem
    if (distance < minDistance) {

      if (type === "high") {

        if (current.price > last.price) {
          filtered[filtered.length - 1] = current;
        }

      } else {

        if (current.price < last.price) {
          filtered[filtered.length - 1] = current;
        }

      }

    } else {

      filtered.push(current);

    }

  }

  return filtered;

}

function analyzeStructure(candles, atr) {

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
  // Dibalik agar urut dari lama ke baru
  const history = [...candles].reverse();

  const lookback = 3;

  const swingHighs = [];
  const swingLows = [];

  // ==========================
  // Cari Swing High & Swing Low
  // ==========================
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

  // ==========================
  // Filter Major Swing
  // ==========================
  const majorHighs = filterMajorSwings(
    swingHighs,
    "high",
    atr
  );

  const majorLows = filterMajorSwings(
    swingLows,
    "low",
    atr
  );

  const lastHigh = majorHighs.at(-1) || null;
  const prevHigh = majorHighs.at(-2) || null;

  const lastLow = majorLows.at(-1) || null;
  const prevLow = majorLows.at(-2) || null;

  // ==========================
  // Market Structure
  // ==========================
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

    } else if (LH && LL) {

      structure = "LH-LL";
      bias = "Bearish";

    } else if (HH && LL) {

      structure = "Expansion";
      bias = "Neutral";

    } else if (LH && HL) {

      structure = "Compression";
      bias = "Neutral";

    }

  }

  return {

    // Major Swing terakhir
    swingHigh: lastHigh,
    swingLow: lastLow,

    // Major Swing sebelumnya
    prevHigh,
    prevLow,

    // Semua Major Swing
    swingHighs: majorHighs,
    swingLows: majorLows,

    totalSwingHigh: majorHighs.length,
    totalSwingLow: majorLows.length,

    structure,
    bias

  };

}

module.exports = {
  analyzeStructure
};
