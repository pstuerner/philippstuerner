// Taken from https://bl.ocks.org/mbostock/70d5541b547cc222aa02

/**
 * @name createTransitions
 * @description Main function that runs the d3 visualization.
 */
function createTransitions() {
    var width = d3.select("header").node().getBoundingClientRect().width,
        height = d3.select("header").node().getBoundingClientRect().height;
    n = Math.floor(width / 10) * Math.floor(height / 10);

    var blackred = d3.interpolateRgb("black", "firebrick"),
        redblue = d3.interpolateRgb("firebrick", "steelblue"),
        blueblack = d3.interpolateRgb("steelblue", "black");

    d3.select("#transitions-container")
        .select("div")
        .selectAll("div")
        .data(d3.range(n))
        .enter()
        .append("div")
        .classed("trans-div", "true")
        .style("opacity", 0.6)
        .transition()
        .delay(function (d, i) {
            return i + Math.random() * n;
        })
        .ease(d3.easeLinear)
        .on("start", function repeat() {
            d3.active(this)
                .styleTween("background-color", function () {
                    return blackred;
                })
                .transition()
                .delay(1000)
                .styleTween("background-color", function () {
                    return redblue;
                })
                .transition()
                .delay(1000)
                .styleTween("background-color", function () {
                    return blueblack;
                })
                .transition()
                .delay(n)
                .on("start", repeat);
        });
}

createTransitions();
