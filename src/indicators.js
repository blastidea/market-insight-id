function calculateEMA(candles, period) {
  if (!candles || candles.length < period) {
    return null;
  }

  // Twelve Data mengembalikan nilai terbaru di index 0.
  // Kita balik agar perhitungan dari data lama ke baru.
  const prices = [...candles]
    .reverse()
    .map(c => Number(c.close));

  const multiplier = 2 / (period + 1);

  // SMA awal
  let ema =
    prices.slice(0, period)
      .reduce((sum, price) => sum + price, 0) / period;

  // EMA selanjutnya
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return Number(ema.toFixed(5));
}

module.exports = {
  calculateEMA
};
