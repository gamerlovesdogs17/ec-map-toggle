const partyColors = {
  democrat: ["#0a3069", "#1d4f91", "#517ea8"],
  republican: ["#7b1e1e", "#a53a3a", "#c56d6d"],
  tossup: ["#C4C4C4"]
};

const electoralVotes = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 54, CO: 10, CT: 7, DC: 3, DE: 3,
  FL: 30, GA: 16, HI: 4, ID: 4, IL: 19, IN: 11, IA: 6, KS: 6, KY: 8,
  LA: 8, MA: 11, MD: 10, ME: 0, ME_AL: 2, ME_01: 1, ME_02: 1,
  MI: 15, MN: 10, MS: 6, MO: 10, MT: 4, NE: 0, NE_AL: 2, NE_01: 1, NE_02: 1, NE_03: 1,
  NV: 6, NH: 4, NJ: 14, NM: 5, NY: 28, NC: 16, ND: 3, OH: 17,
  OK: 7, OR: 8, PA: 19, RI: 4, SC: 9, SD: 3, TN: 11, TX: 40,
  UT: 6, VT: 3, VA: 13, WA: 12, WV: 4, WI: 10, WY: 3
};

let selectedParty = "democrat";
let stateData = {};

function updateCounts() {
  let counts = { democrat: 0, republican: 0, tossup: 0 };
  for (const [state, data] of Object.entries(stateData)) {
    const party = data.party;
    const ev = data.votes;
    if (counts[party] !== undefined) counts[party] += ev;
  }
  document.getElementById("dem-count").textContent = counts.democrat;
  document.getElementById("rep-count").textContent = counts.republican;
  document.getElementById("tossup-count").textContent = counts.tossup;
}

function normalizeRegion(region) {
  return region.replace("-", "_").toUpperCase();
}

function applyParty(svgDoc, el, abbr) {
  if (!stateData[abbr]) {
    stateData[abbr] = { party: "tossup", index: 0, votes: electoralVotes[abbr] || 0 };
  }

  const party = stateData[abbr].party;
  let index = stateData[abbr].index;

  if (party === "tossup") {
    stateData[abbr].party = selectedParty;
    stateData[abbr].index = 0;
  } else if (party === selectedParty) {
    index = (index + 1) % partyColors[selectedParty].length;
    stateData[abbr].index = index;
  } else {
    stateData[abbr].party = selectedParty;
    stateData[abbr].index = 0;
  }

  const newColor = partyColors[stateData[abbr].party][stateData[abbr].index];
  el.setAttribute("fill", newColor);
  updateCounts();
}

window.addEventListener("load", () => {
  const object = document.getElementById("map");
  object.addEventListener("load", () => {
    const svgDoc = object.contentDocument;
    const regions = svgDoc.querySelectorAll("[region]");

    regions.forEach(el => {
      const regionRaw = el.getAttribute("region");
      const abbr = normalizeRegion(regionRaw);
      const ev = electoralVotes[abbr] || 0;
      stateData[abbr] = { party: "tossup", index: 0, votes: ev };
      el.setAttribute("fill", partyColors.tossup[0]);

      el.style.cursor = "pointer";
      el.addEventListener("click", () => applyParty(svgDoc, el, abbr));
    });

    updateCounts();
  });
});

// Button Handlers
["democrat", "republican", "tossup"].forEach(party => {
  document.getElementById(`${party.slice(0,3)}-btn`).addEventListener("click", () => {
    selectedParty = party;
    document.querySelectorAll(".party-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById(`${party.slice(0,3)}-btn`).classList.add("active");
  });
});
