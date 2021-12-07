function main() {
    var n = 40,
        random = d3.randomNormal(0, 0.4),
        data = d3.range(n).map(random);

    var svg = d3.select("#about-header").append('svg').attr('width','100%').attr('height','100%'),
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = d3.select('#about-header').node().getBoundingClientRect().width - margin.left - margin.right,
        height = d3.select('#about-header').node().getBoundingClientRect().height - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([1, n - 2])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([-1, 1])
        .range([height, 0]);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d, i) { return x(i); })
        .y(function(d, i) { return y(d); });

    g.append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

    // g.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + y(0) + ")").call(d3.axisBottom(x));

    // g.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y));

    g.append("g")
        .attr("clip-path", "url(#clip)")
    .append("path")
        .datum(data)
        .attr("class", "line")
    .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .on("start", tick);

    function tick() {

    // Push a new data point onto the back.
    data.push(random());

    // Redraw the line.
    d3.select(this)
        .attr("d", line)
        .attr("transform", null)
        .style("stroke", "white")
        .style('opacity', 0.8)  ;

    // Slide it to the left.
    d3.active(this)
        .attr("transform", "translate(" + x(0) + ",0)")
        .transition()
        .on("start", tick);

    // Pop the old data point off the front.
    data.shift();

    }
}

main()
