// src/risk.js

function analyzeRisk(
  decision,
  orderBlock,
  market,
  fvg,
  price,
  atr
) {

  let action = "WAIT CONFIRMATION";
  let reason = "No valid setup";
  let riskLevel = "LOW";

  let entry = null;
  let stopLoss = null;

  let tp1 = null;
  let tp2 = null;
  let tp3 = null;

  let riskReward = 0;


  // ==========================
  // ATR CHECK
  // ==========================

  if (!atr) {

    return {
      action:"WAIT CONFIRMATION",
      reason:"ATR unavailable",
      riskLevel:"LOW",
      entry:null,
      stopLoss:null,
      target:{
        tp1:null,
        tp2:null,
        tp3:null
      },
      riskReward:0
    };

  }



  // ==========================
  // BASIC CHECK
  // ==========================

  if (
    !decision ||
    !orderBlock ||
    orderBlock.status === "Not Found"
  ) {

    return {
      action,
      reason,
      riskLevel,
      entry:null,
      stopLoss:null,
      target:{
        tp1:null,
        tp2:null,
        tp3:null
      },
      riskReward:0
    };

  }



  // ==========================
  // CONFIDENCE FILTER
  // ==========================

  if(decision.confidence < 65){

    return {
      action:"WAIT CONFIRMATION",
      reason:"Confidence below threshold",
      riskLevel:"LOW",
      entry:null,
      stopLoss:null,
      target:{
        tp1:null,
        tp2:null,
        tp3:null
      },
      riskReward:0
    };

  }



  // ==========================
  // SELL PLAN
  // ==========================

  if(decision.bias === "BEARISH"){


    action="EXECUTE SELL PLAN";

    reason =
    "Bearish confluence + valid order block";

    riskLevel="MEDIUM";



    // Entry mitigation OB

    const entryPrice =
      (orderBlock.high + orderBlock.low) / 2;



    entry = {
      high:orderBlock.high,
      low:orderBlock.low,
      price:Number(entryPrice.toFixed(2))
    };



    // SL

    stopLoss =
      Number(
        (
          orderBlock.high +
          (atr * 0.8)
        )
        .toFixed(2)
      );



    const risk =
      Math.abs(
        stopLoss - entryPrice
      );



    let targets=[];



    // Swing low

    if(market.swingLows){

      market.swingLows.forEach(x=>{

        if(x.price < entryPrice){

          targets.push(x.price);

        }

      });

    }



    // FVG

    if(
      fvg &&
      fvg.type==="Bearish" &&
      fvg.low < entryPrice
    ){

      targets.push(fvg.low);

    }



    targets =
    [...new Set(targets)];



    targets.sort(
      (a,b)=>b-a
    );



    let valid=[];


    targets.forEach(t=>{

      const reward =
      Math.abs(entryPrice-t);


      const rr =
      reward/risk;


      if(rr>=1.5){

        valid.push(t);

      }

    });



    if(valid.length){

      tp1=valid[0] || null;
      tp2=valid[1] || null;
      tp3=valid[2] || null;

    }
    else {

      tp1 =
      Number(
        (
          entryPrice -
          (atr*3)
        )
        .toFixed(2)
      );

    }



    if(tp1){

      riskReward =
      Number(
        (
          Math.abs(entryPrice-tp1)
          /
          risk
        )
        .toFixed(2)
      );

    }


  }




  // ==========================
  // BUY PLAN
  // ==========================

  if(decision.bias==="BULLISH"){


    action="EXECUTE BUY PLAN";

    reason =
    "Bullish confluence + valid order block";

    riskLevel="MEDIUM";



    const entryPrice =
    (orderBlock.high + orderBlock.low) / 2;



    entry={
      high:orderBlock.high,
      low:orderBlock.low,
      price:Number(entryPrice.toFixed(2))
    };



    stopLoss =
    Number(
      (
        orderBlock.low -
        (atr*0.8)
      )
      .toFixed(2)
    );



    const risk =
    Math.abs(
      entryPrice-stopLoss
    );



    let targets=[];



    if(market.swingHighs){

      market.swingHighs.forEach(x=>{

        if(x.price > entryPrice){

          targets.push(x.price);

        }

      });

    }



    if(
      fvg &&
      fvg.type==="Bullish" &&
      fvg.high > entryPrice
    ){

      targets.push(fvg.high);

    }



    targets =
    [...new Set(targets)];



    targets.sort(
      (a,b)=>a-b
    );



    let valid=[];


    targets.forEach(t=>{

      const reward =
      Math.abs(t-entryPrice);


      const rr =
      reward/risk;


      if(rr>=1.5){

        valid.push(t);

      }

    });



    if(valid.length){

      tp1=valid[0] || null;
      tp2=valid[1] || null;
      tp3=valid[2] || null;

    }
    else {

      tp1 =
      Number(
        (
          entryPrice+
          (atr*3)
        )
        .toFixed(2)
      );

    }



    if(tp1){

      riskReward =
      Number(
        (
          Math.abs(tp1-entryPrice)
          /
          risk
        )
        .toFixed(2)
      );

    }

  }



  return {

    action,

    reason,

    riskLevel,

    entry,

    stopLoss,

    target:{
      tp1,
      tp2,
      tp3
    },

    riskReward

  };


}


module.exports = {
  analyzeRisk
};
