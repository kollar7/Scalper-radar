async function fetchSignals() {
  const response = await fetch('signals.json');
  const data = await response.json();

  const container = document.getElementById('signals');
  container.innerHTML = '';

  data.signals.forEach(signal => {
    const statusClass = 'status-' + signal.status.toUpperCase();
    let confClass = 'confidence-low';
    if (signal.confidence >= 80) confClass = 'confidence-high';
    else if (signal.confidence >= 60) confClass = 'confidence-medium';

    const el = document.createElement('div');
    el.className = 'signal';
    el.innerHTML = `
      <strong>${signal.coin}</strong><br/>
      Type: ${signal.direction} | ${signal.tradeType} <br/>
      Entry: ${signal.entry} <br/>
      SL: ${signal.sl} | TP1: ${signal.tp1} | TP2: ${signal.tp2} <br/>
      Confidence: <span class="${confClass}">${signal.confidence}%</span><br/>
      Status: <span class="${statusClass}">${signal.status}</span><br/>
      Time: ${signal.time} ago
    `;
    container.appendChild(el);
  });
}
fetchSignals();
setInterval(fetchSignals, 60000);
