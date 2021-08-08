// margins and dimensions
const w = 1600;
const h = 700;
const legendWidth = 300;
const legendHeight = 40;
const legendMarginBottom = 20;
const graphMargin = { top: 100, right: 50, bottom: 100, left: 100 };
const graphWidth = w - graphMargin.left - graphMargin.right;
const graphHeight = h - graphMargin.top - graphMargin.bottom;
const baseTemp = 8.66;

// cell colors
const cellColors = [ "#f9edccff", "#f9df74ff", "#edae49ff", "#ea2b1fff", "#61210fff" ];

// months for y-axis
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// tooltip, hidden by default
const tooltip = d3
  .select(".canvas")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

// main svg
const svg = d3.select(".canvas").append("svg").attr("width", w).attr("height", h);

// graph area
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${graphMargin.left}, ${graphMargin.top})`); // move it by margin sizes

// legend area
const legend = svg
  .append("g")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("id", "legend")
  .attr("transform", `translate(${w /2 - legendWidth / 2}, ${h - legendHeight - 20})`);

// title
svg
  .append("text")
  .attr("id", "title")
  .attr("x", w / 2)
  .attr("y", 45)
  .text("Monthly Global Land-Surface Temperature");

// description
svg
  .append("text")
  .attr("id", "description")
  .attr("x", w / 2)
  .attr("y", 75)
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

      // yScale is made up of bands for each of the 12 months
      const yScale = d3
        .scaleBand()
        .domain(months)
        .range([0, graphHeight]);
      
      // xScale is a time scale of all the possible years
      const xScale = d3
        .scaleTime()
        .domain([minDate, maxDate])
        .range([0, graphWidth])

      // color scale to map temperatures to colors
      const colorScale = d3
        .scaleQuantize()
        .domain([minTemp, maxTemp])
        .range(cellColors);

      // legend scale
      const legendScale = d3
        .scaleLinear()
        .domain([minTemp, maxTemp])
        .range([0,legendWidth]);

      // x-axis with years
      const xAxis = d3.axisBottom(xScale);
      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${graphMargin.left}, ${h - graphMargin.bottom})`)
        .call(xAxis);

      // y-axis with months
      const yAxis = d3.axisLeft(yScale);
      svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${graphMargin.left}, ${graphMargin.top})`) 
        .call(yAxis);

      // legend Axis
      const legendTicks = cellColors.map((x, i) => i * (maxTemp - minTemp) / cellColors.length + minTemp); // populate ticks to align with the color squares
      legendTicks.push(maxTemp);
      const legendAxis = d3.axisBottom(legendScale);
      legendAxis.tickValues(legendTicks);
      legendAxis.tickFormat(d3.format(".1f")); // one decimal place
      legend.append("g")
        .attr("id", "legend-axis")
        .attr("transform", `translate(0, ${legendHeight - legendMarginBottom})`)
        .call(legendAxis);

      // legend squares for each color
      legend
        .selectAll("rect")
        .data(cellColors)
        .enter()
        .append("rect")
        .attr("x", (d, i) => (legendWidth / cellColors.length) * i)
        .attr("width", legendWidth / cellColors.length)
        .attr("height", legendHeight - legendMarginBottom)
        .attr("fill", d => d);

      // heat map cells
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
          tooltip.transition().duration(100).style("opacity", 0.8); // show the tooltip
          tooltip
            .html(`${months[d.month-1]} ${d.year}<br />${d3.format(".1f")(d.variance + baseTemp)} &#176C`)
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY + 10 + "px") ;
          tooltip.attr("data-year", d.year);
        })
        .on("mouseout", d => {
          tooltip.transition().duration(100).style("opacity", 0); // hide the tooltip
        });
    });
});