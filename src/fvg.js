function analyzeFVG(
  candles,
  atr
) {

  if (!candles || candles.length < 5) {

    return {
      type: "None",
      high: null,
      low: null,
      status: "Not Found",
      strength: "Weak",
      filled: false,
      score: 0,
      datetime: null
    };

  }


  // candle terbaru index 0
  const history = [...candles].reverse();


  let fvg = null;



  // ==========================
  // Scan 3 Candle Imbalance
  // ==========================

  for (
    let i = 1;
    i < history.length - 1;
    i++
  ) {


    const prev = history[i - 1];
    const middle = history[i];
    const next = history[i + 1];


    const prevHigh = Number(prev.high);
    const prevLow = Number(prev.low);

    const nextHigh = Number(next.high);
    const nextLow = Number(next.low);



    // ==========================
    // Bullish FVG
    // Candle 3 low > candle 1 high
    // ==========================

    if (
      nextLow > prevHigh
    ) {


      fvg = {

        type: "Bullish",

        high: nextLow,

        low: prevHigh,

        datetime: middle.datetime

      };


    }



    // ==========================
    // Bearish FVG
    // Candle 3 high < candle 1 low
    // ==========================

    if (
      nextHigh < prevLow
    ) {


      fvg = {

        type: "Bearish",

        high: prevLow,

        low: nextHigh,

        datetime: middle.datetime

      };


    }


  }



  if (!fvg) {

    return {

      type: "None",
      high: null,
      low: null,
      status: "Not Found",
      strength: "Weak",
      filled: false,
      score: 0,
      datetime: null

    };

  }



  const currentPrice =
    Number(candles[0].close);



  // ==========================
  // Filled Check
  // ==========================

  let filled = false;

  let status = "Open";



  if (
    currentPrice <= fvg.high &&
    currentPrice >= fvg.low
  ) {

    filled = true;
    status = "Filled";

  }



  // ==========================
  // Strength
  // ==========================

  const size =
    Math.abs(
      fvg.high - fvg.low
    );


  let score = 50;


  if (atr) {

    if (size > atr) {

      score += 30;

    } else {

      score += 15;

    }

  }



  if (!filled) {

    score += 10;

  }



  let strength = "Normal";


  if (score >= 80) {

    strength = "Strong";

  }
  else if (score < 50) {

    strength = "Weak";

  }



  return {

    type: fvg.type,

    high: fvg.high,

    low: fvg.low,

    status,

    filled,

    strength,

    score,

    datetime: fvg.datetime

  };


}



module.exports = {

  analyzeFVG

};
