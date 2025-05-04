let selectedParty = 'tossup';

const partyColors = {
  democrat: '#003366',
  republican: '#8B0000',
  tossup: '#C0C0C0'
};

const voteCounts = {
  democrat: 0,
  republican: 0,
  tossup: 538
};

function setParty(party) {
  selectedParty = party;
  document.querySelectorAll(".party-button").forEach(btn => btn.classList.remove("selected"));
  document.getElementById(`${party}-btn`).classList.add("selected");
}

function updateBar() {
  const total = 538;
  const d = voteCounts.democrat;
  const r = voteCounts.republican;
  const t = voteCounts.tossup;

  document.getElementById("dem-bar").style.width = `${(d / total) * 100}%`;
  document.getElementById("rep-bar").style.width = `${(r / total) * 100}%`;
  document.getElementById("tossup-bar").style.width = `${(t / total) * 100}%`;

  document.getElementById("dem-count").textContent = d;
  document.getElementById("rep-count").textContent = r;
  document.getElementById("tossup-count").textContent = t;
}

function applyColor(el, party) {
  el.style.fill = partyColors[party];
  el.setAttribute("data-party", party);
}

function setupMap() {
  const svgDoc = document.getElementById("us-map").contentDocument;
  if (!svgDoc) return;

  const regions = svgDoc.querySelectorAll("[region][value]");
  regions.forEach(el => {
    el.setAttribute("data-party", "tossup");
    el.style.fill = partyColors.tossup;

    el.addEventListener("click", () => {
      const value = parseInt(el.getAttribute("value")) || 0;
      const oldParty = el.getAttribute("data-party") || "tossup";

      if (oldParty === selectedParty) return;

      voteCounts[oldParty] -= value;
      voteCounts[selectedParty] += value;

      applyColor(el, selectedParty);
      updateBar();
    });
  });
}

document.getElementById("us-map").addEventListener("load", setupMap);
updateBar();
