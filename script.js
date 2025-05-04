let currentParty = "tossup";

const counts = {
  democrat: 0,
  republican: 0,
  tossup: 538
};

document.getElementById("dem-button").addEventListener("click", () => selectParty("democrat"));
document.getElementById("rep-button").addEventListener("click", () => selectParty("republican"));
document.getElementById("tossup-button").addEventListener("click", () => selectParty("tossup"));

function selectParty(party) {
  currentParty = party;
  document.querySelectorAll(".party-button").forEach(btn => btn.classList.remove("selected"));
  document.getElementById(`${party}-button`).classList.add("selected");
}

function updateCounts() {
  const totalVotes = 538;
  const dem = counts.democrat;
  const rep = counts.republican;
  const tossup = totalVotes - dem - rep;

  counts.tossup = tossup;

  document.getElementById("dem-count").textContent = dem;
  document.getElementById("rep-count").textContent = rep;
  document.getElementById("tossup-count").textContent = tossup;

  const demPct = (dem / totalVotes) * 100;
  const repPct = (rep / totalVotes) * 100;
  const tossPct = 100 - demPct - repPct;

  document.getElementById("dem-bar").style.width = `${demPct}%`;
  document.getElementById("rep-bar").style.width = `${repPct}%`;
  document.getElementById("tossup-bar").style.width = `${tossPct}%`;
}

window.addEventListener("DOMContentLoaded", () => {
  const mapObject = document.getElementById("map");

  mapObject.addEventListener("load", () => {
    const svgDoc = mapObject.contentDocument;
    const states = svgDoc.querySelectorAll("path, rect");

    states.forEach(state => {
      const id = state.id;
      const ev = parseInt(state.getAttribute("data-votes") || state.getAttribute("data-ev") || 0);

      state.addEventListener("click", () => {
        const previous = state.getAttribute("data-party") || "tossup";

        if (previous === currentParty) return;

        // Subtract old
        if (previous !== "tossup") counts[previous] -= ev;
        // Add new
        if (currentParty !== "tossup") counts[currentParty] += ev;

        // Apply new class
        state.setAttribute("data-party", currentParty);
        state.style.fill = getFillColor(currentParty);

        updateCounts();
      });
    });

    updateCounts();
  });
});

function getFillColor(party) {
  switch (party) {
    case "democrat": return "#0b2e5e";
    case "republican": return "#8b0000";
    default: return "#bfbfbf";
  }
}
