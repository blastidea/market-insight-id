function analyzeOrderBlock(
  candles,
  bos,
  atr
) {

  const emptyOB = {
    type: "None",
    high: 0,
    low: 0,
    status: "Not Found",
    mitigation: "None",
    strength: "Weak",
    score: 0,
    distance: 0,
    datetime: "-",
    fvg: false,
    fallback: false,
    quality: "None",
    zoneSize: 0,
    location: "Unknown",
    age: 0,
    fvgStrength: "None"
  };


  if (!candles || candles.length < 10 || !bos) {

    return emptyOB;

  }


  const history = [...candles].reverse();


  let ob = null;
  let fallback = false;


  // ==========================
  // PERFECT ORDER BLOCK
  // ==========================

  for (
    let i = history.length - 3;
    i >= 2;
    i--
  ) {


    const candle = history[i];
    const next = history[i + 1];


    const open = Number(candle.open);
    const close = Number(candle.close);

    const high = Number(candle.high);
    const low = Number(candle.low);


    const body = Math.abs(close - open);



    // Bearish OB

    if (

      bos.direction === "Bearish" &&

      close > open &&

      (
        Number(next.low) < low ||
        Number(next.close) < close
      )

      && body >= atr * 0.3

    ) {


      ob = {

        type:"Bearish",
        high,
        low,
        datetime:candle.datetime,
        index:i

      };


      break;

    }



    // Bullish OB

    if (

      bos.direction === "Bullish" &&

      close < open &&

      (
        Number(next.high) > high ||
        Number(next.close) > close
      )

      && body >= atr * 0.3

    ) {


      ob = {

        type:"Bullish",
        high,
        low,
        datetime:candle.datetime,
        index:i

      };


      break;

    }

  }



  // ==========================
  // FALLBACK ORDER BLOCK
  // ==========================

  if (!ob) {


    for (
      let i = history.length - 3;
      i >= 2;
      i--
    ) {


      const candle = history[i];


      if (

        bos.direction === "Bearish" &&

        Number(candle.close) >
        Number(candle.open)

      ) {


        ob = {

          type:"Bearish",
          high:Number(candle.high),
          low:Number(candle.low),
          datetime:candle.datetime,
          index:i

        };


        fallback=true;

        break;

      }



      if (

        bos.direction === "Bullish" &&

        Number(candle.close) <
        Number(candle.open)

      ) {


        ob = {

          type:"Bullish",
          high:Number(candle.high),
          low:Number(candle.low),
          datetime:candle.datetime,
          index:i

        };


        fallback=true;

        break;

      }

    }

  }



  if (!ob) {

    return emptyOB;

  }



  const price =
    Number(candles[0].close);



  const midpoint =
    (ob.high + ob.low) / 2;



  const distance =
    Math.abs(price - midpoint);



  // ==========================
  // ZONE INFORMATION
  // ==========================


  const zoneSize =
    Math.abs(ob.high - ob.low);



  let location="Neutral";


  if(price > midpoint)
    location="Premium";


  if(price < midpoint)
    location="Discount";



  const age =
    ob.index;



  // ==========================
  // STATUS
  // ==========================


  let mitigation="No";


  let status =
    fallback
    ? "Fallback"
    : "Fresh";



  if(
    price >= ob.low &&
    price <= ob.high
  ){

    mitigation="Yes";
    status="Tested";

  }



  if(
    bos.direction==="Bearish" &&
    price > ob.high
  ){

    status="Invalid";

  }



  if(
    bos.direction==="Bullish" &&
    price < ob.low
  ){

    status="Invalid";

  }




  // ==========================
  // FVG DETECTION
  // ==========================


  let fvg=false;


  let fvgStrength="None";


  for(
    let i=1;
    i<history.length-1;
    i++
  ){


    const prevHigh =
      Number(history[i-1].high);


    const nextLow =
      Number(history[i+1].low);


    const prevLow =
      Number(history[i-1].low);


    const nextHigh =
      Number(history[i+1].high);



    if(
      nextLow > prevHigh ||
      nextHigh < prevLow
    ){

      fvg=true;

      fvgStrength="Normal";


      if(
        Math.abs(nextLow-prevHigh) > atr
      ){

        fvgStrength="Strong";

      }


      break;

    }

  }



  // ==========================
  // SCORE
  // ==========================


  let score=40;


  if(bos.strength==="Strong")
    score+=20;


  if(fvg)
    score+=15;


  if(status==="Fresh")
    score+=15;


  if(status==="Tested")
    score+=10;


  if(fvgStrength==="Strong")
    score+=5;


  if(fallback)
    score-=10;


  if(status==="Invalid")
    score=0;



  if(score>95)
    score=95;



  let strength="Weak";


  if(score>=80)
    strength="Strong";

  else if(score>=60)
    strength="Normal";



  return {


    type:ob.type,

    high:ob.high,

    low:ob.low,


    status,

    mitigation,


    strength,


    score,


    distance:
      Number(distance.toFixed(2)),


    datetime:
      ob.datetime,


    fvg,


    fallback,


    quality:
      fallback
      ? "Fallback"
      : "Perfect",


    zoneSize:
      Number(zoneSize.toFixed(2)),


    location,


    age,


    fvgStrength


  };


}



module.exports = {

  analyzeOrderBlock

};
