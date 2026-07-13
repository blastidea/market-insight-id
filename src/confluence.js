function analyzeConfluence(
  trend,
  rsi,
  bos,
  choch,
  liquidity,
  orderBlock,
  fvg,
  zone,
  atr
) {


  let score = 50;

  let bias = "NEUTRAL";

  let setup = "WAIT";



  // ==========================
  // Trend
  // ==========================

  if (trend.includes("Bullish")) {

    score += 10;

  }


  if (trend.includes("Bearish")) {

    score -= 10;

  }



  // ==========================
  // BOS
  // ==========================


  if (bos) {


    if (bos.direction === "Bullish") {

      score += 15;

    }


    if (bos.direction === "Bearish") {

      score -= 15;

    }

  }



  // ==========================
  // CHOCH
  // ==========================


  if (choch) {


    if (choch.direction === "Bullish") {

      score += 20;

    }


    if (choch.direction === "Bearish") {

      score -= 20;

    }

  }



  // ==========================
  // Liquidity Sweep
  // ==========================


  if (liquidity) {


    if (
      liquidity.type === "Buy Side Sweep"
    ) {

      score -= 5;

    }


    if (
      liquidity.type === "Sell Side Sweep"
    ) {

      score += 5;

    }

  }



  // ==========================
  // Order Block
  // ==========================


  if (orderBlock) {


    if (
      orderBlock.type === "Bullish"
    ) {

      score += 15;

    }


    if (
      orderBlock.type === "Bearish"
    ) {

      score -= 15;

    }


    if (
      orderBlock.strength === "Strong"
    ) {

      score += 5;

    }

  }



  // ==========================
  // FVG
  // ==========================


  if (fvg) {


    if (
      fvg.type === "Bullish"
    ) {

      score += 10;

    }


    if (
      fvg.type === "Bearish"
    ) {

      score -= 10;

    }

  }



  // ==========================
  // Zone
  // ==========================


  if (zone) {


    if (
      zone.zone.includes("Discount")
    ) {

      score += 10;

    }


    if (
      zone.zone.includes("Premium")
    ) {

      score -= 10;

    }

  }




  // ==========================
  // RSI
  // ==========================


  if (rsi <= 30) {

    score += 5;

  }


  if (rsi >= 70) {

    score -= 5;

  }



  // Limit

  if (score > 95)
    score = 95;


  if (score < 5)
    score = 5;



  // ==========================
  // Final Decision
  // ==========================


  if (score >= 70) {


    bias = "BULLISH";


    setup =
      "BUY REACTION";


  }


  else if (score <= 30) {


    bias = "BEARISH";


    setup =
      "SELL RETRACEMENT";


  }


  else {


    bias = "NEUTRAL";


    setup =
      "WAIT CONFIRMATION";


  }




  let entry = null;
  let sl = null;
  let target = null;



  if (orderBlock) {


    entry = {

      high:
        orderBlock.high,

      low:
        orderBlock.low

    };


  }



  if (atr && entry) {


    if (bias === "BEARISH") {


      sl =
        Number(entry.high) +
        Number(atr * 1.5);



      target =
        Number(entry.low) -
        Number(atr * 3);


    }



    if (bias === "BULLISH") {


      sl =
        Number(entry.low) -
        Number(atr * 1.5);



      target =
        Number(entry.high) +
        Number(atr * 3);


    }


  }




  return {


    bias,

    setup,

    confidence:
      score,


    entry,

    stopLoss:
      sl,

    target


  };


}



module.exports = {
  analyzeConfluence
};
