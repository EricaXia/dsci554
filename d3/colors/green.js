// create svg element
var svg = d3.select("#rects")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 1000)

//Add one square + text descrip
svg.append('rect')
    .attr('x', 30)
    .attr('y', 100)
    .attr('width', 60)
    .attr('height', 60)
    .attr('stroke', 'black')
    .attr('fill', '#097969');
svg.append('text')
    .attr('x', 10)
    .attr('y', 180)
    .text("Cadmium Green")

svg.append('rect')
    .attr('x', 200)
    .attr('y', 100)
    .attr('width', 60)
    .attr('height', 60)
    .attr('stroke', 'black')
    .attr('fill', '#008000');
svg.append('text')
    .attr('x', 210)
    .attr('y', 180)
    .text("Green")