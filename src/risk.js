function analyzeRisk(
  decision,
  orderBlock,
  liquidity,
  atr,
  price
){

  let action = "WAIT CONFIRMATION";
  let reason = "";
  let riskLevel = "LOW";


  let entry = null;
  let stopLoss = null;
  let target = null;


  // =========================
  // VALIDASI SETUP
  // =========================

  if(!decision){

    return {
      action,
      reason:"No setup detected",
      riskLevel:"HIGH"
    };

  }


  const confidence = decision.confidence || 0;



  // =========================
  // SELL SETUP
  // =========================

  if(decision.bias === "BEARISH"){


    if(orderBlock && orderBlock.type === "Bearish"){


      entry = {
        high:orderBlock.high,
        low:orderBlock.low
      };


      stopLoss =
        orderBlock.high + (atr * 1.5);


      target =
        price - ((stopLoss-price)*2);



      if(confidence >= 70){

        action = "EXECUTE SELL PLAN";

        reason =
        "Strong bearish confluence + valid order block";


        riskLevel="MEDIUM";


      }else{

        action="WAIT CONFIRMATION";

        reason=
        "Bearish setup detected but confidence weak";

        riskLevel="MEDIUM";

      }


    }


  }




  // =========================
  // BUY SETUP
  // =========================

  if(decision.bias==="BULLISH"){


    if(orderBlock && orderBlock.type==="Bullish"){


      entry={
        high:orderBlock.high,
        low:orderBlock.low
      };


      stopLoss =
      orderBlock.low - (atr*1.5);


      target =
      price + ((price-stopLoss)*2);



      if(confidence>=70){

        action="EXECUTE BUY PLAN";

        reason=
        "Strong bullish confluence + valid order block";

        riskLevel="MEDIUM";


      }else{

        action="WAIT CONFIRMATION";

        reason=
        "Need stronger confirmation";

      }


    }

  }




  let rr=null;


  if(stopLoss && target){

    let risk=Math.abs(price-stopLoss);

    let reward=Math.abs(target-price);

    rr=(reward/risk).toFixed(2);

  }



return {

 action,

 reason,

 riskLevel,

 entry,

 stopLoss,

 target,

 riskReward:rr

};


}


module.exports={
 analyzeRisk
};
