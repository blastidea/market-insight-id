function analyzeRisk(
  confidence,
  rr,
  bias,
  setup
) {


  let action = "WAIT";

  let reason = "Insufficient confirmation";

  let riskLevel = "NORMAL";



  // ==========================
  // Basic Filter
  // ==========================

  if (
    confidence < 50
  ) {

    action = "NO TRADE";

    reason = "Confidence below minimum";


    return {

      action,
      reason,
      riskLevel

    };

  }




  if (
    rr < 1.5
  ) {

    action = "NO TRADE";

    reason = "Risk Reward below 1:1.5";


    return {

      action,
      reason,
      riskLevel

    };

  }





  // ==========================
  // Execution Filter
  // ==========================


  if (
    confidence >= 70 &&
    rr >= 2
  ) {


    action = "EXECUTE";


    reason =
      "High confidence and acceptable RR";


    riskLevel = "LOW";

  }



  else if(
    confidence >= 60 &&
    rr >= 1.5
  ){


    action = "WAIT CONFIRMATION";


    reason =
      "Setup valid but needs confirmation";


    riskLevel = "MEDIUM";


  }




  // ==========================
  // Bias Check
  // ==========================


  if(
    bias === "NEUTRAL"
  ){

    action = "NO TRADE";

    reason =
      "Market bias unclear";

  }




  return {

    action,

    reason,

    riskLevel,

    confidence,

    rr,

    bias,

    setup

  };


}



module.exports = {
  analyzeRisk
};
