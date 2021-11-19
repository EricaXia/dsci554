var margin = { top: 50, right: 50, bottom: 50, left: 50 }
var h = 500 - margin.top - margin.bottom
var w = 700 - margin.left - margin.right

var formatDecimal = d3.format('.0')

const data_url = 'Project/d3layout_data/ex_data.csv'
d3.csv(data_url).then((data) => {
  // console.log(data)

  // Scales
  var x = d3.scaleLinear()
    .domain([2000, 2005])
    .range([0, w])
  var y = d3.scaleLinear()
    .domain([
      d3.min([0, d3.min(data, function (d) { return d.wvalue })]),
      d3.max([0, d3.max(data, function (d) { return d.wvalue })])
    ])
    .range([h, 0])




  // Define the line
  var valueLine = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.wvalue); })
  // .attr('fill', 'white')

  // Create the svg canvas in the "d3block" div
  var svg = d3.select("#d3block")
    .append("svg")
    .style("width", w + margin.left + margin.right + "px")
    .style("height", h + margin.top + margin.bottom + "px")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "svg");

  //nest variable aka GROUP
  var nest = d3.groups(data,
    d => d.state, d => d.lvalue)

  // X-axis
  var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(5)

  // Y-axis
  var yAxis = d3.axisLeft()
    .scale(y)
  // .ticks(5)

  // Create a dropdown menu
  var legisMenu = d3.select("#legisDropdown")

  legisMenu
    .append("select")
    .selectAll("option")
    .data(nest)
    .enter()
    .append("option")
    .attr("value", ([key,]) => key)
    .text(([key,]) => key)

  // Function to create the initial graph
  var initialGraph = function (legis) {
    var selectLegis = nest.filter(([key,]) => key == legis)
    var selectLegisGroups = svg.selectAll(".legisGroups")
      .data(selectLegis, function (d) {
        return d ? d.key : this.key;
      })
      .enter()
      .append("g")
      .attr("class", "legisGroups")

    // color palette
    const color = d3.scaleOrdinal()
      .range(['#e41a1c', '#377eb8'])

    var initialPath = selectLegisGroups.selectAll(".line")
      .data(([, values]) => values)
      .enter()
      .append("path")
      .attr("fill", "none") // ADDED
      .attr("stroke", function (d) { return color(d[0]) })

    initialPath
      .attr('d', (d) => valueLine(Array.from(d.values())[1]))
      .attr("class", "line")

  } // initialGraph

  // Create initial graph
  initialGraph("CA")


  // Update the data
  var updateGraph = function (legis) {

    // Filter the data to include only state of interest
    var selectLegis = nest.filter(([key,]) => key == legis)

    // Select all of the grouped elements and update the data
    var selectLegisGroups = svg.selectAll(".legisGroups")
      .data(selectLegis)

    // Select all the lines and transition to new positions
    selectLegisGroups.selectAll("path.line")
      .data(([, values]) => values)
      .transition()
      .duration(800)
      .attr('d', (d) => valueLine(Array.from(d.values())[1]))
  }

  // Run update function when dropdown selection changes
  legisMenu.on('change', function () {
    // Find which state was selected from the dropdown
    var selectedLegis = d3.select(this)
      .select("select")
      .property("value")
    // Run update function with the selected state
    updateGraph(selectedLegis)

  });


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

})
