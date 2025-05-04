const demShades = ["#1B2A41", "#375A85", "#6A8DB5"];
const repShades = ["#812B2B", "#B25B5B", "#D78B8B"];
const tossupColor = "#C4C4C4";

const electoralVotes = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 54, CO: 10, CT: 7, DE: 3, FL: 30,
  GA: 16, HI: 4, ID: 4, IL: 19, IN: 11, IA: 6, KS: 6, KY: 8, LA: 8,
  ME: 2, "ME-01": 1, "ME-02": 1, MD: 10, MA: 11, MI: 15, MN: 10, MS: 6,
  MO: 10, MT: 4, NE: 2, "NE-01": 1, "NE-02": 1, "NE-03": 1, NV: 6, NH: 4,
  NJ: 14, NM: 5, NY: 28, NC: 16, ND: 3, OH: 17, OK: 7, OR: 8, PA: 19,
  RI: 4, SC: 9, SD: 3, TN: 11, TX: 40, UT: 6, VT: 3, VA: 13, WA: 12,
  WV: 4, WI: 10, WY: 3, DC: 3
};

let currentParty = "dem";

function setActiveButton(party) {
  currentParty = party;

  document.getElementById("dem-btn").classList.remove("active");
  document.getElementById("rep-btn").classList.remove("active");
  document.getElementById("tossup-btn").classList.remove("active");

  document.getElementById(`${party}-btn`).classList.add("active");
}

function getNextColor(current, shades) {
  const index = shades.indexOf(current);
  return shades[(index + 1) % shades.length];
}

function updateCounters() {
  let dem = 0, rep = 0, toss = 0;
  document.querySelectorAll("path[state-id]").forEach(path => {
    const color = path.getAttribute("fill");
    const id = path.getAttribute("state-id");
    const ev = electoralVotes[id] || 0;

    if (demShades.includes(color)) dem += ev;
    else if (repShades.includes(color)) rep += ev;
    else toss += ev;
  });

  document.getElementById("dem-count").textContent = dem;
  document.getElementById("rep-count").textContent = rep;
  document.getElementById("tossup-count").textContent = toss;
}

window.addEventListener("DOMContentLoaded", () => {
  // Button click handlers
  document.getElementById("dem-btn").onclick = () => setActiveButton("dem");
  document.getElementById("rep-btn").onclick = () => setActiveButton("rep");
  document.getElementById("tossup-btn").onclick = () => setActiveButton("tossup");

  setActiveButton("dem"); // Set default

  const mapObj = document.getElementById("map");
  mapObj.addEventListener("load", () => {
    const svg = mapObj.contentDocument;
    if (!svg) {
      console.error("SVG not loaded or inaccessible");
      return;
    }

    const paths = svg.querySelectorAll("path");

    paths.forEach(path => {
      const id = path.getAttribute("id");
      if (!id) return;

      path.setAttribute("state-id", id);
      path.setAttribute("fill", tossupColor);
      path.style.cursor = "pointer";

      path.addEventListener("click", () => {
        const current = path.getAttribute("fill");

        if (currentParty === "dem") {
          const next = demShades.includes(current) ? getNextColor(current, demShades) : demShades[0];
          path.setAttribute("fill", next);
        } else if (currentParty === "rep") {
          const next = repShades.includes(current) ? getNextColor(current, repShades) : repShades[0];
          path.setAttribute("fill", next);
        } else {
          path.setAttribute("fill", tossupColor);
        }

        updateCounters();
      });
    });

    updateCounters();
  });
});
