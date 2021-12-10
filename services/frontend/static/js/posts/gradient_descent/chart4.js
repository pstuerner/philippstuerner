import { responsivefy } from "../../helpers.js";

/**
 * @name chart4
 * @description Main function to update the visual.
 * @param {Object} data
 */
function chart4(data) {
    const dur = 50;
    const t = d3.transition().duration(dur);

    /**
     * @name getPredictions
     * @description Function that gives a prediction based on an input matrix, a slope (m), and an intercept (b).
     * @param {Array} X
     * @param {Number} m
     * @param {Number} b
     */
    function getPredictions(X, m, b) {
        return X.map((d) => m * d + b);
    }

    /**
     * @name updateMathJax
     * @description Function that updates the MathJax based on the theta values.
     * @param {Number} theta0
     * @param {Number} theta1
     */
    function updateMathJax(theta0, theta1) {
        const nodes = [
            document.getElementById("chart4-function"),
            document.getElementById("chart4-mse"),
        ];
        MathJax.typesetClear(nodes);
        nodes[0].innerHTML = String.raw`$$ h_{\theta}(x)=\theta \cdot x = \begin{pmatrix}${theta0.toFixed(
            2
        )}\\${theta1.toFixed(2)}\end{pmatrix} \cdot x $$`;
        nodes[1].innerHTML = String.raw`$$ \textrm{MSE}=${eq(
            currentData,
            theta0,
            theta1
        ).toFixed(2)} $$`;
        MathJax.typesetPromise(nodes).then(() => {});
    }

    /**
     * @name plotScatter
     * @description Function that updates the scatter plot.
     */
    function plotScatter() {
        scatters
            .selectAll(".scatter")
            .data(currentData)
            .join(
                (enter) => {
                    enter
                        .append("circle")
                        .attr("class", "scatter")
                        .attr("id", (d) => `scatter-${d.i}`)
                        .attr("cy", (d) => yScaleScatter(d.y))
                        .attr("r", 5)
                        .style("fill", "dodgerblue")
                        .transition(t)
                        .attr("cx", (d) => xScaleScatter(d.X));
                },
                (update) => {
                    update
                        .transition(t)
                        .delay((d, i) => i * 5)
                        .attr("cx", (d) => xScaleScatter(d.X))
                        .attr("cy", (d) => yScaleScatter(d.y))
                        .attr("r", 5);
                },
                (exit) => {
                    exit.remove();
                }
            );
    }

    /**
     * @name updateResiduals
     * @description Function that updates the scatter plot's residuals.
     * @param {Number} b
     * @param {Number} m
     */
    function updateResiduals(b, m) {
        const residualLines = [];
        const lineGen = d3
            .line()
            .x((d) => xScaleScatter(d.x))
            .y((d) => yScaleScatter(d.y));
        const yPred = getPredictions(
            currentData.map((d) => d.X),
            m,
            b
        );

        currentData.forEach(function (d, i) {
            residualLines.push({
                v: [
                    { x: d.X, y: d.y },
                    { x: d.X, y: yPred[i] },
                ],
                i: d.i,
            });
        });

        residuals
            .selectAll(".residual")
            .data(residualLines)
            .join(
                (enter) => {
                    enter
                        .append("path")
                        .attr("clip-path", "url(#chart4-scatter-clip)")
                        .attr("class", "residual")
                        .attr("id", (d) => `residual-${d.i}`)
                        .transition()
                        .duration(2000)
                        .delay((d, i) => i * 5)
                        .attr("d", (d) => lineGen(d.v))
                        .style("fill", "none")
                        .style("stroke", "red")
                        .style("opacity", 0.5)
                        .style("stroke-width", 30)
                        .style("stroke-dasharray", "5, 5");
                },
                (update) => {
                    update
                        .attr("clip-path", "url(#chart4-scatter-clip)")
                        .transition()
                        .duration(150)
                        .delay((d, i) => i * 5)
                        .attr("d", (d) => lineGen(d.v));
                }
            );
    }

    /**
     * @name updateLine
     * @description Function that updates the scatter plot's regression line.
     * @param {Number} b
     * @param {Number} m
     */
    function updateLine(b, m) {
        const lineData = [
            {
                v: d3
                    .extent(currentData, (d) => d.X)
                    .map((d) => ({ x: d, y: getPredictions([d], m, b)[0] })),
            },
        ];
        const lineGen = d3
            .line()
            .x((d) => xScaleScatter(d.x))
            .y((d) => yScaleScatter(d.y));

        // Update regression
        lines
            .selectAll(".line")
            .data(lineData)
            .join(
                (enter) => {
                    enter
                        .append("path")
                        .attr("class", "line")
                        .attr("clip-path", "url(#chart4-scatter-clip)")
                        .transition()
                        .duration(100)
                        .attr("d", (d) => lineGen(d.v))
                        .style("fill", "none")
                        .style("stroke", "black");
                },
                (update) => {
                    update
                        .attr("clip-path", "url(#chart4-scatter-clip)")
                        .transition()
                        .duration(100)
                        .attr("d", (d) => lineGen(d.v));
                }
            );
    }

    /**
     * @name updateLossDot
     * @description Functoin that updates the loss function's loss dot.
     * @param {Array} data
     */
    function updateLossDot(data) {
        lossdot
            .selectAll("circle.dot")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("circle")
                        .attr("class", "_3d dot")
                        .attr("clip-path", "url(#chart4-loss-clip)")
                        .transition()
                        .duration(100)
                        .attr("cx", (d) => d.projected.x)
                        .attr("cy", (d) => d.projected.y)
                        .attr("r", 7)
                        .style("fill", "red");
                },
                (update) => {
                    update
                        .transition()
                        .duration(100)
                        .attr("cx", (d) => d.projected.x)
                        .attr("cy", (d) => d.projected.y)
                        .attr("r", 7);
                }
            );
    }

    /**
     * @name processData
     * @description Function that handles the chart's 3d layout.
     * @param {Array} data
     * @param {Number} tt
     */
    function processData(data, tt) {
        /* ----------- GRID ----------- */
        var xGrid = lossBaseSvg
            .selectAll("path.grid")
            .data(data[0], function (d) {
                return d.id;
            });

        xGrid
            .enter()
            .append("path")
            .attr("class", "_3d grid")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .merge(xGrid)
            .attr("stroke", "black")
            .attr("stroke-width", 0.3)
            .attr("fill", function (d) {
                return d.ccw ? "lightgrey" : "#717171";
            })
            .attr("fill-opacity", 0.9)
            .attr("d", grid3d.draw);

        xGrid.exit().remove();

        /* ----------- SURFACE ----------- */

        var planes = lossBaseSvg
            .selectAll("path.surface")
            .data(data[1], function (d) {
                return d.plane;
            });

        planes
            .enter()
            .append("path")
            .attr("class", "_3d surface")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .attr("fill", colorize)
            .attr("opacity", 0)
            .attr("stroke-opacity", 0.1)
            .merge(planes)
            .attr("stroke", "black")
            .transition()
            .duration(tt)
            .attr("opacity", 1)
            .attr("fill", colorize)
            .attr("d", surface.draw);

        planes.exit().remove();

        /* ----------- Scales ----------- */

        var xScale = lossBaseSvg.selectAll("path.xScale").data(data[2][0]);
        var yScale = lossBaseSvg.selectAll("path.yScale").data(data[2][1]);
        var zScale = lossBaseSvg.selectAll("path.zScale").data(data[2][2]);

        xScale
            .enter()
            .append("path")
            .attr("class", "_3d xScale")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .merge(xScale)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", scale3d.draw);

        yScale
            .enter()
            .append("path")
            .attr("class", "_3d yScale")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .merge(yScale)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", scale3d.draw);

        zScale
            .enter()
            .append("path")
            .attr("class", "_3d zScale")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .merge(zScale)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", scale3d.draw);

        xScale.exit().remove();
        yScale.exit().remove();
        zScale.exit().remove();

        /* ----------- Text ----------- */

        var xText = lossBaseSvg.selectAll("text.xText").data(data[2][0][0]);
        var yText = lossBaseSvg.selectAll("text.yText").data(data[2][1][0]);
        var zText = lossBaseSvg.selectAll("text.zText").data(data[2][2][0]);

        xText
            .enter()
            .append("text")
            .attr("class", "_3d xText")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .attr("dx", "-.6em")
            .style("font", "14px times")
            .merge(xText)
            .each(function (d) {
                d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
            })
            .attr("x", function (d) {
                return d.projected.x;
            })
            .attr("y", function (d) {
                return d.projected.y;
            })
            .text(function (d) {
                return d[0];
            });

        yText
            .enter()
            .append("text")
            .attr("class", "_3d yText")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .attr("dx", "-.6em")
            .style("font", "14px times")
            .merge(yText)
            .each(function (d) {
                d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
            })
            .attr("x", function (d) {
                return d.projected.x;
            })
            .attr("y", function (d) {
                return d.projected.y;
            })
            .text(function (d) {
                return d[2];
            });

        zText
            .enter()
            .append("text")
            .attr("class", "_3d zText")
            .attr("clip-path", "url(#chart4-loss-clip)")
            .attr("dx", ".3em")
            .style("font", "14px times")
            .merge(zText)
            .each(function (d) {
                d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
            })
            .attr("x", function (d) {
                return d.projected.x;
            })
            .attr("y", function (d) {
                return d.projected.y;
            })
            .text(function (d) {
                return d[1];
            });

        xText.exit().remove();
        yText.exit().remove();
        zText.exit().remove();

        /* ----------- DOT ----------- */
        updateLossDot(
            point3d.rotateY(beta + startAngleY).rotateX(alpha + startAngleX)(
                data[3]
            )
        );

        d3.selectAll("._3d").sort(surface.sort);
    }

    /**
     * @name colorize
     * @description Function that maps values to a color scale.
     */
    function colorize(d) {
        var _y = (d[0].y + d[1].y + d[2].y + d[3].y) / 4;
        return d.ccw
            ? d3.interpolateSpectral(color(_y))
            : d3.color(d3.interpolateSpectral(color(_y))).darker(2.5);
    }

    /**
     * @name dragStart
     * @description Function that handles drag start events.
     */
    function dragStart(event, d) {
        mx = event.x;
        my = event.y;
    }

    /**
     * @name dragged
     * @description Function that handles events while dragging. Responsible for 3d rotation.
     */
    function dragged(event, d) {
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta = ((event.x - mx + mouseX) * Math.PI) / 230;
        alpha = (((event.y - my + mouseY) * Math.PI) / 230) * -1;

        var dataChart = [
            grid3d.rotateY(beta + startAngleY).rotateX(alpha + startAngleX)(
                xGrid
            ),
            surface.rotateY(beta + startAngleY).rotateX(alpha + startAngleX)(
                points
            ),
            [
                scale3d
                    .rotateY(beta + startAngleY)
                    .rotateX(alpha + startAngleX)([xLine]),
                scale3d
                    .rotateY(beta + startAngleY)
                    .rotateX(alpha + startAngleX)([yLine]),
                scale3d
                    .rotateY(beta + startAngleY)
                    .rotateX(alpha + startAngleX)([zLine]),
            ],
            [{ x: theta0, y: eq(data.data, theta0, theta1), z: theta1 }],
        ];
        processData(dataChart, 0);
    }

    /**
     * @name dragEnd
     * @description Function that handles drag end events.
     */
    function dragEnd(event, d) {
        mouseX = event.x - mx + mouseX;
        mouseY = event.y - my + mouseY;
    }

    var eq = function (X, theta0, theta1) {
        return (
            (1 / (2 * X.length)) *
            d3.sum(
                X.map((d) => Math.pow(theta0 * d.X_b + theta1 * d.X - d.y, 2))
            )
        );
    };

    /**
     * @name plotLoss
     * @description Function that plots the 3d loss surface.
     */
    function plotLoss(X) {
        (xGrid = []), (points = []), (zLine = []), (yLine = []), (xLine = []);
        theta0Range.forEach(function (theta0, i) {
            theta1Range.forEach(function (theta1, i) {
                xGrid.push([theta0, 0, theta1]);
                points.push({
                    x: theta0,
                    y: eq(X, theta0, theta1),
                    z: theta1,
                });
            });
        });

        var yMin = d3.min(points, function (d) {
            return d.y;
        });
        var yMax = d3.max(points, function (d) {
            return d.y;
        });

        _.range(
            Math.round(theta0Range[0]),
            Math.floor(theta0Range.slice(-1)),
            2
        ).forEach(function (d) {
            xLine.push([d, 0, theta1Range[0]]);
        });
        _.range(
            Math.round(theta1Range[0]),
            Math.floor(theta1Range.slice(-1)),
            2
        ).forEach(function (d) {
            yLine.push([theta0Range[0], 0, d]);
        });
        d3.range(0, yMax, 10).forEach(function (d) {
            zLine.push([theta0Range[0], d, theta1Range[0]]);
        });

        color.domain([yMin, yMax]);

        var dataChart = [
            grid3d(xGrid),
            surface(points),
            [scale3d([xLine]), scale3d([yLine]), scale3d([zLine])],
            [{ x: theta0, y: eq(data.data, theta0, theta1), z: theta1 }],
        ];
        processData(dataChart, 1000);
    }

    // Charts
    const margin = { top: 40, bottom: 40, left: 60, right: 40 },
        chartWidth =
            d3.select("#chart4-loss-function").node().getBoundingClientRect()
                .width -
            margin.left -
            margin.right,
        chartHeight =
            d3.select("#chart4-loss-function").node().getBoundingClientRect()
                .height -
            margin.top -
            margin.bottom;

    const baseSvg = d3
        .select("#chart4-loss-function")
        .append("svg")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .call(responsivefy);

    var origin = [
            (chartWidth + margin.left + margin.right) / 2,
            chartHeight +
                margin.top +
                margin.bottom -
                (chartHeight + margin.top + margin.bottom) * 0.15,
        ],
        currentData = data.data,
        j = 16,
        points = [],
        alpha = 0,
        beta = 0,
        startAngleY = Math.PI / 2.3,
        startAngleX = Math.PI / 1.5,
        scale = 9,
        xGrid = [],
        zLine = [],
        yLine = [],
        xLine = [],
        theta0 = 0,
        theta1 = 0,
        color = d3.scaleLinear(),
        normalize = false,
        mx,
        my,
        mouseX,
        mouseY,
        myTimer;

    const theta0Range = _.range(
        -data.theta0_best * 2.5,
        data.theta0_best * 2.5 + 1,
        1.5
    );
    const theta1Range = _.range(
        -data.theta1_best * 2.5,
        data.theta1_best * 2.5 + 1,
        1.5
    );
    const xMean = d3.mean(data.data.map((d) => d.X)),
        xStd = d3.deviation(data.data.map((d) => d.X));
    const dataNormalized = data.data.map(function (d) {
        return {
            i: d["i"],
            X_b: d["X_b"],
            X: (d["X"] - xMean) / xStd,
            y: d["y"],
        };
    });

    var grid3d = d3
            ._3d()
            .shape("GRID", theta1Range.length)
            .origin(origin)
            .rotateY(startAngleY)
            .rotateX(startAngleX)
            .scale(scale),
        surface = d3
            ._3d()
            .scale(scale)
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
            .z(function (d) {
                return d.z;
            })
            .origin(origin)
            .rotateY(startAngleY)
            .rotateX(startAngleX)
            .shape("SURFACE", theta1Range.length),
        scale3d = d3
            ._3d()
            .shape("LINE_STRIP")
            .origin(origin)
            .rotateY(startAngleY)
            .rotateX(startAngleX)
            .scale(scale),
        point3d = d3
            ._3d()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
            .z(function (d) {
                return d.z;
            })
            .origin(origin)
            .rotateY(startAngleY)
            .rotateX(startAngleX)
            .scale(scale);

    const scatterBaseSvg = d3
        .select("#chart4-scatter")
        .append("svg")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .call(responsivefy);

    var lossBaseSvg = baseSvg
        .call(
            d3
                .drag()
                .on("drag", (event, d) => dragged(event, d))
                .on("start", (event, d) => dragStart(event, d))
                .on("end", (event, d) => dragEnd(event, d))
        )
        .append("g");

    scatterBaseSvg
        .append("clipPath")
        .attr("id", "chart4-scatter-clip")
        .append("rect")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight);

    lossBaseSvg
        .append("clipPath")
        .attr("id", "chart4-loss-clip")
        .append("rect")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom);

    const scatterSvg = scatterBaseSvg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Draw frameworks
    const residuals = scatterSvg.append("g").attr("class", "residuals"),
        scatters = scatterSvg.append("g").attr("class", "scatters"),
        lines = scatterSvg.append("g").attr("class", "lines"),
        lossdot = lossBaseSvg.append("g").attr("class", "lossdot-group");

    // Draw axis
    var xScaleScatter = d3
            .scaleLinear()
            .range([0, chartWidth])
            .domain([0, d3.max(data.data, (d) => d.X)]),
        yScaleScatter = d3
            .scaleLinear()
            .range([chartHeight, 0])
            .domain(d3.extent(data.data, (d) => d.y)),
        xAxisDrawScatter = scatterSvg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${chartHeight})`),
        yAxisDrawScatter = scatterSvg
            .append("g")
            .attr("class", "y axis")
            .transition(t)
            .call(d3.axisLeft(yScaleScatter).scale(yScaleScatter));
    yAxisDrawScatter.selectAll("text").attr("dx", "-0.6em");

    xAxisDrawScatter
        .transition(t)
        .call(d3.axisBottom(xScaleScatter).scale(xScaleScatter));

    var theta0_init = +d3.select("#chart4-theta0-init").attr("value"),
        theta1_init = +d3.select("#chart4-theta1-init").attr("value"),
        learning_rate = +d3.select("#chart4-learning-rate").attr("value"),
        controlsHeight = "4em",
        steps_dict = { 0: [theta0_init, theta1_init] };

    var sliderSvg = d3
        .select("div#chart4-slider")
        .append("svg")
        .attr("width", "100%")
        .attr("height", controlsHeight);

    var sliderSvgRect = sliderSvg.node().getBoundingClientRect();
    var slider = d3
        .sliderBottom()
        .width(sliderSvgRect.width * 0.9)
        .ticks(5)
        .min(0)
        .max(200)
        .step(1)
        .handle(d3.symbol().type(d3.symbolCircle).size(200)())
        .on("drag start", (val) => {
            clearInterval(myTimer);
        })
        .on("onchange", (val) => {
            if (!(val in steps_dict)) {
                var next =
                    d3.max(
                        Object.keys(steps_dict)
                            .map((d) => Number(d))
                            .filter((d) => d < val)
                    ) + 1;
                while (next <= val) {
                    steps_dict[next] = [
                        steps_dict[next - 1][0] -
                            learning_rate *
                                (d3.sum(
                                    currentData.map(
                                        (d) =>
                                            (steps_dict[next - 1][0] * d.X_b +
                                                steps_dict[next - 1][1] * d.X -
                                                d.y) *
                                            d.X_b
                                    )
                                ) /
                                    currentData.length),
                        steps_dict[next - 1][1] -
                            learning_rate *
                                (d3.sum(
                                    currentData.map(
                                        (d) =>
                                            (steps_dict[next - 1][0] * d.X_b +
                                                steps_dict[next - 1][1] * d.X -
                                                d.y) *
                                            d.X
                                    )
                                ) /
                                    currentData.length),
                    ];
                    next++;
                }
            }
            theta0 = steps_dict[val][0];
            theta1 = steps_dict[val][1];
            updateResiduals(theta0, theta1);
            updateLine(theta0, theta1);
            updateLossDot(
                point3d
                    .rotateY(beta + startAngleY)
                    .rotateX(alpha + startAngleX)([
                    { x: theta0, y: eq(data.data, theta0, theta1), z: theta1 },
                ])
            );
            updateMathJax(theta0, theta1);
        });

    var sliderG = sliderSvg
        .append("g")
        .attr(
            "transform",
            `translate(${sliderSvgRect.width * 0.05},${
                sliderSvgRect.height / 3
            })`
        );

    sliderG.call(slider.value(30)).attr("id", "chart4-slider");
    slider.value(0);

    plotScatter(data.data);
    plotLoss(data.data);
    updateMathJax(theta0_init, theta1_init);

    scatterSvg
        .append("foreignObject")
        .attr("height", 50)
        .attr("width", 100)
        .attr(
            "transform",
            `translate(${-margin.left * 1.25},${
                chartHeight / 2 + 50
            }),rotate(-90)`
        )
        .append("xhtml:span")
        .attr("class", "axisLabel")
        .style("font-size", "medium");

    scatterSvg
        .append("foreignObject")
        .attr("height", 50)
        .attr("width", 100)
        .attr(
            "transform",
            `translate(${chartWidth / 2 - 50},${chartHeight + 5})`
        )
        .append("xhtml:span")
        .attr("class", "axisLabel")
        .style("font-size", "medium");

    let axisNodes = d3.selectAll("#chart4 .axisLabel").nodes();
    axisNodes[0].innerHTML = String.raw`$$y$$`;
    axisNodes[1].innerHTML = String.raw`$$X$$`;
    MathJax.typesetPromise(axisNodes).then(() => {});

    d3.select("#chart4-normalize-check").on("click", function () {
        let currentSlider = slider.value();

        if (this.checked) {
            currentData = dataNormalized;
        } else {
            currentData = data.data;
        }

        steps_dict = { 0: [theta0_init, theta1_init] };
        slider.value(0);
        slider.value(currentSlider);

        xScaleScatter.domain(d3.extent(currentData, (d) => d.X));
        xAxisDrawScatter
            .transition()
            .duration(500)
            .call(d3.axisBottom(xScaleScatter).scale(xScaleScatter));
        plotLoss(currentData);
        updateResiduals(theta0, theta1);
        updateLine(theta0, theta1);
    });

    d3.select("#chart4-btn-play").on("click", function () {
        clearInterval(myTimer);
        myTimer = setInterval(function () {
            var t = (slider.value() + 1) % (slider.max() + 1);
            if (t == 0) {
                clearInterval(myTimer);
            } else {
                slider.value(t);
            }
        }, 150);
    });

    d3.select("#chart4-btn-pause").on("click", function () {
        clearInterval(myTimer);
    });

    d3.select("#chart4-btn-stop").on("click", function () {
        clearInterval(myTimer);
        slider.value(slider.min());
    });

    d3.select("#chart4-btn-forward").on("click", function () {
        clearInterval(myTimer);
        if (slider.value().toFixed(0) == slider.max().toFixed(0)) {
            slider.value(slider.min());
        } else {
            slider.value(slider.value() + 1);
        }
    });

    d3.select("#chart4-btn-backward").on("click", function () {
        clearInterval(myTimer);
        if (slider.value().toFixed(0) == slider.min().toFixed(0)) {
            slider.value(slider.max());
        } else {
            slider.value(slider.value() - 1);
        }
    });

    d3.select("#chart4-btn-fast-forward").on("click", function () {
        clearInterval(myTimer);
        slider.value(slider.max());
    });

    d3.select("#chart4-btn-fast-backward").on("click", function () {
        clearInterval(myTimer);
        slider.value(slider.min());
    });

    d3.select("#chart4-learning-rate").on("input", function () {
        learning_rate = +this.value;
        steps_dict = { 0: [theta0_init, theta1_init] };
        if (!(slider.value() in steps_dict)) {
            var next =
                d3.max(
                    Object.keys(steps_dict)
                        .map((d) => Number(d))
                        .filter((d) => d < slider.value())
                ) + 1;
            while (next <= slider.value()) {
                steps_dict[next] = [
                    steps_dict[next - 1][0] -
                        learning_rate *
                            (d3.sum(
                                currentData.map(
                                    (d) =>
                                        (steps_dict[next - 1][0] * d.X_b +
                                            steps_dict[next - 1][1] * d.X -
                                            d.y) *
                                        d.X_b
                                )
                            ) /
                                currentData.length),
                    steps_dict[next - 1][1] -
                        learning_rate *
                            (d3.sum(
                                currentData.map(
                                    (d) =>
                                        (steps_dict[next - 1][0] * d.X_b +
                                            steps_dict[next - 1][1] * d.X -
                                            d.y) *
                                        d.X
                                )
                            ) /
                                currentData.length),
                ];
                next++;
            }
        }
        theta0 = steps_dict[slider.value()][0];
        theta1 = steps_dict[slider.value()][1];
        updateResiduals(theta0, theta1);
        updateLine(theta0, theta1);
        updateLossDot(
            point3d.rotateY(beta + startAngleY).rotateX(alpha + startAngleX)([
                { x: theta0, y: eq(currentData, theta0, theta1), z: theta1 },
            ])
        );
        updateMathJax(theta0, theta1);
    });

    d3.select("#chart4-theta1-init").on("input", function () {
        theta1_init = +this.value;
        steps_dict = { 0: [theta0_init, theta1_init] };
        if (!(slider.value() in steps_dict)) {
            var next =
                d3.max(
                    Object.keys(steps_dict)
                        .map((d) => Number(d))
                        .filter((d) => d < slider.value())
                ) + 1;
            while (next <= slider.value()) {
                steps_dict[next] = [
                    steps_dict[next - 1][0] -
                        learning_rate *
                            (d3.sum(
                                currentData.map(
                                    (d) =>
                                        (steps_dict[next - 1][0] * d.X_b +
                                            steps_dict[next - 1][1] * d.X -
                                            d.y) *
                                        d.X_b
                                )
                            ) /
                                currentData.length),
                    steps_dict[next - 1][1] -
                        learning_rate *
                            (d3.sum(
                                currentData.map(
                                    (d) =>
                                        (steps_dict[next - 1][0] * d.X_b +
                                            steps_dict[next - 1][1] * d.X -
                                            d.y) *
                                        d.X
                                )
                            ) /
                                currentData.length),
                ];
                next++;
            }
        }
        theta0 = steps_dict[slider.value()][0];
        theta1 = steps_dict[slider.value()][1];
        updateResiduals(theta0, theta1);
        updateLine(theta0, theta1);
        updateLossDot(
            point3d.rotateY(beta + startAngleY).rotateX(alpha + startAngleX)([
                { x: theta0, y: eq(currentData, theta0, theta1), z: theta1 },
            ])
        );
        updateMathJax(theta0, theta1);
    });

    d3.select("#chart4-theta0-init").on("input", function () {
        theta0_init = +this.value;
        steps_dict = { 0: [theta0_init, theta1_init] };
        if (!(slider.value() in steps_dict)) {
            var next =
                d3.max(
                    Object.keys(steps_dict)
                        .map((d) => Number(d))
                        .filter((d) => d < slider.value())
                ) + 1;
            while (next <= slider.value()) {
                steps_dict[next] = [
                    steps_dict[next - 1][0] -
                        learning_rate *
                            (d3.sum(
                                currentData.map(
                                    (d) =>
                                        (steps_dict[next - 1][0] * d.X_b +
                                            steps_dict[next - 1][1] * d.X -
                                            d.y) *
                                        d.X_b
                                )
                            ) /
                                currentData.length),
                    steps_dict[next - 1][1] -
                        learning_rate *
                            (d3.sum(
                                currentData.map(
                                    (d) =>
                                        (steps_dict[next - 1][0] * d.X_b +
                                            steps_dict[next - 1][1] * d.X -
                                            d.y) *
                                        d.X
                                )
                            ) /
                                currentData.length),
                ];
                next++;
            }
        }
        theta0 = steps_dict[slider.value()][0];
        theta1 = steps_dict[slider.value()][1];
        updateResiduals(theta0, theta1);
        updateLine(theta0, theta1);
        updateLossDot(
            point3d.rotateY(beta + startAngleY).rotateX(alpha + startAngleX)([
                { x: theta0, y: eq(currentData, theta0, theta1), z: theta1 },
            ])
        );
        updateMathJax(theta0, theta1);
    });

    d3.select("#chart4-scenario-1").on("click", function () {
        slider.value(0);
        let normalizeButton = document.getElementById("chart4-normalize-check");
        if (normalizeButton.checked) {
            normalizeButton.click();
        }

        learning_rate = 0.05;
        theta0_init = 8.5;
        theta1_init = -4;
        steps_dict = { 0: [theta0_init, theta1_init] };

        xScaleScatter.domain(d3.extent(currentData, (d) => d.X));
        xAxisDrawScatter
            .transition()
            .duration(500)
            .call(d3.axisBottom(xScaleScatter).scale(xScaleScatter));
        plotLoss(currentData);
        updateResiduals(theta0, theta1);
        updateLine(theta0, theta1);
        document.getElementById("chart4-learning-rate").value = 0.05;
        document.getElementById("chart4-theta0-init").value = 8.5;
        document.getElementById("chart4-theta1-init").value = -4;
        document.getElementById("chart4-btn-play").click();
    });

    d3.select("#chart4-scenario-2").on("click", function () {
        slider.value(_.random(0, 200));
        let normalizeButton = document.getElementById("chart4-normalize-check");
        if (!normalizeButton.checked) {
            normalizeButton.click();
        }

        learning_rate = 0.05;
        theta0_init = 8.5;
        theta1_init = -4;
        steps_dict = { 0: [theta0_init, theta1_init] };

        xScaleScatter.domain(d3.extent(currentData, (d) => d.X));
        xAxisDrawScatter
            .transition()
            .duration(500)
            .call(d3.axisBottom(xScaleScatter).scale(xScaleScatter));
        plotLoss(currentData);
        updateResiduals(theta0, theta1);
        updateLine(theta0, theta1);
        document.getElementById("chart4-learning-rate").value = 0.05;
        document.getElementById("chart4-theta0-init").value = 8.5;
        document.getElementById("chart4-theta1-init").value = -4;
        document.getElementById("chart4-btn-play").click();
    });
}

d3.json("/static/js/posts/gradient_descent/data.json").then(function (data) {
    chart4(data);
});
