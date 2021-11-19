url = "Project/d3layout_data/wages.csv"

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

const svg = d3.select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv(url).then((data) => {
    // console.log(data)
    // draw one line per gender
    let sumstat = d3.group(data, d => d.gender);


    // List of groups (here I have one group per column)
    // const allGroup = ["valueA", "valueB", "valueC"]
    const allGroup = ['AUS', 'CAN', 'CZE', 'ECU', 'DEU', 'GTM', 'ISL',
        'LVA', 'LUX', 'MLT', 'MEX', 'MNG', 'NZL', 'NOR', 'PAK', 'PHL', 'QAT',
        'SGP', 'SVK', 'ESP', 'SWE', 'SYR', 'THA', 'UKR', 'GBR', 'URY', 'USA']

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text shown in menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // one color per gender
    const color = d3.scaleOrdinal()
        .range(['#e41a1c', '#377eb8'])
    // .domain(allGroup)
    // .range(d3.schemeSet2);

    // Add X axis as a date format
    const x = d3.scaleLinear()
        .domain([1995, 2011])
        // .domain(d3.extent(data, function (d) { return d.year; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    // TODO: change domain per country
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.AUS; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));


    // Initialize line with AUS first
    // const line = svg
    //     .append('g')
    //     .append("path")
    //     .datum(data)
    //     .attr("d", d3.line()
    //         .x(function (d) { return x(+d.year) })
    //         .y(function (d) { return y(+d.AUS) })
    //     )
    //     .attr("stroke", function (d) { return myColor("AUS") })
    //     .style("stroke-width", 4)
    //     .style("fill", "none")

    // Draw the line
    const line = svg.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d[0]) })
        .attr("stroke-width", 3.0)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.year); })
                .y(function (d) { return y(+d.AUS); })
                (d[1])
        }) // d attr

    // A function that updates the chart
    function update(selectedGroup) {
        console.log(selectedGroup, "selected")
        const dataFilter = data.map(function (d) {
            return { year: d.year, value: d[selectedGroup] }
        })

        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function (d) { return x(+d.year) })
                .y(function (d) { return y(+d.value) })
            )
            .attr("stroke", function (d) { return color(d.gender) })

        // line
        //     .data(sumstat)
        //     .join("path")
        //     .attr("fill", "none")
        //     .attr("stroke", function (d) { return color(d[0]) })
        //     .attr("stroke-width", 3.0)
        //     .attr("d", function (d) {
        //         return d3.line()
        //             .x(function (d) { return x(d.year); })
        //             .y(function (d) { return y(+d.value); })
        //             (d[1])
        //     }) // d attr

    } // update()

    // When the button is changed, run update()
    d3.select("#selectButton").on("change", function (event, d) {
        // recover the option chosen
        const selectedOption = d3.select(this).property("value")
        // run the update()
        update(selectedOption)
    }) // .on

}) // .then
