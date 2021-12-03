url = "Project/d3layout_data/wages_agg.csv"

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

const svg = d3.select("#line-chart-overview")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv(url).then((data) => {
    // console.log(data)

    var x = d3.scaleLinear()
        .domain([1995, 2011])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0.65, d3.max(data, function (d) { return +d.w_m_ratio; })])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function (d) { return x(d.year) })
            .y(function (d) { return y(d.w_m_ratio) })
        )

})