let selectedParty = 'tossup';

const partyColors = {
  democrat: '#003366',
  republican: '#8B0000',
  tossup: '#C0C0C0'
};

const counts = {
  democrat: 0,
  republican: 0,
  tossup: 538
};

function setParty(party) {
  selectedParty = party;
  document.querySelectorAll('.party-button').forEach(btn =>
    btn.classList.remove('selected')
  );
  document.getElementById(`${party}-button`).classList.add('selected');
}

function updateCounts() {
  const total = 538;
  const dem = counts.democrat;
  const rep = counts.republican;
  const toss = total - dem - rep;

  counts.tossup = toss;

  document.getElementById("dem-count").textContent = dem;
  document.getElementById("rep-count").textContent = rep;
  document.getElementById("tossup-count").textContent = toss;

  const demPct = (dem / total) * 100;
  const repPct = (rep / total) * 100;
  const tossPct = 100 - demPct - repPct;

  document.getElementById("dem-bar").style.width = `${demPct}%`;
  document.getElementById("rep-bar").style.width = `${repPct}%`;
  document.getElementById("tossup-bar").style.width = `${tossPct}%`;
}

function initializeMap() {
  const svgObject = document.getElementById("map");
  svgObject.addEventListener("load", () => {
    const svgDoc = svgObject.contentDocument;
    const states = svgDoc.querySelectorAll("[value]");

    states.forEach(state => {
      const value = parseInt(state.getAttribute("value")) || 0;
      state.setAttribute("data-party", "tossup");
      state.setAttribute("fill", partyColors.tossup);

      state.addEventListener("click", () => {
        const prevParty = state.getAttribute("data-party");
        if (prevParty === selectedParty) return;

        // Subtract from previous party
        counts[prevParty] -= value;

        // Add to selected party
        counts[selectedParty] += value;
        state.setAttribute("data-party", selectedParty);
        state.setAttribute("fill", partyColors[selectedParty]);

        updateCounts();
      });
    });

    updateCounts();
  });
}

window.onload = () => {
  initializeMap();
};
