let currentParty = 'tossup';
const counts = { democrat: 0, republican: 0, tossup: 538 };

function setParty(party) {
  currentParty = party;
  document.querySelectorAll('.party-btn').forEach(btn => btn.classList.remove('selected'));
  document.getElementById(party + 'Btn').classList.add('selected');
}

function updateCounts() {
  document.getElementById("dem-count").textContent = counts.democrat;
  document.getElementById("rep-count").textContent = counts.republican;
  document.getElementById("tossup-count").textContent = counts.tossup;

  const total = 538;
  const demPercent = (counts.democrat / total) * 100;
  const repPercent = (counts.republican / total) * 100;
  const tossupPercent = (counts.tossup / total) * 100;

  document.getElementById("dem-bar").style.width = `${demPercent}%`;
  document.getElementById("rep-bar").style.width = `${repPercent}%`;
  document.getElementById("tossup-bar").style.width = `${tossupPercent}%`;
}

// Attach state click events once SVG loads
document.getElementById("us-map").addEventListener("load", () => {
  const svgDoc = document.getElementById("us-map").contentDocument;
  const states = svgDoc.querySelectorAll("path");

  states.forEach(state => {
    state.addEventListener("click", () => {
      const stateId = state.id;
      const vote = parseInt(state.getAttribute("data-votes") || 0);
      const prev = state.getAttribute("data-party") || "tossup";

      // Subtract from previous
      if (prev !== "none") counts[prev] -= vote;

      // Add to new
      counts[currentParty] += vote;

      // Update party
      state.setAttribute("data-party", currentParty);

      // Color
      let fillColor = "#666";
      if (currentParty === "democrat") fillColor = "#002868";
      else if (currentParty === "republican") fillColor = "#8b0000";
      state.style.fill = fillColor;

      updateCounts();
    });
  });
});

updateCounts();
