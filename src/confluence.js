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

  let bullish = 0;
  let bearish = 0;


  // Trend
  if (trend.includes("Bullish")) bullish += 10;
  if (trend.includes("Bearish")) bearish += 10;


  // BOS
  if (bos) {

    if (bos.direction === "Bullish")
      bullish += 20;

    if (bos.direction === "Bearish")
      bearish += 20;

  }


  // CHOCH
  if (choch) {

    if (choch.direction === "Bullish")
      bullish += 15;

    if (choch.direction === "Bearish")
      bearish += 15;

  }


  // Liquidity
  if (liquidity) {

    if (liquidity.type === "Sell Side Sweep")
      bullish += 10;

    if (liquidity.type === "Buy Side Sweep")
      bearish += 10;

  }


  // Order Block
  if (orderBlock) {

    if (orderBlock.type === "Bullish")
      bullish += 25;

    if (orderBlock.type === "Bearish")
      bearish += 25;


    if (orderBlock.strength === "Strong") {

      if(orderBlock.type === "Bullish")
        bullish += 10;

      if(orderBlock.type === "Bearish")
        bearish += 10;

    }

  }


  // FVG
  if (fvg) {

    if(fvg.type === "Bullish")
      bullish += 15;

    if(fvg.type === "Bearish")
      bearish += 15;

  }


  // Zone
  if(zone) {

    if(
      zone.bias &&
      zone.bias.includes("BUY")
    )
      bullish += 10;


    if(
      zone.bias &&
      zone.bias.includes("SELL")
    )
      bearish += 10;

  }


  // RSI
  if(rsi <= 30)
    bullish += 5;

  if(rsi >= 70)
    bearish += 5;



  // Decision

  let bias = "NEUTRAL";
  let setup = "WAIT CONFIRMATION";
  let confidence = 50;


  if(bullish > bearish){

    bias = "BULLISH";
    setup = "BUY REACTION";
    confidence = bullish;

  }


  if(bearish > bullish){

    bias = "BEARISH";
    setup = "SELL RETRACEMENT";
    confidence = bearish;

  }


  if(confidence > 95)
    confidence = 95;



  // Entry

  let entry = null;
  let stopLoss = null;
  let target = null;
  let rr = null;



  if (
    orderBlock &&
    orderBlock.type !== "None" &&
    orderBlock.high != null &&
    orderBlock.low != null
){

    entry = {
      high: Number(orderBlock.high),
      low : Number(orderBlock.low)
    };

  }



 if(
    entry &&
    entry.high != null &&
    entry.low != null &&
    atr
){


    if(bias === "BEARISH"){

      stopLoss =
        entry.high + (atr * 1.5);


      target =
        entry.low - (atr * 3);

    }



    if(bias === "BULLISH"){


      stopLoss =
        entry.low - (atr * 1.5);


      target =
        entry.high + (atr * 3);

    }



    let entryPrice =
      (entry.high + entry.low) / 2;


    let risk =
      Math.abs(stopLoss - entryPrice);


    let reward =
      Math.abs(target - entryPrice);


    if(risk > 0){

      rr =
        Number((reward / risk).toFixed(2));

    }

  }



  return {

    bullishScore: bullish,

    bearishScore: bearish,

    bias,

    setup,

    confidence,

    entry,

    stopLoss,

    target,

    rr

  };

}



module.exports = {
  analyzeConfluence
};
