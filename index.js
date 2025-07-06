
const axios = require('axios');
const technicalIndicators = require('technicalindicators');

async function getKlines(symbol, interval = '1m', limit = 100) {
  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await axios.get(url);
  return response.data.map(k => ({
    openTime: k[0],
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5])
  }));
}

function calculateIndicators(candles) {
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);

  const rsi = technicalIndicators.RSI.calculate({ values: closes, period: 14 }).slice(-1)[0];
  const ema9 = technicalIndicators.EMA.calculate({ values: closes, period: 9 }).slice(-1)[0];
  const ema21 = technicalIndicators.EMA.calculate({ values: closes, period: 21 }).slice(-1)[0];
  const atr = technicalIndicators.ATR.calculate({ high: highs, low: lows, close: closes, period: 14 }).slice(-1)[0];

  return { rsi, ema9, ema21, atr };
}

export default async function handler(req, res) {
  try {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'OPUSDT'];
    const signals = [];

    for (const symbol of symbols) {
      const candles = await getKlines(symbol);
      const { rsi, ema9, ema21, atr } = calculateIndicators(candles);
      const lastPrice = candles.slice(-1)[0].close;

      const direction = rsi < 30 && ema9 > ema21 ? 'BUY' : rsi > 70 && ema9 < ema21 ? 'SELL' : null;

      if (direction) {
        const entry = lastPrice;
        const sl = direction === 'BUY' ? entry - atr : entry + atr;
        const tp = direction === 'BUY' ? entry + atr * 2 : entry - atr * 2;
        const rr = 2.0;
        const confidence = Math.round(Math.min(100, Math.abs(rsi - 50) + 50));
        const tradeType = 'SCALP';

        signals.push({
          symbol,
          direction,
          tradeType,
          entry: parseFloat(entry.toFixed(2)),
          sl: parseFloat(sl.toFixed(2)),
          tp: parseFloat(tp.toFixed(2)),
          confidence,
          rr,
          status: "ACTIVE",
          time: "1m"
        });
      }
    }

    res.status(200).json({ signals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
