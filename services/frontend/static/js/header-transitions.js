function createTransitions() {
    var width = d3.select('#carousel-header').node().getBoundingClientRect().width,
        height = d3.select('#carousel-header').node().getBoundingClientRect().height
        n = Math.floor(width/10) * Math.floor(height/10);

    var blackyellow = d3.interpolateRgb("black", "#d9de45"),
        yellowblue = d3.interpolateRgb("#d9de45", "steelblue"),
        blueblack = d3.interpolateRgb("steelblue", "black");
        
    d3.select("#transitions-container")
    .select('div')
    .selectAll('div')
    .data(d3.range(n))
    .enter().append("div").classed('trans-div','true')
    .transition()
        .delay(function(d, i) { return i + Math.random() * n / 4; })
        .ease(d3.easeLinear)
        .on("start", function repeat() {
            d3.active(this)
                .styleTween("background-color", function() { return blackyellow; })
            .transition()
                .delay(1000)
                .styleTween("background-color", function() { return yellowblue; })
            .transition()
                .delay(1000)
                .styleTween("background-color", function() { return blueblack; })
            .transition()
                .delay(n)
                .on("start", repeat);
        });
        
}

createTransitions()