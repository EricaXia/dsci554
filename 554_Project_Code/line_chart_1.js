height2 = 450
width2 = 600
margin2 = ({ top: 10, right: 30, bottom: 30, left: 60 })

const svg2 = d3.select("#line-chart")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom);

const g = svg2.append("g")
    .attr("transform",
        "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("line_data.csv").then(data => {

    var sumstat = d3.group(data, d => d.country);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width2])
        // .nice()
        ;
    g.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.0f')))
        ;

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([25, d3.max(data, d => +d.perc_share_labor)])
        .range([height2, 0])
        .nice();
    g.append("g")
        .call(d3.axisLeft(y));

    // has 11 colors to account for test placaeholder
    var tenColors = ['#e41a1c', '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#29fff8']

    var res = Array.from(sumstat.keys()); // list of group names

    var color = d3.scaleOrdinal()
        .domain(res)
        .range(tenColors)

    g.selectAll("path")
        .data(sumstat)
        .join("path")
        .attr('fill', 'none')
        .attr('stroke-width', 3.0)
        .attr('stroke', d => color(d[0]))
        .attr("d", d => {
            return d3.line()
                .x(d => x(d.year))
                .y(d => y(d.perc_share_labor))
                (d[1])
        });

    res = res.filter(item => item !== 'test')
    console.log(res)

    var tenColors2 = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#29fff8']
    // ADD LEGEND
    var c = 0
    res.forEach((d, i) => {
        svg2.append("circle")
            .attr("cx", 500)
            .attr("cy", height2 - 13 * c)
            .attr("r", 5)
            .style("fill", tenColors2[i])
        // .style("fill", d3.schemePaired[i])
        svg2.append("text")
            .attr("x", 515)
            .attr("y", height2 - 13 * c + 3)
            .text(d)
            .style("font-size", "12px")
            .attr("alignment-baseline", "bottom")
        c = c + 1
        // console.log(c)

    }); //forEach

    return (svg2.node());

}) // .then