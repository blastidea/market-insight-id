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

      score += 20;

    }


    if (bos.direction === "Bearish") {

      score -= 20;

    }

  }



  // ==========================
  // CHOCH
  // ==========================

  if (choch) {


    if (choch.direction === "Bullish") {

      score += 15;

    }


    if (choch.direction === "Bearish") {

      score -= 15;

    }

  }



  // ==========================
  // Liquidity Sweep
  // ==========================

  if (liquidity) {


    if (
      liquidity.type === "Sell Side Sweep"
    ) {

      score += 10;

    }


    if (
      liquidity.type === "Buy Side Sweep"
    ) {

      score -= 10;

    }

  }




  // ==========================
  // Order Block
  // ==========================

  if (orderBlock) {


    if (
      orderBlock.type === "Bullish"
    ) {

      score += 20;

    }


    if (
      orderBlock.type === "Bearish"
    ) {

      score -= 20;

    }



    if (
      orderBlock.strength === "Strong"
    ) {


      if (
        orderBlock.type === "Bullish"
      ) {

        score += 10;

      }


      if (
        orderBlock.type === "Bearish"
      ) {

        score -= 10;

      }

    }

  }





  // ==========================
  // Fair Value Gap
  // ==========================

  if (fvg) {


    if (
      fvg.type === "Bullish"
    ) {

      score += 15;

    }


    if (
      fvg.type === "Bearish"
    ) {

      score -= 15;

    }


    if (
      fvg.strength === "Strong"
    ) {

      score += 5;

    }

  }




  // ==========================
  // Market Zone
  // ==========================

  if (zone) {


    if (
      zone.bias &&
      zone.bias.includes("BUY")
    ) {

      score += 10;

    }


    if (
      zone.bias &&
      zone.bias.includes("SELL")
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




  // ==========================
  // Normalize Score
  // ==========================

  if (score < 0) {

    score = 0;

  }


  if (score > 100) {

    score = 100;

  }




  // ==========================
  // Decision
  // ==========================


  if (score >= 70) {


    bias = "BULLISH";

    setup = "BUY REACTION";


  } 
  else if (score <= 30) {


    bias = "BEARISH";

    setup = "SELL RETRACEMENT";


  } 
  else {


    bias = "NEUTRAL";

    setup = "WAIT CONFIRMATION";


  }




  // ==========================
  // Entry / SL / Target
  // ==========================

  let entry = null;
  let stopLoss = null;
  let target = null;



  if (orderBlock) {


    entry = {

      high: orderBlock.high,

      low: orderBlock.low

    };


  }




  if (
    entry &&
    atr
  ) {


    if (bias === "BEARISH") {


      stopLoss =
        Number(entry.high) +
        Number(atr * 1.5);



      target =
        Number(entry.low) -
        Number(atr * 3);


    }



    if (bias === "BULLISH") {


      stopLoss =
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

    confidence: score,

    entry,

    stopLoss,

    target

  };


}



module.exports = {
  analyzeConfluence
};
