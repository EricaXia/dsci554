url = "Project/d3layout_data/wages.csv"

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
width = 800 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

const svg = d3.select("#line-chart-overview")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv(url).then((data) => {
    // draw one line per gender
    const sumstat = d3.group(data, d => d.lvalue);

    // Add X axis as a date format
    const x = d3.scaleLinear()
        .domain([1995, 2011])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.AUS; })])
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
                .y(function (d) { return y(+d.wvalue); })
                (d[1])
        }) // d attr

}) // .then
