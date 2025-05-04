let currentParty = "tossup";
const partyColors = {
  democrat: "#375A85",
  republican: "#B25B5B",
  tossup: "#C4C4C4"
};

const counts = {
  democrat: 0,
  republican: 0,
  tossup: 538
};

function updateCounts() {
  document.getElementById("dem-count").textContent = counts.democrat;
  document.getElementById("rep-count").textContent = counts.republican;
  document.getElementById("tossup-count").textContent = counts.tossup;

  // Update bar widths
  const total = 538;
  const demPct = (counts.democrat / total) * 100;
  const repPct = (counts.republican / total) * 100;
  const tossupPct = 100 - demPct - repPct;

  document.getElementById("dem-bar").style.width = `${demPct}%`;
  document.getElementById("rep-bar").style.width = `${repPct}%`;
  document.getElementById("tossup-bar").style.width = `${tossupPct}%`;
}



function setButtonActive(id) {
  ["dem-btn", "rep-btn", "tossup-btn"].forEach(btn => {
    document.getElementById(btn).classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

document.getElementById("dem-btn").onclick = () => {
  currentParty = "democrat";
  setButtonActive("dem-btn");
};
document.getElementById("rep-btn").onclick = () => {
  currentParty = "republican";
  setButtonActive("rep-btn");
};
document.getElementById("tossup-btn").onclick = () => {
  currentParty = "tossup";
  setButtonActive("tossup-btn");
};

function handleStateClick(state) {
  const ev = parseInt(state.getAttribute("value")) || 0;
  const previousParty = state.dataset.party || "tossup";

  if (previousParty !== currentParty) {
    counts[previousParty] -= ev;
    counts[currentParty] += ev;
    updateCounts();

    // Set both the attribute and inline style
    const color = partyColors[currentParty];
    state.setAttribute("fill", color);
    state.style.fill = color;
    state.dataset.party = currentParty;
  }
}

document.getElementById("map").addEventListener("load", function () {
  const svgDoc = this.contentDocument;
  const states = svgDoc.querySelectorAll("[region]");

  states.forEach(state => {
    state.setAttribute("fill", partyColors.tossup);
    state.dataset.party = "tossup";

    state.addEventListener("click", () => handleStateClick(state));
  });
});
