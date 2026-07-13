function filterMajorSwings(swings, type, atr) {

  if (!swings || swings.length < 2) {
    return [...(swings || [])];
  }

  // ==========================
  // Adaptive ATR Filter
  // ==========================

  const minDistance =
    atr
      ? Math.max(atr * 0.8, 5)
      : 5;

  const filtered = [];

  for (const current of swings) {

    if (filtered.length === 0) {

      filtered.push(current);
      continue;

    }

    const last =
      filtered[filtered.length - 1];

    const distance =
      Math.abs(current.price - last.price);

    if (distance < minDistance) {

      if (type === "high") {

        if (current.price > last.price) {

          filtered[filtered.length - 1] =
            current;

        }

      } else {

        if (current.price < last.price) {

          filtered[filtered.length - 1] =
            current;

        }

      }

    } else {

      filtered.push(current);

    }

  }

  return filtered;

}

function analyzeStructure(
  candles,
  atr
) {

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

  const history =
    [...candles].reverse();

  // lebih sensitif untuk H1

  const lookback = 2;

  const swingHighs = [];
  const swingLows = [];

  // ==========================
  // Detect Swing
  // ==========================

  for (
    let i = lookback;
    i < history.length - lookback;
    i++
  ) {

    const currentHigh =
      Number(history[i].high);

    const currentLow =
      Number(history[i].low);

    let isSwingHigh = true;
    let isSwingLow = true;

    for (
      let j = 1;
      j <= lookback;
      j++
    ) {

      if (

        currentHigh <= Number(history[i-j].high) ||

        currentHigh <= Number(history[i+j].high)

      ) {

        isSwingHigh = false;

      }

      if (

        currentLow >= Number(history[i-j].low) ||

        currentLow >= Number(history[i+j].low)

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
  // Major Swing Filter
  // ==========================

  const majorHighs =
    filterMajorSwings(
      swingHighs,
      "high",
      atr
    );

  const majorLows =
    filterMajorSwings(
      swingLows,
      "low",
      atr
    );

  // ==========================
  // Fallback
  // ==========================

  if (
    majorHighs.length < 2 &&
    swingHighs.length >= 2
  ) {

    majorHighs.push(
      ...swingHighs.slice(-2)
    );

  }

  if (
    majorLows.length < 2 &&
    swingLows.length >= 2
  ) {

    majorLows.push(
      ...swingLows.slice(-2)
    );

  }

  const lastHigh =
    majorHighs.at(-1) || null;

  const prevHigh =
    majorHighs.at(-2) || null;

  const lastLow =
    majorLows.at(-1) || null;

  const prevLow =
    majorLows.at(-2) || null;

  // ==========================
  // Structure
  // ==========================

  let structure = "Range";
  let bias = "Neutral";

  if (
    lastHigh &&
    prevHigh &&
    lastLow &&
    prevLow
  ) {

    const HH =
      lastHigh.price > prevHigh.price;

    const LH =
      lastHigh.price < prevHigh.price;

    const HL =
      lastLow.price > prevLow.price;

    const LL =
      lastLow.price < prevLow.price;

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

  // ==========================
  // DEBUG
  // ==========================

  console.log("");
  console.log("DEBUG STRUCTURE");
  console.log("----------------------------");
  console.log("Raw High      :", swingHighs.length);
  console.log("Raw Low       :", swingLows.length);
  console.log("Major High    :", majorHighs.length);
  console.log("Major Low     :", majorLows.length);

  return {

    swingHigh: lastHigh,
    swingLow: lastLow,

    prevHigh,
    prevLow,

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
