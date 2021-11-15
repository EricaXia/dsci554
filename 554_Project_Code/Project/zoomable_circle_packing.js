// const svg = d3.select('#circle-packing-chart')

// data_url = 'Project/d3layout_data/education.json'
// data_url_f = 'Project/d3layout_data/female_employment_data.json'
// data_url_m = 'Project/d3layout_data/male_employment_data.json'
data_url = 'Project/d3layout_data/all_employment_data.json'

// Promise.all([d3.json(data_url_f), d3.json(data_url_m)]).then( data => {
//     data_f = data[0]
//     data_m = data[1]

d3.json(data_url).then(data => {

    width = 932
    height = width

    format = d3.format(",d")

    color = d3.scaleLinear()
        .domain([0, 5])
        // .range(["rgb(204, 204, 255)", "rgb(128, 0, 128)"])
        // .range(["rgb(214, 205, 247)", "rgb(57, 47, 90)"])
        .range(["rgb(255, 249, 243)", "rgb(233, 201, 22)"])
        .interpolate(d3.interpolateHcl)

    // color: {type: "sequential", scheme: "magma", domain: [8, 0], reverse: true},

    pack = data => d3.pack()
        .size([width, height])
        .padding(3)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))


    const root = pack(data);
    let focus = root;
    let view;

    //   const svg = d3.create("svg")
    const svg = d3.select('#circle-packing-chart')
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

    function colorCircles(d) {
        if (d.children) {
            return color(d.depth)
        }
        else {
            if (d.data.gender == "female") {
                // return "rgb(185, 147, 229)"
                // return "#dcd0ff"
                return "#D291BC"
            }
            else {
                return "#A8B5E0" //"rgb(83, 107, 173)"
            }
        } // else
    }

    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill", d => colorCircles(d))
        // .attr("fill", d => d.children ? color(d.depth) : "white")  // color children white

        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function () { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function () { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

    function displayText(d) {
        // Don't display % for root nodes
        if (d.parent === root) {
            return (d.data.name)
        }
        else {
            return (d.data.name + ": " + Math.round(d.data.value) + "\%")
        }
    }

    // TODO: show % values on a new line?
    const label = svg.append("g")
        .attr("class", "zoom-font")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => displayText(d))
    // .text(d => d.data.name);      



    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {
        const focus0 = focus;

        focus = d;

        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });

        label
            .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    return svg.node();
}) // .then