function analyzeRisk(
  decision,
  orderBlock,
  market,
  fvg,
  lastPrice,
  atr
) {

  let action = "WAIT CONFIRMATION";
  let reason = "Setup valid but needs confirmation";

  let entry = null;
  let stopLoss = null;

  let tp1 = null;
  let tp2 = null;
  let tp3 = null;


  // ==========================
  // SELL PLAN
  // ==========================

  if (
    decision.bias === "BEARISH" &&
    orderBlock &&
    orderBlock.type === "Bearish"
  ) {

    entry = {
      high: orderBlock.high,
      low: orderBlock.low
    };


    // SL di atas OB + ATR protection
    stopLoss =
      orderBlock.high + (atr * 1.5);



    // TP1 liquidity / swing low
    if (market.swingLow) {

      tp1 = market.swingLow.price;

    }


    // TP2 FVG
    if (fvg && fvg.type === "Bearish") {

      tp2 = fvg.low;

    }


    // TP3 swing low sebelumnya
    if (
      market.swingLows &&
      market.swingLows.length > 1
    ) {

      tp3 =
        market.swingLows[
          market.swingLows.length - 2
        ].price;

    }



    if (decision.confidence >= 70) {

      action = "EXECUTE SELL PLAN";

      reason =
      "Strong bearish confluence + valid order block";

    }


  }



  // ==========================
  // BUY PLAN
  // ==========================

  if (
    decision.bias === "BULLISH" &&
    orderBlock &&
    orderBlock.type === "Bullish"
  ) {


    entry = {
      high: orderBlock.high,
      low: orderBlock.low
    };


    stopLoss =
      orderBlock.low - (atr * 1.5);



    if (market.swingHigh) {

      tp1 = market.swingHigh.price;

    }


    if (fvg && fvg.type === "Bullish") {

      tp2 = fvg.high;

    }


    if (
      market.swingHighs &&
      market.swingHighs.length > 1
    ) {

      tp3 =
      market.swingHighs[
        market.swingHighs.length - 2
      ].price;

    }



    if (decision.confidence >= 70) {

      action = "EXECUTE BUY PLAN";

      reason =
      "Strong bullish confluence + valid order block";

    }

  }



  // ==========================
  // RR Calculation
  // ==========================


  let rr = 0;


  if (
    entry &&
    stopLoss &&
    tp1
  ) {

    let entryPrice =
      decision.bias === "BEARISH"
      ? entry.low
      : entry.high;


    let risk =
      Math.abs(entryPrice - stopLoss);


    let reward =
      Math.abs(entryPrice - tp1);


    rr =
    Number((reward / risk).toFixed(2));

  }



  return {

    action,

    reason,

    riskLevel:
      rr >= 2
      ? "LOW"
      : "MEDIUM",


    entry,

    stopLoss,


    target: {
      tp1,
      tp2,
      tp3
    },


    riskReward: rr

  };

}


module.exports = {
  analyzeRisk
};
