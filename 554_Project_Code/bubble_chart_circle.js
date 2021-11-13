// set the dimensions and margins of the graph
const width_bubb = 460;
const height_bubb = 460;

// append the svg object to the body of the page
var svg = d3.select("#bubble-chart")
    .append("svg")
    .attr('width', width_bubb)
    .attr('height', height_bubb)
    .attr("viewBox", [0, 0, width_bubb, height_bubb]);

// Read data
d3.csv("bubble_data.csv").then(data => {
    var color = d3.scaleOrdinal()
        .domain(["Afghanistan", "Pakistan", "Mexico", "India", "USA", "Spain", "Germany", "Chad", "Iraq", "Yemen"])
        .range(d3.schemeSet1);

    // Size scale for countries
    var size = d3.scaleLinear()
        // .domain([0, 1400000000])
        .domain(d3.extent(data, d => d.avg_share_labor))
        .range([7, 55])  // circle will be between 7 and 55 px wide

    // create a tooltip
    const Tooltip = d3.select("#bubble-chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
        Tooltip
            .style("opacity", 1)
    }
    const mousemove = function (event, d) {
        Tooltip
            .html('<u>' + d.Country + '</u>' + "<br>" + d.avg_share_labor + "%")
            .style("left", (event.x / 2 + 20) + "px")
            .style("top", (event.y / 2 - 30) + "px")
    }
    var mouseleave = function (event, d) {
        Tooltip
            .style("opacity", 0)
    }



    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function (d) { return size(d.avg_share_labor) })
        .attr("cx", width_bubb / 2)
        .attr("cy", height_bubb / 2)
        .style("fill", function (d) { return color(d.Country) })
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));



    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width_bubb / 2).y(height_bubb / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d.avg_share_labor) + 3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function (d) {
            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
        });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }


}) // .then
