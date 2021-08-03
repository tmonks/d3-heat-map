// margins and dimensions
const w = 1024;
const h = 600;
const legendWidth = 300;
const legendHeight = 20;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const graphWidth = w - margin.left - margin.right;
const graphHeight = h - margin.top - margin.bottom;

// main svg
const svg = d3.select(".canvas").append("svg").attr("width", w).attr("height", h);

// create graph area
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`); // move it by margin sizes

// create legend area
const legend = svg.append("g").attr("width", legendWidth).attr("height", legendHeight).attr("id", "legend");

// add title
svg
  .append("text")
  .attr("id", "title")
  .attr("x", w / 2)
  .attr("y", 30)
  .text("Monthly Global Land-Surface Temperature");

// add description
svg
  .append("text")
  .attr("id", "description")
  .attr("x", w / 2)
  .attr("y", 60)
  .text("1753 - 2015: base temperature 8.66");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then((res) => res.json())
    .then((data) => {
      const minYear = d3.min(data.monthlyVariance, (d) => d.year);
      const maxYear = d3.max(data.monthlyVariance, (d) => d.year);
      console.log(`Retrieved ${data.monthlyVariance.length} records`);
      console.log(`Found data from ${minYear} to ${maxYear}`);
    });
});