const { getCandles } = require("./market");

const {
  calculateEMA,
  calculateRSI,
  calculateATR
} = require("./indicators");

const {
  analyzeStructure
} = require("./marketStructure");

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
    console.log("Oldest Close :", data.history[data.history.length - 1].close);
    console.log("Newest Close :", data.history[0].close);

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

    if (trend.includes("Bullish") && rsi14 > 50 && rsi14 < 70) {
      action = "Look for BUY";
    }

    if (trend.includes("Bearish") && rsi14 > 30 && rsi14 < 50) {
      action = "Look for SELL";
    }

    console.log("Momentum    :", momentum);
    console.log("Bias        :", bias);
    console.log("Action      :", action);

    // ==========================
    // Market Structure
    // ==========================
    const market = analyzeStructure(data.history);

    console.log("");
    console.log("Market Structure");
    console.log("----------------------------");

    console.log("Swing High  :", market.swingHigh ? market.swingHigh.price : "-");
    console.log("Swing Low   :", market.swingLow ? market.swingLow.price : "-");

    console.log("High Count  :", market.totalSwingHigh);
    console.log("Low Count   :", market.totalSwingLow);

    console.log("Structure   :", market.structure);
    console.log("Bias        :", market.bias);

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
