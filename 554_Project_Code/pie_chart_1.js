var width_pie = 450
height_pie = 450
margin3 = 40

var radius = Math.min(width_pie, height_pie) / 2 - margin3

var svg3 = d3.select("#pie-chart")
    .append("svg")
    .attr("width", width_pie)
    .attr("height", height_pie)
    .append("g")
    .attr("transform", "translate(" + width_pie / 2 + "," + height_pie / 2 + ")");

d3.csv("pie_data.csv").then(data => {
    // console.log(data)

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(d3.range(5))
        .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.avg_perc_share_labor; })

    data_ready = pie(data)
    // console.log(data_ready)

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg3
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', d => color(d.index))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg3
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text((d) => { return d.data.Country })
        .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 15)
}); //.then