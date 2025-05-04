const demShades = ["#1B2A41", "#375A85", "#6A8DB5"];
const repShades = ["#812B2B", "#B25B5B", "#D78B8B"];
const tossupColor = "#C4C4C4";

// Electoral votes per state
const electoralVotes = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 54, CO: 10, CT: 7, DE: 3, FL: 30,
  GA: 16, HI: 4, ID: 4, IL: 19, IN: 11, IA: 6, KS: 6, KY: 8, LA: 8,
  ME: 4, MD: 10, MA: 11, MI: 15, MN: 10, MS: 6, MO: 10, MT: 4, NE: 5,
  NV: 6, NH: 4, NJ: 14, NM: 5, NY: 28, NC: 16, ND: 3, OH: 17, OK: 7,
  OR: 8, PA: 19, RI: 4, SC: 9, SD: 3, TN: 11, TX: 40, UT: 6, VT: 3,
  VA: 13, WA: 12, WV: 4, WI: 10, WY: 3, DC: 3
};

let currentParty = "dem"; // Default selected party

document.getElementById("dem-btn").onclick = () => currentParty = "dem";
document.getElementById("rep-btn").onclick = () => currentParty = "rep";
document.getElementById("tossup-btn").onclick = () => currentParty = "tossup";

function getNextColor(currentColor, party) {
  const shades = party === "dem" ? demShades : repShades;
  const index = shades.indexOf(currentColor);
  return shades[(index + 1) % shades.length];
}

function updateCounters() {
  let dem = 0, rep = 0, toss = 0;
  document.querySelectorAll("path[state-id]").forEach(path => {
    const color = path.getAttribute("fill");
    const state = path.getAttribute("state-id");
    const ev = electoralVotes[state] || 0;

    if (demShades.includes(color)) dem += ev;
    else if (repShades.includes(color)) rep += ev;
    else toss += ev;
  });

  document.getElementById("dem-count").textContent = dem;
  document.getElementById("rep-count").textContent = rep;
  document.getElementById("tossup-count").textContent = toss;
}

document.getElementById("map").addEventListener("load", () => {
  const svg = document.getElementById("map").contentDocument;
  const states = svg.querySelectorAll("path");

  states.forEach(path => {
    const id = path.getAttribute("id");
    if (!id) return;
    path.setAttribute("state-id", id);
    path.setAttribute("fill", tossupColor);
    path.style.cursor = "pointer";

    path.addEventListener("click", () => {
      const current = path.getAttribute("fill");

      if (currentParty === "dem") {
        if (!demShades.includes(current)) {
          path.setAttribute("fill", demShades[0]);
        } else {
          const next = getNextColor(current, "dem");
          path.setAttribute("fill", next);
        }
      } else if (currentParty === "rep") {
        if (!repShades.includes(current)) {
          path.setAttribute("fill", repShades[0]);
        } else {
          const next = getNextColor(current, "rep");
          path.setAttribute("fill", next);
        }
      } else {
        path.setAttribute("fill", tossupColor);
      }

      updateCounters();
    });
  });

  updateCounters();
});
