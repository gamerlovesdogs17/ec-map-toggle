let currentParty = "democrat";

const voteData = {
  democrat: 0,
  republican: 0,
  tossup: 538
};

const partyColors = {
  democrat: "#003366",
  republican: "#8B0000",
  tossup: "#999999"
};

function setParty(party) {
  currentParty = party;
  document.querySelectorAll(".select-button").forEach(btn => btn.classList.remove("selected"));
  document.getElementById(`${party}-btn`).classList.add("selected");
}

document.getElementById("democrat-btn").onclick = () => setParty("democrat");
document.getElementById("republican-btn").onclick = () => setParty("republican");
document.getElementById("tossup-btn").onclick = () => setParty("tossup");

function updateBar() {
  const total = voteData.democrat + voteData.republican + voteData.tossup;
  document.getElementById("dem-count").textContent = voteData.democrat;
  document.getElementById("rep-count").textContent = voteData.republican;
  document.getElementById("tossup-count").textContent = voteData.tossup;

  document.getElementById("democrat-bar").style.width = `${(voteData.democrat / total) * 100}%`;
  document.getElementById("republican-bar").style.width = `${(voteData.republican / total) * 100}%`;
  document.getElementById("tossup-bar").style.width = `${(voteData.tossup / total) * 100}%`;
}

function setupMapListeners() {
  const svg = document.getElementById("map").getSVGDocument();
  if (!svg) {
    console.warn("SVG not loaded yet.");
    return;
  }

  const regions = svg.querySelectorAll("path, g");

  regions.forEach(region => {
    const ev = parseInt(region.getAttribute("data-votes")) || 0;
    if (!ev) return;

    region.style.cursor = "pointer";
    region.setAttribute("data-party", "tossup");

    region.addEventListener("click", () => {
      const current = region.getAttribute("data-party") || "tossup";

      if (current === currentParty) return;

      voteData[current] -= ev;
      voteData[currentParty] += ev;

      region.setAttribute("data-party", currentParty);
      region.setAttribute("fill", partyColors[currentParty]);

      updateBar();
    });
  });
}

document.getElementById("map").addEventListener("load", setupMapListeners);
