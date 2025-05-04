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
  document.getElementById("dem-count").textContent = counts.democrat;
  document.getElementById("rep-count").textContent = counts.republican;
  document.getElementById("tossup-count").textContent = counts.tossup;

  const total = 538;
  const demPct = (counts.democrat / total) * 100;
  const repPct = (counts.republican / total) * 100;
  const tossupPct = 100 - demPct - repPct;

  document.getElementById("dem-bar").style.width = `${demPct}%`;
  document.getElementById("rep-bar").style.width = `${repPct}%`;
  document.getElementById("tossup-bar").style.width = `${tossupPct}%`;
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
