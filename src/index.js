const { getCandles } = require("./market");
const { calculateEMA } = require("./indicators");

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
    // Indicator Engine
    // ==========================
    const ema20 = calculateEMA(data.history, 20);
    const ema50 = calculateEMA(data.history, 50);

    console.log("");
    console.log("Indicators");
    console.log("----------------------------");
    console.log("EMA20      :", ema20);
    console.log("EMA50      :", ema50);

    if (ema20 !== null && ema50 !== null) {
      console.log("Trend      :", ema20 > ema50 ? "Bullish 📈" : "Bearish 📉");
    }

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
