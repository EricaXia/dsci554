// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then( function(data) {
url = "Project/d3layout_data/wages.csv"
d3.csv(url).then((data) => {
    // group the data: I want to draw one line per group
    const sumstat = d3.group(data, d => d.gender);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.year; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.value; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette
    const color = d3.scaleOrdinal()
        .range(['#e41a1c', '#377eb8'])

    // Draw the line
    svg.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d[0]) })
        .attr("stroke-width", 3.0)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.year); })
                .y(function (d) { return y(+d.value); })
                (d[1])
        })

})
