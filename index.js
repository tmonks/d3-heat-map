// margins and dimensions
const w = 1024;
const h = 600;
const legendWidth = 300;
const legendHeight = 20;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const graphWidth = w - margin.left - margin.right;
const graphHeight = h - margin.top - margin.bottom;

// months for y-axis
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    .then((data) => data.monthlyVariance)
    .then((data) => {
      const minDate = new Date(d3.min(data, (d) => d.year), 0, 1);
      const maxDate = new Date(d3.max(data, (d) => d.year), 0, 1);
      console.log(`Retrieved ${data.length} records`);
      console.log(`Found data from ${minDate} to ${maxDate}`);

      // yScale is bands for each of the 12 months
      const yScale = d3
        .scaleBand()
        .domain(months)
        .range([0, graphHeight]);
      
      // xScale is a time scale of all the possible years
      const xScale = d3
        .scaleLinear()
        .domain([minDate, maxDate])
        .range([0, graphWidth])

      console.log('1753 would be ' + xScale(new Date(1753, 0, 1)));
      console.log('1880 would be ' + xScale(new Date(1880, 0, 1)));
      console.log('2000 would be ' + xScale(new Date(2000, 0, 1)));
    });
});