function analyzeOrderBlock(
  candles,
  market,
  currentPrice,
  atr
) {

  if (!candles || candles.length < 20) {

    return {
      type: "None",
      high: null,
      low: null,
      status: "Invalid",
      mitigation: "Unknown",
      strength: "Weak",
      score: 0,
      distance: null,
      datetime: null
    };

  }


  // candle terbaru index 0
  const history = [...candles].reverse();


  let type = "None";
  let ob = null;


  // ==========================
  // Cari berdasarkan BOS
  // ==========================

  if (market && market.structure) {


    // ==========================
    // Bearish Order Block
    // Candle bullish terakhir sebelum turun
    // ==========================

    if (
      market.bias === "Bearish" ||
      market.structure === "LH-LL" ||
      market.structure === "Compression"
    ) {


      for (let i = history.length - 5; i >= 5; i--) {


        const candle = history[i];


        const open = Number(candle.open);
        const close = Number(candle.close);


        // bullish candle
        if (close > open) {


          ob = {

            high: Number(candle.high),
            low: Number(candle.low),
            datetime: candle.datetime

          };


          type = "Bearish";

          break;

        }

      }

    }



    // ==========================
    // Bullish Order Block
    // Candle bearish terakhir sebelum naik
    // ==========================

    if (
      market.bias === "Bullish" ||
      market.structure === "HH-HL"
    ) {


      for (let i = history.length - 5; i >= 5; i--) {


        const candle = history[i];


        const open = Number(candle.open);
        const close = Number(candle.close);


        // bearish candle
        if (close < open) {


          ob = {

            high: Number(candle.high),
            low: Number(candle.low),
            datetime: candle.datetime

          };


          type = "Bullish";

          break;

        }

      }

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
      datetime: null

    };

  }



  // ==========================
  // Check Mitigation
  // ==========================

  let mitigation = "Not Tested";
  let status = "Fresh";


  const price = Number(currentPrice);



  if (
    price <= ob.high &&
    price >= ob.low
  ) {

    mitigation = "Touched";
    status = "Mitigated";

  }



  // ==========================
  // Distance
  // ==========================

  const distance =
    Math.abs(price - ob.high);



  // ==========================
  // Strength Score
  // ==========================

  let score = 50;


  // OB masih fresh
  if (status === "Fresh") {

    score += 15;

  }


  // dekat dengan harga
  if (atr && distance < atr * 5) {

    score += 10;

  }


  // ada BOS
  if (market && market.structure) {

    score += 10;

  }


  // batas
  if (score > 100) {

    score = 100;

  }



  let strength = "Normal";


  if (score >= 80) {

    strength = "Institutional";

  }

  else if (score >= 65) {

    strength = "Strong";

  }

  else if (score < 50) {

    strength = "Weak";

  }



  return {


    type,

    high: ob.high,

    low: ob.low,


    status,

    mitigation,


    strength,

    score,


    distance: Number(distance.toFixed(2)),


    datetime: ob.datetime


  };


}



module.exports = {

  analyzeOrderBlock

};
