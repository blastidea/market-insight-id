const { getCandles } = require("./market");

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

main();    console.log("Close       :", last.close);

  } catch (err) {

    console.log("========== ERROR ==========");

    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }

  }
}

main();
