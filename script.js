let currentParty = 'tossup';

const partyColors = {
  dem: ['#0c2340', '#304d80', '#5f7db8'],
  rep: ['#8b0000', '#b22222', '#e06666'],
  tossup: ['#c4c4c4']
};

const stateData = {};

function selectParty(party) {
  currentParty = party;

  document.getElementById('dem-btn').classList.remove('selected');
  document.getElementById('rep-btn').classList.remove('selected');
  document.getElementById('tossup-btn').classList.remove('selected');

  document.getElementById(`${party}-btn`).classList.add('selected');
}

function updateCounts() {
  let counts = { dem: 0, rep: 0, tossup: 0 };

  for (const state in stateData) {
    const info = stateData[state];
    const votes = parseInt(info.votes, 10);
    counts[info.party] += votes;
  }

  document.getElementById('dem-count').textContent = counts.dem;
  document.getElementById('rep-count').textContent = counts.rep;
  document.getElementById('tossup-count').textContent = counts.tossup;
}

function cycleStateColor(stateEl) {
  const id = stateEl.getAttribute('id') || stateEl.getAttribute('short-name');
  if (!id) return;

  const value = parseInt(stateEl.getAttribute('value'), 10) || 0;

  if (!stateData[id]) {
    stateData[id] = { party: currentParty, level: 0, votes: value };
  } else {
    const data = stateData[id];
    if (data.party === currentParty) {
      data.level = (data.level + 1) % partyColors[currentParty].length;
    } else {
      data.party = currentParty;
      data.level = 0;
    }
  }

  const data = stateData[id];
  const fillColor = partyColors[data.party][data.level] || partyColors[data.party][0];
  stateEl.setAttribute('fill', fillColor);
  updateCounts();
}

document.addEventListener('DOMContentLoaded', () => {
  const mapObj = document.getElementById('map');
  mapObj.addEventListener('load', () => {
    const svgDoc = mapObj.contentDocument;
    const states = svgDoc.querySelectorAll('[region]');

    states.forEach(state => {
      state.addEventListener('click', () => cycleStateColor(state));
      const id = state.getAttribute('region');
      const votes = parseInt(state.getAttribute('value'), 10) || 0;
      stateData[id] = { party: 'tossup', level: 0, votes };
      state.setAttribute('fill', partyColors.tossup[0]);
    });

    updateCounts();
  });
});
