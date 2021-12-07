var width = d3.select('header').node().getBoundingClientRect().width;
    height = d3.select('header').node().getBoundingClientRect().height;

var svg = d3.select("#circles-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .classed("svg-content", true);

move = function() {
    var newx;
    var newy;
    var rand = Math.random();

    if (d3.select(this).attr("cx") == 0) {
        if (rand < 0.3333) {
            newx = width;
            newy = Math.random()*height;
        }
        else if (rand > 0.6666) {
            newx = Math.random()*width;
            newy = 0;
        }
        else {
            newx = Math.random()*width;
            newy = height;
        }
    };

    if (d3.select(this).attr("cx") == width) {
        if (rand < 0.3333) {
            newx = 0;
            newy = Math.random()*height;
        }
        else if (rand > 0.6666) {
            newx = Math.random()*width;
            newy = 0;
        }
        else {
            newx = Math.random()*width;
            newy = height;
        };
    };

    if (d3.select(this).attr("cy") == 0) {
        if (rand < 0.3333) {
            newx = width*Math.random();
            newy = height;
        }
        else if (rand > 0.6666) {
            newx = 0;
            newy = height*Math.random();
        }
        else {
            newx = width;
            newy = height*Math.random();
        };

    };

    if (d3.select(this).attr("cy") == height) {
        if (rand < 0.3333) {
            newx = width*Math.random();
            newy = 0;
        }
        else if (rand > 0.6666) {
            newx = 0;
            newy = height*Math.random();
        }
        else {
            newx = width;
            newy = height*Math.random();
        };
    };

    d3.select(this)
        .transition()
        .duration(10000 + 20000*Math.random())
        .ease(d3.easeLinear)
        .attr("cy", newy)
        .attr("cx", newx)
        .on("end", move)
}

var i, n=Math.ceil(width*0.16);
for (i = 1; i < n; i ++) {
    var circle = svg.append("circle")
    .attr("r", 2 + Math.random()*20)
    .style("fill", "#9a0b16")
    .style("opacity", 0.7);
circle.transition()
    .delay(20*i)
    .duration(10)
    .attr("cy", 0)
    .attr("cx", width*Math.random())
    .on("end", move);
};
