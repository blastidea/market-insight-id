function analyzeOrderBlock(
  candles,
  bos,
  atr
) {

  if (!candles || candles.length < 10 || !bos) {

    return {
      type: "None",
      high: null,
      low: null,
      status: "Not Found",
      mitigation: "None",
      strength: "Weak",
      score: 0,
      distance: null,
      datetime: null,
      fvg: false
    };

  }


  // candle terbaru index 0
  const history = [...candles].reverse();


  let ob = null;


  // ==========================
  // Cari candle sebelum BOS
  // ==========================

  for (
    let i = history.length - 3;
    i >= 2;
    i--
  ) {


    const candle = history[i];
    const next = history[i + 1];


    const open = Number(candle.open);
    const close = Number(candle.close);

    const high = Number(candle.high);
    const low = Number(candle.low);


    const body = Math.abs(close - open);


    // ==========================
    // Bearish Order Block
    // candle bullish sebelum drop
    // ==========================

    if (
      bos.direction === "Bearish" &&
      close > open &&
      Number(next.close) < low
    ) {


      ob = {

        type: "Bearish",

        high,

        low,

        datetime: candle.datetime

      };


      break;

    }



    // ==========================
    // Bullish Order Block
    // candle bearish sebelum rally
    // ==========================

    if (
      bos.direction === "Bullish" &&
      close < open &&
      Number(next.close) > high
    ) {


      ob = {

        type: "Bullish",

        high,

        low,

        datetime: candle.datetime

      };


      break;

    }


  }



  if (!ob) {

    return {

      type: "None",
      high: null,
      low: null,
      status: "Not Found",
      mitigation: "None",
      strength: "Weak",
      score: 0,
      distance: null,
      datetime: null,
      fvg:false

    };

  }



  const price =
    Number(candles[0].close);



  const distance =
    Math.abs(price - ((ob.high + ob.low) / 2));



  // ==========================
  // Mitigation Check
  // ==========================

  let mitigation = "No";

  let status = "Fresh";


  if (
    price <= ob.high &&
    price >= ob.low
  ) {

    mitigation = "Yes";
    status = "Tested";

  }


  if (
    bos.direction === "Bearish" &&
    price > ob.high
  ) {

    status = "Invalid";

  }


  if (
    bos.direction === "Bullish" &&
    price < ob.low
  ) {

    status = "Invalid";

  }



  // ==========================
  // FVG Check
  // ==========================

  let fvg = false;


  for (
    let i = 1;
    i < history.length - 1;
    i++
  ) {

    const prevHigh =
      Number(history[i-1].high);

    const nextLow =
      Number(history[i+1].low);


    if (nextLow > prevHigh) {

      fvg = true;

    }


  }



  // ==========================
  // Score
  // ==========================

  let score = 50;


  if (bos.strength === "Strong") {

    score += 20;

  }


  if (fvg) {

    score += 15;

  }


  if (status === "Fresh") {

    score += 10;

  }


  if (status === "Invalid") {

    score = 0;

  }



  let strength = "Normal";


  if (score >= 80) {

    strength = "Strong";

  }
  else if (score < 50) {

    strength = "Weak";

  }



  return {

    type: ob.type,

    high: ob.high,

    low: ob.low,

    status,

    mitigation,

    strength,

    score,

    distance,

    datetime: ob.datetime,

    fvg

  };


}



module.exports = {

  analyzeOrderBlock

};
