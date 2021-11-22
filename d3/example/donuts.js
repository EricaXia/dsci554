// create svg element:
var svg = d3.select("#circle")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 1000)

svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 50)
    .attr('stroke', 'black')
    .attr('fill', '#7B3F00');
svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 20)
    .attr('stroke', 'black')
    .attr('fill', 'white');

svg.append('circle')
    .attr('cx', 250)
    .attr('cy', 100)
    .attr('r', 50)
    .attr('stroke', 'black')
    .attr('fill', '#770737');
svg.append('circle')
    .attr('cx', 250)
    .attr('cy', 100)
    .attr('r', 20)
    .attr('stroke', 'black')
    .attr('fill', 'white');


svg.append('rect')
    .attr('x', 80)
    .attr('y', 250)
    .attr("rx", 8)
    .attr("ry", 8)
    .attr('width', 50)
    .attr('height', 120)
    .attr('stroke', '#f7e4c4')
    .attr('stroke-width', 4)
    .attr('fill', '#814141')
    ;