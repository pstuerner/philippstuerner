// var formatDateIntoYear = d3.timeFormat("%Y");
// var formatDate = d3.timeFormat("%b %Y");
// var parseDate = d3.timeParse("%m/%d/%y");

// var startDate = new Date("2004-11-01"),
//     endDate = new Date("2017-04-01");

// var margin = {top:50, right:50, bottom:0, left:50},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// var svg = d3.select("#vis")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);  

// d3.select('#vis').append('g').append(() => MathJax.tex2svg(String.raw`\pi r^2`).querySelector("svg"));
// slider fnc //


const width = d3.select('#chart1').node().getBoundingClientRect().width;
const height = document.documentElement.clientHeight * 0.1;

const data = [
    {pos:1,min:0,max:10},
    {pos:2,min:10,max:200},
    {pos:3,min:-50,max:300}
];

var themSliders = sliders().width(width).height(height).n(data.length).min(d=>d.min).max(d=>d.max).pos(d=>d.pos);

svg = d3
.select('#vis')
.style('background-color','grey')
.append('svg')
.attr('width', width)
.attr('height', height)
.call(responsivefy);

data.map(function(d) {
    svg
    .datum(d)
    .call(themSliders);
})


// ////////// slider //////////

// var moving = false;
// var currentValue = 0;
// var targetValue = width;

// var playButton = d3.select("#play-button");
    
// var x = d3.scaleTime()
//     .domain([startDate, endDate])
//     .range([0, targetValue])
//     .clamp(true);

// var slider = svg.append("g")
//     .attr("class", "slider")
//     .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

// slider.append("line")
//     .attr("class", "track")
//     .attr("x1", x.range()[0])
//     .attr("x2", x.range()[1])
//   .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
//     .attr("class", "track-inset")
//   .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
//     .attr("class", "track-overlay")
//     .call(d3.drag()
//         .on("start.interrupt", function() { slider.interrupt(); })
//         .on("start drag", function(event) {
//           currentValue = event.x;
//           update(x.invert(currentValue)); 
//         })
//     );

// slider.insert("g", ".track-overlay")
//     .attr("class", "ticks")
//     .attr("transform", "translate(0," + 18 + ")")
//   .selectAll("text")
//     .data(x.ticks(10))
//     .enter()
//     .append("text")
//     .attr("x", x)
//     .attr("y", 10)
//     .attr("text-anchor", "middle")
//     .text(function(d) { return formatDateIntoYear(d); });

// var handle = slider.insert("circle", ".track-overlay")
//     .attr("class", "handle")
//     .attr("r", 9);

// var label = slider.append("text")  
//     .attr("class", "label")
//     .attr("text-anchor", "middle")
//     .text(formatDate(startDate))
//     .attr("transform", "translate(0," + (-25) + ")")

 
// ////////// plot //////////

// var dataset;

// var plot = svg.append("g")
//     .attr("class", "plot")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("http://127.0.0.1:8000/circles_csv").then(function(data){
//   dataset = data.map(prepare);
//   drawPlot(dataset);
  
//   playButton
//     .on("click", function() {
//     var button = d3.select(this);
//     if (button.text() == "Pause") {
//       moving = false;
//       clearInterval(timer);
//       // timer = 0;
//       button.text("Play");
//     } else {
//       moving = true;
//       timer = setInterval(step, 100);
//       button.text("Pause");
//     }
//     console.log("Slider moving: " + moving);
//   })
// })

// function prepare(d) {
//   d.id = d.id;
//   d.date = parseDate(d.date);
//   return d;
// }
  
// function step() {
//   update(x.invert(currentValue));
//   currentValue = currentValue + (targetValue/151);
//   if (currentValue > targetValue) {
//     moving = false;
//     currentValue = 0;
//     clearInterval(timer);
//     // timer = 0;
//     playButton.text("Play");
//     console.log("Slider moving: " + moving);
//   }
// }

// function drawPlot(data) {
//   var locations = plot.selectAll(".location")
//     .data(data);

//   // if filtered dataset has more circles than already existing, transition new ones in
//   locations.enter()
//     .append("circle")
//     .attr("class", "location")
//     .attr("cx", function(d) { return x(d.date); })
//     .attr("cy", height/2)
//     .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
//     .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
//     .style("opacity", 0.5)
//     .attr("r", 8)
//       .transition()
//       .duration(400)
//       .attr("r", 25)
//         .transition()
//         .attr("r", 8);

//   // if filtered dataset has less circles than already existing, remove excess
//   locations.exit()
//     .remove();
// }

// function update(h) {
//   // update position and text of label according to slider scale
//   handle.attr("cx", x(h));
//   label
//     .attr("x", x(h))
//     .text(formatDate(h));

//   // filter data set and redraw plot
//   var newData = dataset.filter(function(d) {
//     return d.date < h;
//   })
//   drawPlot(newData);
// }
