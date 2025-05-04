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

// Run after SVG loads
document.getElementById("us-map").addEventListener("load", () => {
  const svgDoc = document.getElementById("us-map").contentDocument;
  const states = svgDoc.querySelectorAll("path");

  states.forEach(state => {
    const vote = parseInt(state.getAttribute("value") || "0");
    state.setAttribute("data-party", "tossup");

    state.addEventListener("click", () => {
      const prev = state.getAttribute("data-party");
      if (prev !== currentParty) {
        if (prev !== "none") counts[prev] -= vote;
        counts[currentParty] += vote;
        state.setAttribute("data-party", currentParty);

        // Apply fill color
        if (currentParty === "democrat") state.style.fill = "#002868";
        else if (currentParty === "republican") state.style.fill = "#8b0000";
        else state.style.fill = "#999";

        updateCounts();
      }
    });
  });
});

updateCounts();
