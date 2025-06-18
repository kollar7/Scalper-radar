async function fetchSignals() {
  const response = await fetch('https://scalpradar-api.vercel.app/signals');
  const data = await response.json();

  const container = document.getElementById('signals');
  container.innerHTML = '';

  data.signals.forEach(signal => {
    const statusClass = 'status-' + signal.status.toUpperCase();
    let confClass = 'confidence-low';
    if (signal.confidence >= 80) confClass = 'confidence-high';
    else if (signal.confidence >= 60) confClass = 'confidence-medium';

    let rrClass = 'rr-bad';
    if (signal.rr >= 2) rrClass = 'rr-good';
    else if (signal.rr >= 1.5) rrClass = 'rr-medium';

    const el = document.createElement('div');
    el.className = 'signal';
    el.innerHTML = `
      <strong>${signal.coin}</strong><br/>
      Type: ${signal.direction} | ${signal.tradeType} <br/>
      Entry: ${signal.entry} <br/>
      SL: ${signal.sl} | TP: ${signal.tp} <br/>
      Confidence: <span class="${confClass}">${signal.confidence}%</span><br/>
      RR: <span class="${rrClass}">${signal.rr}</span><br/>
      Status: <span class="${statusClass}">${signal.status}</span><br/>
      Time: ${signal.time} ago
    `;
    container.appendChild(el);
  });
}
fetchSignals();
setInterval(fetchSignals, 60000);
