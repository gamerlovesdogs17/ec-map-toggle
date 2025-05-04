const demShades = ["#1B2A41", "#375A85", "#6A8DB5"];
const repShades = ["#812B2B", "#B25B5B", "#D78B8B"];
const tossupColor = "#C4C4C4";

const electoralVotes = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 54, CO: 10, CT: 7, DC: 3, DE: 3,
  FL: 30, GA: 16, HI: 4, ID: 4, IL: 19, IN: 11, IA: 6, KS: 6, KY: 8,
  LA: 8, MA: 11, MD: 10, ME: 0, ME_AL: 2, ME_01: 1, ME_02: 1,
  MI: 15, MN: 10, MS: 6, MO: 10, MT: 4, NE: 0, NE_AL: 2, NE_01: 1, NE_02: 1, NE_03: 1,
  NV: 6, NH: 4, NJ: 14, NM: 5, NY: 28, NC: 16, ND: 3, OH: 17,
  OK: 7, OR: 8, PA: 19, RI: 4, SC: 9, SD: 3, TN: 11, TX: 40,
  UT: 6, VT: 3, VA: 13, WA: 12, WV: 4, WI: 10, WY: 3
};

let currentParty = "dem";

function setActiveButton(party) {
  currentParty = party;
  document.querySelectorAll(".controls button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`${party}-btn`).classList.add("active");
}

function getNextColor(current, shades) {
  const index = shades.indexOf(current);
  return shades[(index + 1) % shades.length];
}

function updateCounters(svgDoc) {
  let dem = 0, rep = 0, toss = 0;
  const paths = svgDoc.querySelectorAll("path[region]");
  paths.forEach(path => {
    const fill = path.style.fill || tossupColor;
    const rawRegion = path.getAttribute("region")?.toUpperCase();
    const abbr = rawRegion?.replace("-", "_");
    const ev = electoralVotes[abbr] || 0;

    if (demShades.includes(fill)) dem += ev;
    else if (repShades.includes(fill)) rep += ev;
    else toss += ev;
  });

  document.getElementById("dem-count").textContent = dem;
  document.getElementById("rep-count").textContent = rep;
  document.getElementById("tossup-count").textContent = toss;
}

window.addEventListener("DOMContentLoaded", () => {
  setActiveButton("dem");

  document.getElementById("dem-btn").onclick = () => setActiveButton("dem");
  document.getElementById("rep-btn").onclick = () => setActiveButton("rep");
  document.getElementById("tossup-btn").onclick = () => setActiveButton("tossup");

  const mapObj = document.getElementById("map");

  mapObj.addEventListener("load", () => {
    const svgDoc = mapObj.contentDocument;
    const paths = svgDoc.querySelectorAll("path[region]");

    paths.forEach(path => {
      const rawRegion = path.getAttribute("region")?.toUpperCase();
      const abbr = rawRegion?.replace("-", "_");
      if (!abbr || !electoralVotes[abbr]) return;

      path.style.cursor = "pointer";
      path.style.fill = tossupColor;

      path.addEventListener("click", () => {
        const current = path.style.fill;

        if (currentParty === "dem") {
          const next = demShades.includes(current) ? getNextColor(current, demShades) : demShades[0];
          path.style.fill = next;
        } else if (currentParty === "rep") {
          const next = repShades.includes(current) ? getNextColor(current, repShades) : repShades[0];
          path.style.fill = next;
        } else {
          path.style.fill = tossupColor;
        }

        updateCounters(svgDoc);
      });
    });

    updateCounters(svgDoc);
  });
});
