// margins and dimensions
const w = 1600;
const h = 600;
const legendWidth = 300;
const legendHeight = 20;
const margin = { top: 100, right: 50, bottom: 50, left: 100 };
const graphWidth = w - margin.left - margin.right;
const graphHeight = h - margin.top - margin.bottom;
const baseTemp = 8.66;

// cell Colors
const cellColors = [ "#f9edccff", "#f9df74ff", "#edae49ff", "#ea2b1fff", "#61210fff" ];

// months for y-axis
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const calcTemp = (variance) => baseTemp + variance;

// add tooltip
const tooltip = d3
  .select(".canvas")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

// main svg
const svg = d3.select(".canvas").append("svg").attr("width", w).attr("height", h);

// create graph area
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`); // move it by margin sizes

// create legend area
const legend = svg
  .append("g")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("id", "legend")
  .attr("transform", "translate(20, 5)");

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
  .html("1753 - 2015: base temperature 8.66 &#176C");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then((res) => res.json())
    .then((data) => data.monthlyVariance)
    .then((data) => {
      const minYear = d3.min(data, d => d.year);
      const maxYear = d3.max(data, d => d.year);
      const minDate = new Date(minYear, 0, 1);
      const maxDate = new Date(maxYear, 0, 1);
      const minTemp = d3.min(data, d => d.variance) + baseTemp;
      const maxTemp = d3.max(data, d => d.variance) + baseTemp;
      console.log(`Retrieved ${data.length} records`);
      console.log(`Found dates from ${minDate} to ${maxDate}`);
      console.log(`Found variance ranging from ${minTemp} to ${maxTemp}`);

      // yScale is bands for each of the 12 months
      const yScale = d3
        .scaleBand()
        .domain(months)
        .range([0, graphHeight]);
      
      // xScale is a time scale of all the possible years
      const xScale = d3
        .scaleTime()
        .domain([minDate, maxDate])
        .range([0, graphWidth])

      // colorScale
      const colorScale = d3
        .scaleQuantize()
        .domain([minTemp, maxTemp])
        .range(cellColors);

      // legend scale
      const legendScale = d3
        .scaleLinear()
        .domain([minTemp, maxTemp])
        .range([0,legendWidth]);

      // x-axis for the years
      const xAxis = d3.axisBottom(xScale);
      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${h - margin.bottom})`) // move it to the bottom edge minus padding
        .call(xAxis);

      // y-axis with months
      const yAxis = d3.axisLeft(yScale);
      svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`) 
        .call(yAxis);

      // legend Axis
      const legendTicks = cellColors.map((x, i) => i * (maxTemp - minTemp) / cellColors.length + minTemp);
      legendTicks.push(maxTemp);
      console.log("ticks: " + legendTicks);
      const legendAxis = d3.axisBottom(legendScale);
      legendAxis.tickValues(legendTicks);
      legendAxis.tickFormat(d3.format(".1f"));
      legend.append("g")
        .attr("id", "legend-axis")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis);

      // legend squares
      legend
        .selectAll("rect")
        .data(cellColors)
        .enter()
        .append("rect")
        .attr("x", (d, i) => (legendWidth / cellColors.length) * i)
        .attr("width", legendWidth / cellColors.length)
        .attr("height", legendHeight)
        .attr("fill", d => d);

      // cells
      graph
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d, i) => xScale(new Date(d.year, 0, 1)))
        .attr("y", (d, i) => yScale(months[d.month-1]))
        .attr("width", graphWidth / (maxYear - minYear))
        .attr("height", graphHeight / months.length)
        .attr("fill", (d, i) => colorScale(d.variance + baseTemp))
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance)
        .on("mouseover", d => {
          tooltip.transition().duration(100).style("opacity", 0.8);
          tooltip
            .html(`${months[d.month-1]} ${d.year}<br />${d3.format(".1f")(calcTemp(d.variance))} &#176C`)
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY + 10 + "px") ;
          tooltip.attr("data-year", d.year);
        })
        .on("mouseout", d => {
          tooltip.transition().duration(100).style("opacity", 0);
        });
        console.log(calcTemp(minTemp));
      // console.log(`minDate: ${minDate}, maxDate: ${maxDate}`)
      // console.log(`-6 would be color ${colorScale(-6)}`)
      // console.log(`0 would be color ${colorScale(0)}`)
      // console.log(`3 would be color ${colorScale(3)}`)

    });
});