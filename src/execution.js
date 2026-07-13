// src/execution.js
// Execution Engine v1.3+
// Final Trade Validation Layer


function analyzeExecution(
  decision,
  risk,
  orderBlock,
  liquidity,
  bos,
  choch,
  history,
  price,
  atr
){


  let reason = [];
  let status = "WAIT";



  // ==========================
  // BASIC CHECK
  // ==========================

  if(
    !decision ||
    !risk ||
    !orderBlock
  ){

    return {

      status:"CANCEL",

      reason:"Missing trading component",

      version:"1.3+",

      timestamp:new Date().toISOString()

    };

  }





  // ==========================
  // RISK VALIDATION
  // ==========================


  if(
 !risk.entry ||
 !risk.stopLoss ||
 !risk.target
){

return {

status:"WAIT",

direction:
decision ? decision.bias : null,

reason:
risk.reason || "Risk plan incomplete",

version:"1.3+",

timestamp:new Date().toISOString()

};

}


  reason.push(
    "Risk plan valid"
  );

// ==========================
// STATE VALIDATION
// ==========================

if(state){

  if(state.state === "MISSED"){

    status = "CANCEL";

    reason.push(
      "Price already left setup area"
    );

  }

  else if(state.state === "WAIT_RETRACE"){

    reason.push(
      "Waiting retrace into Order Block"
    );

  }

  else if(state.state === "READY"){

    reason.push(
      "Price inside entry zone"
    );

  }

}



  // ==========================
  // ORDER BLOCK VALIDATION
  // ==========================


  if(
    orderBlock.status === "Not Found"
  ){

    return {

      status:"CANCEL",

      reason:"No valid order block",

      version:"1.3+",

      timestamp:new Date().toISOString()

    };

  }


  reason.push(
    "Order block valid"
  );





  // ==========================
  // BOS CONFIRMATION
  // ==========================


  if(
    !bos ||
    bos.status !== "Confirmed"
  ){

    return {

      status:"WAIT",

      reason:"Waiting BOS confirmation",

      version:"1.3+",

      timestamp:new Date().toISOString()

    };

  }


  reason.push(
    "BOS confirmed"
  );





  // ==========================
  // CONFLUENCE CHECK
  // ==========================


  if(
    decision.confidence < 60
  ){

    return {

      status:"WAIT",

      reason:"Low confidence",

      confidence:decision.confidence,

      version:"1.3+",

      timestamp:new Date().toISOString()

    };

  }


  reason.push(
    "Strong confluence"
  );





  // ==========================
  // CANDLE CONFIRMATION
  // ==========================


  let candleConfirm=false;



  if(
    history &&
    history.length >= 2
  ){


    const last =
    history[0];


    const prev =
    history[1];



    if(
      decision.bias==="BEARISH" &&
      last.close < last.open &&
      last.high > prev.high
    ){

      candleConfirm=true;

    }



    if(
      decision.bias==="BULLISH" &&
      last.close > last.open &&
      last.low < prev.low
    ){

      candleConfirm=true;

    }


  }





  if(candleConfirm){

    reason.push(
      "Candle rejection confirmed"
    );

  }
  else{

    reason.push(
      "Waiting candle confirmation"
    );

  }





  // ==========================
  // FINAL STATUS
  // ==========================

  if(
  status !== "CANCEL"
){
  if(candleConfirm){
    status = "READY";
  }
}


  return {

    status,


    direction:
    decision.bias,


    entry:
    risk.entry,


    stopLoss:
    risk.stopLoss,


    target:

    risk.target,


    riskReward:
    risk.riskReward,


    confidence:
    decision.confidence,


    reason:
    reason.join(" | "),


    version:"1.3+",


    timestamp:
    new Date().toISOString()

  };


}



module.exports={

 analyzeExecution

};
