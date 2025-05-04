let selectedParty = "Tossup";

const partyColors = {
  Democrat: ["#0b2b4c", "#1d4372", "#3b73b9"], // Safe, Likely, Lean
  Republican: ["#6b1f1b", "#a9443f", "#cc6c5a"], // Safe, Likely, Lean
  Tossup: ["#C4C4C4"]
};

const voteCounts = {
  Democrat: 0,
  Republican: 0,
  Tossup: 538
};

const stateData = {};

document.querySelectorAll(".toggle-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".toggle-button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    selectedParty = button.dataset.party;
  });
});

function updateCounts() {
  document.getElementById("dem-count").textContent = voteCounts.Democrat;
  document.getElementById("rep-count").textContent = voteCounts.Republican;
  document.getElementById("tossup-count").textContent = voteCounts.Tossup;
}

function getNextGradientIndex(stateId, party) {
  const current = stateData[stateId] || { party: "Tossup", level: 0 };
  if (current.party !== party) return 0;
  return (current.level + 1) % partyColors[party].length;
}

function setStateColor(stateEl, color) {
  if (stateEl.tagName === "path" || stateEl.tagName === "g") {
    stateEl.setAttribute("fill", color);
  }
}

function onStateClick(event) {
  const stateEl = event.target.closest("[region]");
  if (!stateEl) return;

  const stateId = stateEl.getAttribute("region");
  const value = parseInt(stateEl.getAttribute("value")) || 0;
  const oldData = stateData[stateId] || { party: "Tossup", level: 0 };
  const oldParty = oldData.party;

  // Subtract old vote
  voteCounts[oldParty] -= value;

  // Get new gradient level
  const newLevel = getNextGradientIndex(stateId, selectedParty);
  stateData[stateId] = { party: selectedParty, level: newLevel };

  // Update color
  const color = partyColors[selectedParty][newLevel];
  setStateColor(stateEl, color);

  // Add new vote
  voteCounts[selectedParty] += value;

  updateCounts();
}

document.addEventListener("DOMContentLoaded", () => {
  const states = document.querySelectorAll("svg [region]");
  states.forEach(state => {
    state.addEventListener("click", onStateClick);
    const value = parseInt(state.getAttribute("value")) || 0;
    voteCounts.Tossup += value;
  });

  updateCounts();
});
