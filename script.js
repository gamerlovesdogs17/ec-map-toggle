// script.js

let currentParty = null;
const partyColors = {
  Democrat: ["#223E64", "#2D4E7C", "#3C5F91", "#647B9F"],
  Republican: ["#6D1D1D", "#8C2D2D", "#A54B4B", "#BC7E7E"],
  Tossup: ["#C4C4C4"]
};

const voteCounts = {
  Democrat: 0,
  Republican: 0,
  Tossup: 538
};

const stateData = {}; // Stores current index for each state and party

// Add event listeners to party toggle buttons
document.querySelectorAll(".toggle-button").forEach(button => {
  button.addEventListener("click", () => {
    currentParty = button.dataset.party;
    document.querySelectorAll(".toggle-button").forEach(btn => {
      if (btn === button) {
        btn.classList.add("selected");
      } else {
        btn.classList.remove("selected");
      }
    });
  });
});

function updateCounts() {
  document.getElementById("dem-count").textContent = voteCounts.Democrat;
  document.getElementById("rep-count").textContent = voteCounts.Republican;
  document.getElementById("tossup-count").textContent = voteCounts.Tossup;
}

function changeStateColor(stateEl) {
  if (!currentParty || !stateEl.hasAttribute("value")) return;
  const stateId = stateEl.getAttribute("region") || stateEl.id;
  const ev = parseInt(stateEl.getAttribute("value"), 10);

  // Initialize state data if missing
  if (!stateData[stateId]) {
    stateData[stateId] = {
      party: "Tossup",
      index: 0
    };
  }

  // Remove old count
  const oldParty = stateData[stateId].party;
  if (oldParty !== "Tossup") voteCounts[oldParty] -= ev;
  else voteCounts.Tossup -= ev;

  // Cycle to new index
  if (stateData[stateId].party !== currentParty) {
    stateData[stateId].index = 0;
    stateData[stateId].party = currentParty;
  } else {
    stateData[stateId].index = (stateData[stateId].index + 1) % partyColors[currentParty].length;
  }

  // Apply new color
  const fillColor = partyColors[currentParty][stateData[stateId].index];
  stateEl.style.fill = fillColor;

  // Add new count
  voteCounts[currentParty] += ev;

  updateCounts();
}

// Load the SVG and bind clicks
const mapObject = document.getElementById("map");
mapObject.addEventListener("load", function () {
  const svgDoc = mapObject.contentDocument;
  const states = svgDoc.querySelectorAll("[value]");
  states.forEach(state => {
    state.style.cursor = "pointer";
    state.addEventListener("click", () => changeStateColor(state));
  });

  updateCounts();
});
