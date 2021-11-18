// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 950 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
// data_url = "Project/d3layout_data/bar_test.csv"
data_url = "Project/d3layout_data/bar_test2.csv"

d3.csv(data_url).then(data => {
    console.log("DATA:", data)

    // List of subgroups = header of the csv files = soil condition here
    const subgroups = data.columns.slice(1)

    // List of groups = value of the first column called group -> on the X axis
    // const groups = data.map(d => d.group)
    const groups = data.map(d => d.year)

    // console.log(groups)  // should be years

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(8));

    // console.log(d3.max(data, d => d.male))

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => parseInt(d.male))])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#D291BC", "#A8B5E0", '#4daf4a'])

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .join("g")
        // .attr("transform", d => `translate(${x(d.group)}, 0)`)
        .attr("transform", d => `translate(${x(d.year)}, 0)`)
        .selectAll("rect")
        .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
        .join("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));

}) // .then