async function fetchSignals() {
  const res = await fetch('./data/coins.json');
  const data = await res.json();

  const container = document.getElementById('signals');
  container.innerHTML = '';

  data.signals.forEach(signal => {
    const el = document.createElement('div');
    el.className = 'signal';
    el.innerHTML = `
      <strong>${signal.coin}</strong><br/>
      Type: ${signal.type} <br/>
      Entry: ${signal.entry} <br/>
      SL: ${signal.sl} | TP1: ${signal.tp1} | TP2: ${signal.tp2} <br/>
      Time: ${signal.time} ago
    `;
    container.appendChild(el);
  });
}
fetchSignals();
setInterval(fetchSignals, 60000);
