let currentParty = "tossup";
const partyGradients = {
  democrat: ["#193B6D", "#345789", "#5673A5", "#7A93C2"],
  republican: ["#6B0F0F", "#8B2F2F", "#AC4F4F", "#D06F6F"],
  tossup: ["#C4C4C4"]
};
const partyTotals = {
  democrat: 0,
  republican: 0,
  tossup: 538
};
const stateVotes = {};

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentParty = btn.id.replace("-btn", "");
    updateButtonStyles();
  });
});

function updateButtonStyles() {
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`${currentParty}-btn`).classList.add("active");
}

function updateCounts() {
  document.getElementById("dem-count").textContent = partyTotals.democrat;
  document.getElementById("rep-count").textContent = partyTotals.republican;
  document.getElementById("tossup-count").textContent = partyTotals.tossup;
}

document.getElementById("map").addEventListener("load", () => {
  const svgDoc = document.getElementById("map").contentDocument;
  const states = svgDoc.querySelectorAll("[region]");

  states.forEach(state => {
    const stateId = state.getAttribute("region");
    const votes = parseInt(state.getAttribute("value"), 10);
    stateVotes[stateId] = votes;

    state.setAttribute("data-party", "tossup");
    state.setAttribute("data-gradient-index", "0");

    state.addEventListener("click", () => {
      let party = state.getAttribute("data-party");
      let index = parseInt(state.getAttribute("data-gradient-index"));

      if (party !== currentParty) {
        partyTotals[party] -= stateVotes[stateId];
        party = currentParty;
        index = 0;
      } else {
        index = (index + 1) % partyGradients[party].length;
      }

      state.setAttribute("data-party", party);
      state.setAttribute("data-gradient-index", index);
      state.setAttribute("fill", partyGradients[party][index]);

      partyTotals[party] += stateVotes[stateId];
      updateCounts();
    });
  });
});
