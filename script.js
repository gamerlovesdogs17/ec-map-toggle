let currentParty = 'tossup';

const partyColors = {
  dem: ['#0c2340', '#304d80', '#5f7db8'],
  rep: ['#8b0000', '#b22222', '#e06666'],
  tossup: ['#c4c4c4']
};

const stateData = {};

function selectParty(party) {
  currentParty = party;
  ['dem', 'rep', 'tossup'].forEach(p => {
    document.getElementById(`${p}-btn`).classList.remove('selected');
  });
  document.getElementById(`${party}-btn`).classList.add('selected');
}

function updateCounts() {
  let counts = { dem: 0, rep: 0, tossup: 0 };
  for (const id in stateData) {
    const { party, votes } = stateData[id];
    counts[party] += votes;
  }

  document.getElementById('dem-count').textContent = counts.dem;
  document.getElementById('rep-count').textContent = counts.rep;
  document.getElementById('tossup-count').textContent = counts.tossup;
}

function getNextColorIndex(stateId, party) {
  const state = stateData[stateId];
  if (!state || state.party !== party) return 0;
  return (state.level + 1) % partyColors[party].length;
}

function updateLabelColor(stateId, party) {
  const label = document.getElementById(`${stateId}-label`);
  if (label) {
    label.style.fill = (party === 'tossup') ? 'black' : 'white';
  }
}

function onStateClick(stateEl) {
  const id = stateEl.getAttribute('region');
  if (!id || !stateData[id]) return;

  const value = stateData[id].votes;

  stateData[id].party = currentParty;
  stateData[id].level = getNextColorIndex(id, currentParty);
  const fillColor = partyColors[currentParty][stateData[id].level];

  stateEl.style.fill = fillColor;

  // Update label color too
  updateLabelColor(id, currentParty);

  updateCounts();
}

window.addEventListener('load', () => {
  const states = document.querySelectorAll('svg [region]');
  states.forEach(state => {
    const id = state.getAttribute('region');
    const value = parseInt(state.getAttribute('value')) || 0;

    stateData[id] = { party: 'tossup', level: 0, votes: value };

    state.style.fill = partyColors.tossup[0];

    // Set initial label color
    updateLabelColor(id, 'tossup');

    state.addEventListener('click', () => onStateClick(state));
  });

  updateCounts();
  selectParty('tossup');
});
