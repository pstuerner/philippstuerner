import {responsivefy} from '../../helpers.js';

// Margin and size
let margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = d3.select('#sigmoid-chart').node().getBoundingClientRect().width - margin.left - margin.right,
    height = d3.select('#sigmoid-chart').node().getBoundingClientRect().height - margin.top - margin.bottom;

// Chart
let svgSigmoid = d3.select("#sigmoid-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scale
let xScale = d3.scaleLinear().range([0,width]).domain([-8,8]),
    yScale = d3.scaleLinear().range([height,0]).domain([0,1]);

// Axes
let xAxisSvg = svgSigmoid.append("g").attr('class', 'axis x').attr("transform", `translate(0,${height})`),
    yAxisSvg = svgSigmoid.append("g").attr('class', 'axis y').attr("transform", `translate(${width/2},0)`),
    xAxis = d3.axisBottom().scale(xScale).ticks(16),
    yAxis = d3.axisLeft().scale(yScale).tickValues([0.2,0.4,0.6,0.8,1.0]);
        
xAxisSvg.call(xAxis);
yAxisSvg.call(yAxis);

// Sigmoid line
let sigmoid = svgSigmoid.append('g').attr('class', 'sigmoid-function'),
    X = _.range(-8,8,0.01).map(d=>+d.toFixed(2)),
    y = X.map(d=>1/(1+Math.pow(Math.E, -d))),
    lineData = [{id:'sigmoid',color:'steelblue',values:y.map(function (d,i) {return {X:X[i],y:d}})}],
    lineGenerator = d3.line().x(d=>xScale(d.X)).y(d=>yScale(d.y));

sigmoid
.selectAll('.sigmoid-path')
.data(lineData)
.join(
    enter => enter
            .append('path')
            .attr('class', 'sigmoid-path')
            .attr("fill", "none")
            .attr("stroke", d=>d.color)
            .attr("stroke-width", 1.5)
            .attr("d", d=> lineGenerator(d.values)),
)

// Mouseover
let focus = svgSigmoid.append("g").style("display", "none"),
    tooltipText = svgSigmoid.append("g").style("display", "none"),
    bisect = d3.bisector(function(d) { return d.X; }).left;

focus
.append("circle")
.attr("class", "y")
.style("fill", "none")
.style("stroke", "blue")
.attr("r", 4);

// focusText
// .append('text')
// .attr('class', 'sigmoid-text')
// // .style("opacity", 0)
// .attr("text-anchor", "left")
// .attr("alignment-baseline", "middle");

tooltipText
.append("foreignObject")
.attr("class", "tooltip-container")
.attr("height",50)
.attr("width",100)
.append("xhtml:span")
.attr("class", "tooltip-text")
.style('font-size', 'medium')

svgSigmoid
.append("rect")
.attr("width", width)
.attr("height", height)
.style("fill", "none")
.style("pointer-events", "all")
.on("mouseover", function() { focus.style("display", null); tooltipText.style("display", null); })
.on("mouseout", function() { focus.style("display", "none"); tooltipText.style("display", "none")})
.on("mousemove", mousemove);

function mousemove() {
    let x0 = xScale.invert(d3.pointer(event,this)[0]),
        i = bisect(lineData[0].values, x0, 1),
        d0 = lineData[0].values[i - 1],
        d1 = lineData[0].values[i],
        d = x0 - d0.X > d1.X - x0 ? d1 : d0,
        nodes = tooltipText.select('.tooltip-text').nodes(),
        shift = d.X<-3 ? 35 : 0;
    
    focus.select("circle.y").attr("transform", `translate(${xScale(d.X)}, ${yScale(d.y)})`);
    tooltipText.select(".tooltip-container").attr("transform", `translate(${xScale(d.X)}, ${yScale(d.y)-shift})`);
    
    nodes[0].innerHTML = String.raw`\(\sigma(t) = ${(1/(1+Math.pow(Math.E, -d.X))).toFixed(3)}\)`
    MathJax.typesetPromise(nodes).then(() => {});
}