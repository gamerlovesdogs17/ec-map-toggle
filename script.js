let currentParty = 'tossup';
const partyCycle = ['tossup', 'democrat', 'republican'];
const partyColors = {
  tossup: '#cccccc',
  democrat: '#0c2340',
  republican: '#8b0000'
};
const voteCounts = {
  democrat: 0,
  republican: 0,
  tossup: 538
};

document.querySelectorAll('.toggle-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.toggle-button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    currentParty = button.getAttribute('data-party');
  });
});

function updateCounters() {
  document.getElementById('dem-count').textContent = voteCounts.democrat;
  document.getElementById('rep-count').textContent = voteCounts.republican;
  document.getElementById('tossup-count').textContent = voteCounts.tossup;
}

document.querySelectorAll('#map path').forEach(state => {
  const value = parseInt(state.getAttribute('value')) || 0;
  state.setAttribute('data-party', 'tossup');
  state.setAttribute('fill', partyColors.tossup);

  state.addEventListener('click', () => {
    const current = state.getAttribute('data-party');
    let nextParty = currentParty;

    if (current === currentParty) {
      // Cycle through party gradients
      const index = partyCycle.indexOf(current);
      nextParty = partyCycle[(index + 1) % partyCycle.length];
    }

    state.setAttribute('data-party', nextParty);
    state.setAttribute('fill', partyColors[nextParty]);

    // Update vote totals
    voteCounts[current] -= value;
    voteCounts[nextParty] += value;
    updateCounters();
  });
});

updateCounters();
