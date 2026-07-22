// src/state.js
// Market State Engine v1.0
// Detect trade timing status
// READY / WAIT_RETRACE / MISSED / INVALID

function analyzeState(
  price,
  entry,
  atr
) {

  let state = "INVALID";
  let reason = "No valid entry";

  // ==========================
  // VALIDASI & FALLBACK
  // ==========================
  
  // Validasi price
  let currentPrice = null;
  if (price !== undefined && price !== null && !isNaN(Number(price))) {
    currentPrice = Number(price);
  } else {
    // Fallback: gunakan 0 jika price tidak valid
    currentPrice = 0;
    reason = "Invalid price data";
  }

  // Validasi entry
  let entryPrice = null;
  let entryObj = entry;

  // Jika entry adalah object dengan .price
  if (entryObj && typeof entryObj === 'object' && entryObj.price !== undefined) {
    if (!isNaN(Number(entryObj.price))) {
      entryPrice = Number(entryObj.price);
    }
  } 
  // Jika entry adalah angka langsung
  else if (entry !== undefined && entry !== null && !isNaN(Number(entry))) {
    entryPrice = Number(entry);
    // Konversi ke object untuk konsistensi
    entryObj = { price: entryPrice };
  }

  // Jika masih tidak valid, fallback ke price
  if (entryPrice === null) {
    entryPrice = currentPrice;
    entryObj = { price: entryPrice };
    reason = "No valid entry, using current price";
  }

  // Validasi atr
  let atrValue = null;
  if (atr !== undefined && atr !== null && !isNaN(Number(atr)) && Number(atr) > 0) {
    atrValue = Number(atr);
  } else {
    // Fallback: gunakan 1 jika atr tidak valid
    atrValue = 1;
    reason = "Invalid ATR, using default";
  }

  // ==========================
  // HITUNG JARAK
  // ==========================
  
  const distance = Math.abs(currentPrice - entryPrice);

  // ==========================
  // DISTANCE CLASSIFICATION
  // ==========================
  
  if (distance <= atrValue * 0.5) {
    state = "READY";
    reason = "Price inside entry zone";
  } else if (distance <= atrValue * 2) {
    state = "WAIT_RETRACE";
    reason = "Price near entry zone waiting confirmation";
  } else if (distance <= atrValue * 3) {
    state = "MISSED";
    reason = "Price moved away from entry zone";
  } else {
    state = "MISSED";
    reason = "Price already left setup area";
  }

  // ==========================
  // RETURN
  // ==========================
  
  return {
    state,
    reason,
    distance: Number(distance.toFixed(2)),
    atr: Number(atrValue.toFixed(2)),
    entry: Number(entryPrice.toFixed(2)),
    // Tambahan info untuk debugging
    _debug: {
      currentPrice,
      entryPrice,
      atrValue
    }
  };
}

module.exports = {
  analyzeState
};
