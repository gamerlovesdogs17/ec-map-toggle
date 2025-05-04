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
  document.querySelectorAll('.party-button').forEach(button => {
    button.classList.remove('selected');
  });
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
      state.addEventListener("click", () => {
        const value = parseInt(state.getAttribute("value"));
        const current = state.getAttribute("data-party") || "tossup";

        // Subtract from previous party
        counts[current] -= value;

        // Update to new party
        state.setAttribute("fill", partyColors[selectedParty]);
        state.setAttribute("data-party", selectedParty);
        counts[selectedParty] += value;

        updateCounts();
      });

      // Initialize party color on page load
      const initialParty = state.getAttribute("data-party") || "tossup";
      const initialValue = parseInt(state.getAttribute("value"));
      state.setAttribute("fill", partyColors[initialParty]);
      counts[initialParty] += initialValue;
    });

    updateCounts();
  });
}

window.onload = () => {
  initializeMap();
  updateCounts();
};
