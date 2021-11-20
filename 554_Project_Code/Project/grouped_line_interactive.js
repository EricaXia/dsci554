const margin = { top: 50, right: 50, bottom: 50, left: 50 }
const h = 500 - margin.top - margin.bottom
const w = 700 - margin.left - margin.right

// const formatDecimal = d3.format('.0')

const data_url = 'Project/d3layout_data/wages.csv'

d3.csv(data_url).then((data) => {
  // console.log('LINE CHART')
  // console.log(data)

  // Define the line
  const valueLine = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.wvalue); })

  // Create svg
  const svg = d3.select("#example-line-chart")
    .append("svg")
    .style("width", w + margin.left + margin.right + "px")
    .style("height", h + margin.top + margin.bottom + "px")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "svg");


  // Add a color legend
  svg.append("text")
    .attr('x', w - 140)
    .attr('y', h - 16)
    .attr('font-size', 12)
    .text("Male")
  svg.append("circle").attr("cx", w - 150).attr("cy", h - 20).attr("r", 6).style("fill", '#377eb8')

  svg.append("text")
  .attr('x', w - 80)
  .attr('y', h - 16)
  .attr('font-size', 12)
  .text("Female")
  svg.append("circle").attr("cx", w - 90).attr("cy", h - 20).attr("r", 6).style("fill", '#e41a1c')




  //nest variable aka GROUP
  const nest = d3.groups(data,
    d => d.state, d => d.lvalue)

  // Create a dropdown menu
  const countryMenu = d3.select("#countryDropdown")

  countryMenu
    .append("select")
    .selectAll("option")
    .data(nest)
    .enter()
    .append("option")
    .attr("value", ([key,]) => key)
    .text(([key,]) => key)


  // Scales
  const x = d3.scaleLinear()
    .domain([1995, 2011])
    .range([0, w])

  const y = d3.scaleLinear()
    .domain([0, 6000])
    .range([h, 0])


  // Init graph
  const initialGraph = function (legis) {
    let xAxis = d3.axisBottom()
      .scale(x)
      .ticks(10)
      .tickFormat(d3.format("d"))

    let yAxis = d3.axisLeft()
      .scale(y)
    // Create AXES
    // X-axis
    svg.append('g')
      .attr('class', 'axis')
      .attr('id', 'xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
      .append('text') // X-axis Label
      .attr('id', 'xAxisLabel')
      .attr('fill', 'black')
      .attr('y', -10)
      .attr('x', w)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('')

    // Y-axis
    svg.append('g')
      .attr('class', 'axis')
      .attr('id', 'yAxis')
      .call(yAxis)
      .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0)
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')

    const selectCountry = nest.filter(([key,]) => key == legis)
    const selectCountryGroups = svg.selectAll(".countryGroups")
      .data(selectCountry, function (d) {
        return d ? d.key : this.key;
      })
      .enter()
      .append("g")
      .attr("class", "countryGroups")

    // color palette
    const color = d3.scaleOrdinal()
      .range(['#e41a1c', '#377eb8'])

    const initialPath = selectCountryGroups.selectAll(".line")
      .data(([, values]) => values)
      .enter()
      .append("path")
      .attr("fill", "none") // ADDED
      .attr("stroke", function (d) { return color(d[0]) })
      .attr("stroke-width", 3.0)

    initialPath
      .attr('d', (d) => valueLine(Array.from(d.values())[1]))
      .attr("class", "line")

  } // initialGraph

  // Create initial graph
  // initialGraph("AUS")
  initialGraph("Australia")


  // Update the data
  const updateGraph = function (legis) {
    // Filter the data to include only state of interest
    const selectCountry = nest.filter(([key,]) => key == legis)  // this is the ARRAY

    // RESCALE Y AXIS for new country
    function getMax(maleArr) {
      let max = 0;
      for (let i = 0; i < maleArr.length; i++) {
        if (max == 0 || parseInt(maleArr[i].wvalue) > parseInt(max))
          max = maleArr[i].wvalue;
      }
      return max;
    }
    newMax = d3.map(selectCountry, d => getMax(d[1][1][1]))[0]
    y.domain([0, newMax]);
    yAxis = d3.axisLeft().scale(y)
    // REMOVE old Y-Axis
    d3.select("#yAxis").remove()
    // create NEW Y-axis
    svg.append('g')
      .attr('class', 'axis')
      .attr('id', 'yAxis')
      .call(yAxis)
      .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0)
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')

    // Select all of the grouped elements and update the data
    const selectCountryGroups = svg.selectAll(".countryGroups")
      .data(selectCountry)
    // Select all the lines and transition to new positions
    selectCountryGroups.selectAll("path.line")
      .data(([, values]) => values)
      .transition()
      .duration(600)
      .attr('d', (d) => valueLine(Array.from(d.values())[1]))
  }

  // Run update function when dropdown selection changes
  countryMenu.on('change', function () {
    // Find which was selected from the dropdown
    const selectedCountry = d3.select(this)
      .select("select")
      .property("value")  // e.g. "Canada"
    // Run update function with the selected one
    updateGraph(selectedCountry)
  });




}) // .then
