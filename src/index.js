const { getCandles } = require("./market");

const {
  calculateEMA,
  calculateRSI,
  calculateATR
} = require("./indicators");

const {
  analyzeStructure
} = require("./marketStructure");

const {
  analyzeBOS
} = require("./bos");

const {
  analyzeCHOCH
} = require("./choch");

const {
  analyzeLiquidity
} = require("./liquidity");

const {
  analyzeOrderBlock
} = require("./orderBlock");

const {
  analyzeFVG
} = require("./fvg");

async function main() {

  try {

    console.log("====================================");
    console.log("Market Insight Indonesia");
    console.log("====================================");

    const data = await getCandles();

    if (data.status === "error") {
      console.log(data);
      return;
    }

    const last = data.latest;

    console.log("Symbol      :", data.symbol);
    console.log("Interval    :", data.interval);
    console.log("Candles     :", data.candles);


    console.log("");

    console.log("Realtime Price");
    console.log("----------------------------");
    console.log("Price       :", last.close);


    console.log("");

    console.log("Latest Candle");
    console.log("----------------------------");
    console.log("Datetime    :", last.datetime);
    console.log("Open        :", last.open);
    console.log("High        :", last.high);
    console.log("Low         :", last.low);
    console.log("Close       :", last.close);



    // ==========================
    // History Check
    // ==========================

    console.log("");

    console.log("History Check");
    console.log("----------------------------");

    console.log(
      "Oldest Close :",
      data.history[data.history.length - 1].close
    );

    console.log(
      "Newest Close :",
      data.history[0].close
    );



    // ==========================
    // Indicator Engine
    // ==========================

    const ema20 = calculateEMA(data.history, 20);
    const ema50 = calculateEMA(data.history, 50);
    const rsi14 = calculateRSI(data.history, 14);
    const atr14 = calculateATR(data.history, 14);


    console.log("");

    console.log("Indicators");
    console.log("----------------------------");

    console.log("EMA20       :", ema20);
    console.log("EMA50       :", ema50);
    console.log("RSI14       :", rsi14);
    console.log("ATR14       :", atr14);


    let trend = "Sideways";

    if (ema20 > ema50) {

      trend = "Bullish 📈";

    } else if (ema20 < ema50) {

      trend = "Bearish 📉";

    }


    console.log("Trend       :", trend);



    // ==========================
    // Market Status
    // ==========================

    console.log("");

    console.log("Market Status");
    console.log("----------------------------");


    let momentum = "Neutral";


    if (rsi14 >= 70) {

      momentum = "Overbought";

    } else if (rsi14 <= 30) {

      momentum = "Oversold";

    }


    let bias = "Neutral";


    if (trend.includes("Bullish")) {

      bias = "Bullish";

    } else if (trend.includes("Bearish")) {

      bias = "Bearish";

    }


    let action = "Wait Confirmation";


    if (
      trend.includes("Bullish") &&
      rsi14 > 50 &&
      rsi14 < 70
    ) {

      action = "Look for BUY";

    }


    if (
      trend.includes("Bearish") &&
      rsi14 > 30 &&
      rsi14 < 50
    ) {

      action = "Look for SELL";

    }


    console.log("Momentum    :", momentum);
    console.log("Bias        :", bias);
    console.log("Action      :", action);




    // ==========================
    // Market Structure
    // ==========================

    const market = analyzeStructure(
      data.history,
      atr14
    );


    console.log("");

    console.log("Market Structure");
    console.log("----------------------------");


    console.log(
      "Last High   :",
      market.swingHigh ? market.swingHigh.price : "-"
    );


    console.log(
      "Prev High   :",
      market.prevHigh ? market.prevHigh.price : "-"
    );


    console.log("");


    console.log(
      "Last Low    :",
      market.swingLow ? market.swingLow.price : "-"
    );


    console.log(
      "Prev Low    :",
      market.prevLow ? market.prevLow.price : "-"
    );


    console.log("");

    console.log("High Count  :", market.totalSwingHigh);
    console.log("Low Count   :", market.totalSwingLow);


    console.log("");

    console.log("Structure   :", market.structure);
    console.log("Bias        :", market.bias);




    // ==========================
    // Recent Swing Highs
    // ==========================

    console.log("");

    console.log("Recent Swing Highs");
    console.log("----------------------------");


    const recentHighs =
      market.swingHighs
      .slice(-5)
      .reverse();


    recentHighs.forEach((item, index) => {

      console.log(
        `${index + 1}. ${item.price} | ${item.datetime}`
      );

    });




    // ==========================
    // Recent Swing Lows
    // ==========================

    console.log("");

    console.log("Recent Swing Lows");
    console.log("----------------------------");


    const recentLows =
      market.swingLows
      .slice(-5)
      .reverse();


    recentLows.forEach((item, index) => {

      console.log(
        `${index + 1}. ${item.price} | ${item.datetime}`
      );

    });




    // ==========================
    // Break Of Structure (BOS)
    // ==========================

    const bos = analyzeBOS(
  Number(last.close),
  market,
  atr14
);


    console.log("");

    console.log("BOS");
    console.log("----------------------------");

    console.log("Direction   :", bos.direction);
console.log("Level       :", bos.level ?? "-");
console.log("Status      :", bos.status);
console.log("Strength    :", bos.strength);

// ==========================
// CHOCH
// ==========================

const choch = analyzeCHOCH(
  Number(last.close),
  market,
  bos
);


console.log("");

console.log("CHOCH");
console.log("----------------------------");

console.log("Direction   :", choch.direction);
console.log("Level       :", choch.level ?? "-");
console.log("Status      :", choch.status);

// ==========================
// Liquidity
// ==========================

    
  const liquidity = analyzeLiquidity(
  data.history,
  market,
  bos,
  atr14
);


console.log("");

console.log("Liquidity Sweep");
console.log("----------------------------");

console.log("Type        :", liquidity.type);
console.log("Level       :", liquidity.level ?? "-");
console.log("Status      :", liquidity.status);
console.log("Strength    :", liquidity.strength);
    console.log("Candle      :", liquidity.candle ?? "-");

// ==========================
// Order Block
// ==========================

const orderBlock = analyzeOrderBlock(
  data.history,
  bos,
  atr14
);


console.log("");
console.log("Order Block");
console.log("----------------------------");

console.log("Type        :", orderBlock.type);
console.log("Zone High   :", orderBlock.high);
console.log("Zone Low    :", orderBlock.low);
console.log("Status      :", orderBlock.status);
console.log("Mitigation  :", orderBlock.mitigation);
console.log("Strength    :", orderBlock.strength);
console.log("Score       :", orderBlock.score + "%");
console.log("Distance    :", orderBlock.distance);
console.log("Datetime    :", orderBlock.datetime);

// ==========================
// Fair Value Gap
// ==========================

const fvg = analyzeFVG(
  data.history,
  atr14
);


console.log("");

console.log("Fair Value Gap");
console.log("----------------------------");

console.log("Type        :", fvg.type);
console.log("High        :", fvg.high ?? "-");
console.log("Low         :", fvg.low ?? "-");
console.log("Status      :", fvg.status);
console.log("Filled      :", fvg.filled);
console.log("Strength    :", fvg.strength);
console.log("Score       :", fvg.score + "%");
console.log("Datetime    :", fvg.datetime);

    
    
  } catch (err) {


    console.log("");

    console.log("========== ERROR ==========");


    if (err.response) {

      console.log(err.response.data);

    } else {

      console.log(err.message);

    }


  }

}


main();
