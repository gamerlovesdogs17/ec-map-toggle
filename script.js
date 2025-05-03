const gradients = [
    { party: "tossup", color: "#d3d3d3", count: 0 },
    { party: "dem", color: "#4b679e", count: 0 },
    { party: "dem", color: "#869cb7", count: 0 },
    { party: "dem", color: "#0b1e3c", count: 0 },
    { party: "rep", color: "#7d3b3a", count: 0 },
    { party: "rep", color: "#a07070", count: 0 },
    { party: "rep", color: "#3b0d0c", count: 0 },
  ];
  
  const electoralVotes = {
    // example: "CA": 54, "TX": 40, ...
    // Replace with your full state code-to-EV dictionary
  };
  
  function updateCounters() {
    let dem = 0, rep = 0, toss = 0;
    document.querySelectorAll("path[state-id]").forEach(el => {
      const color = el.getAttribute("fill");
      const ev = electoralVotes[el.getAttribute("state-id")] || 0;
      if (color === gradients[1].color || color === gradients[2].color || color === gradients[3].color) dem += ev;
      else if (color === gradients[4].color || color === gradients[5].color || color === gradients[6].color) rep += ev;
      else toss += ev;
    });
    document.getElementById("dem-count").textContent = dem;
    document.getElementById("rep-count").textContent = rep;
    document.getElementById("tossup-count").textContent = toss;
  }
  
  document.getElementById("map").addEventListener("load", () => {
    const svgDoc = document.getElementById("map").contentDocument;
    const paths = svgDoc.querySelectorAll("path");
    paths.forEach(path => {
      const id = path.getAttribute("id");
      if (!id) return;
      path.setAttribute("state-id", id);
      let index = 0;
      path.setAttribute("fill", gradients[index].color);
      path.style.cursor = "pointer";
      path.addEventListener("click", () => {
        index = (index + 1) % gradients.length;
        path.setAttribute("fill", gradients[index].color);
        updateCounters();
      });
    });
    updateCounters();
  });
  