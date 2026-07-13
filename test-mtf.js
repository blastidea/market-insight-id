const {
  getMultiTimeframe
} = require("./src/timeframe");


async function test(){

  const mtf = await getMultiTimeframe();

  console.log("========== MTF TEST ==========");

  console.log("H4 :", mtf.H4.interval, mtf.H4.status);
  console.log("H1 :", mtf.H1.interval, mtf.H1.status);
  console.log("M30:", mtf.M30.interval, mtf.M30.status);
  console.log("M15:", mtf.M15.interval, mtf.M15.status);
  console.log("M5 :", mtf.M5.interval, mtf.M5.status);

}


test();
