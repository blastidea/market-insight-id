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
  // CHECK SETUP
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

if(decision.confidence < 60){

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
  // BEARISH SELL PLAN
  // ==========================

  if(decision.bias === "BEARISH") {
    action = "EXECUTE SELL PLAN";
    reason =
    "Strong bearish confluence + valid order block";
    riskLevel = "MEDIUM";

    entry = {

      high: orderBlock.high,

      low: orderBlock.low

    };


    let entryPrice =
      orderBlock.low;

    // SL ABOVE OB + ATR BUFFER

    stopLoss =
      orderBlock.high +
      (atr * 1.5);



    let risk =
      Math.abs(
        stopLoss - entryPrice
      );



    let targets=[];



    // swing low

    if(market.swingLows){


      market.swingLows.forEach(x=>{


        if(x.price < entryPrice){

          targets.push(x.price);

        }


      });


    }



    // FVG bearish

    if(
      fvg &&
      fvg.type==="Bearish"
    ){


      if(
        fvg.low < entryPrice
      ){

        targets.push(
          fvg.low
        );

      }


    }

    // remove duplicate

    targets =
    [...new Set(targets)];

    // sort nearest to farthest

    targets.sort(
      (a,b)=>b-a
    );

    let valid=[];

    targets.forEach(t=>{

      let reward =
      Math.abs(
        entryPrice - t
      );


      let rr =
      reward / risk;



      if(rr >= 1.5){

        valid.push(t);

      }


    });



    tp1 = valid[0] || null;
    tp2 = valid[1] || null;
    tp3 = valid[2] || null;



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
  // BULLISH BUY PLAN
  // ==========================

  if(decision.bias === "BULLISH") {


    action="EXECUTE BUY PLAN";


    reason =
    "Strong bullish confluence + valid demand zone";


    riskLevel="MEDIUM";



    entry={

      high:orderBlock.high,

      low:orderBlock.low

    };



    let entryPrice =
      orderBlock.high;



    stopLoss =
      orderBlock.low -
      (atr * 1.5);



    let risk =
    Math.abs(
      entryPrice-stopLoss
    );



    let targets=[];



    if(market.swingHighs){


      market.swingHighs.forEach(x=>{


        if(
          x.price > entryPrice
        ){

          targets.push(
            x.price
          );

        }


      });


    }




    if(
      fvg &&
      fvg.type==="Bullish"
    ){


      if(
        fvg.high > entryPrice
      ){

        targets.push(
          fvg.high
        );

      }


    }




    targets =
    [...new Set(targets)];



    targets.sort(
      (a,b)=>a-b
    );



    let valid=[];



    targets.forEach(t=>{


      let reward =
      Math.abs(
        t-entryPrice
      );


      let rr =
      reward/risk;



      if(rr>=1.5){

        valid.push(t);

      }


    });



    tp1=valid[0] || null;
    tp2=valid[1] || null;
    tp3=valid[2] || null;



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




  // ==========================
  // RESULT
  // ==========================

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
