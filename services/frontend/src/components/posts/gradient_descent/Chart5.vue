<template>
    <div id="chart5" class="col-md-12 col-lg-12 col-xl-12">
        <div class="row">
            <div class="col-4 p-1 text-center">
                <div class="card" style="width: 100%; overflow: hidden">
                    <div class="card-body">
                        <h5 class="card-title">Batch GD</h5>
                        <div class="row">
                            <div id="batchgd-theta" class="col-6">$$\theta=$$</div>
                            <div id="batchgd-mse" class="col-6">$$\textrm{MSE}=$$</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 p-1 text-center">
                <div class="card" style="width: 100%; overflow: hidden;">
                    <div class="card-body">
                        <h5 class="card-title">Stochastic GD</h5>
                        <div class="row">
                            <div id="stochasticgd-theta" class="col-6">$$\theta=$$</div>
                            <div id="stochasticgd-mse" class="col-6">$$\textrm{MSE}=$$</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 p-1 text-center">
                <div class="card" style="width: 100%; overflow: hidden">
                    <div class="card-body">
                        <h5 class="card-title">Mini-batch GD</h5>
                        <div class="row">
                            <div id="minibatchgd-theta" class="col-6">$$\theta=$$</div>
                            <div id="minibatchgd-mse" class="col-6">$$\textrm{MSE}=$$</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6 p-0 text-center">
                <div id="chart5-scatter" style="height: 22em;"></div>
            </div>
            <div class="col-6 p-0 text-center">
                <div id="chart5-contour" style="height: 22em;"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-6 text-center" style="float:none;margin:auto;">
                <a id="chart5-new-data-button" class="btn btn-primary btn-sm" role="button" aria-pressed="true">New data</a>
                <a id="chart5-normalize-button" class="btn btn-primary btn-sm" role="button"
                    aria-pressed="true">Normalize</a>
                <a id="chart5-race-button" class="btn btn-primary btn-sm" role="button" aria-pressed="true">Play</a>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend'
import _ from 'lodash';


export default {
    data() {
        return {
        }
    },
    mounted() {
        this.drawChart5();
    },
    watch: {
    },
    methods: {
        drawChart5 () {
            d3.select("#chart5-contour").selectAll("svg").remove();
            d3.select("#chart5-scatter").selectAll("svg").remove();
            /**
             * @name createData
             * @description Function that creates a new dataset.
             * @param {Number} n
             */
            function createData(n) {
                let xStart = +(2 * Math.random()).toFixed(2),
                    xEnd = +(10 + 5 * Math.random()).toFixed(2),
                    yStart = +(5 * Math.random()).toFixed(2),
                    yEnd =
                        (10 + +(10 * Math.random()).toFixed(2)) *
                        (Math.random() > 0.5 ? 1 : -1),
                    m = Math.round(10 * (Math.random() > 0.5 ? 1 : -1) * Math.random()),
                    b = Math.round(20 * (Math.random() > 0.5 ? 1 : -1) * Math.random()),
                    f = function (x) {
                        return m * x + b;
                    },
                    data = [];

                for (let i = 0; i < n; i++) {
                    let x = +((xEnd - xStart) * Math.random()).toFixed(2);
                    data.push({
                        i: i,
                        x: x,
                        y: f(x) + 10 * Math.random() * (Math.random() > 0.5 ? 1 : -1),
                    });
                }

                return { f: f, data: data, m: m, b: b };
            }

            /**
             * @name updateScatterChart
             * @description Function that contains functionalities for updating the scatter chart.
             */
            function updateScatterChart() {
                /**
                 * @name updateScatter
                 * @description Function that updates the scatter chart.
                 */
                function updateScatter() {
                    scatter
                        .selectAll(".dot")
                        .data(data.data)
                        .join(
                            (enter) =>
                                enter
                                    .append("circle")
                                    .attr("class", "dot")
                                    .attr("r", 5)
                                    .attr("cx", (d) => xScaleScatter(d.x))
                                    .attr("cy", (d) => yScaleScatter(d.y))
                                    .style("fill", "blue"),
                            (update) =>
                                update
                                    .transition()
                                    .duration(500)
                                    .attr("cx", (d) => xScaleScatter(d.x))
                                    .attr("cy", (d) => yScaleScatter(d.y)),
                            (exit) => exit.remove()
                        );
                }

                // Update scales & axis
                xScaleScatter.domain(d3.extent(data.data.map((d) => d.x)));
                yScaleScatter.domain(d3.extent(data.data.map((d) => d.y)));
                xAxisScatter.transition().duration(500).call(d3.axisBottom(xScaleScatter));
                yAxisScatter.transition().duration(500).call(d3.axisLeft(yScaleScatter));

                // Scatter
                updateScatter();
            }

            /**
             * @name updateContourChart
             * @description Function that contains functionalities to update the contour chart.
             */
            function updateContourChart() {
                /**
                 * @name updateContour
                 * @description Function that updates the contour.
                 */
                function updateContour() {
                    contours
                        .selectAll("path.contour")
                        .data(contourValues)
                        .join(
                            (enter) =>
                                enter
                                    .append("path")
                                    .attr("class", "contour")
                                    .attr("clip-path", "url(#contour-clip)")
                                    .attr(
                                        "d",
                                        d3.geoPath(
                                            d3
                                                .geoIdentity()
                                                .scale(
                                                    (width - margin.top) /
                                                        theta1Range.length
                                                )
                                        )
                                    )
                                    .attr("fill", function (d) {
                                        return color(d.value);
                                    }),
                            (update) =>
                                update
                                    .attr(
                                        "d",
                                        d3.geoPath(
                                            d3
                                                .geoIdentity()
                                                .scale(
                                                    (width - margin.top) /
                                                        theta1Range.length
                                                )
                                        )
                                    )
                                    .attr("fill", function (d) {
                                        return color(d.value);
                                    }),
                            (exit) => exit.remove()
                        );
                }

                // Contour
                xScaleContour.domain(d3.extent(theta0Range));
                yScaleContour.domain(d3.extent(theta1Range));
                xAxisContour.transition().duration(500).call(d3.axisBottom(xScaleContour));
                yAxisContour.transition().duration(500).call(d3.axisLeft(yScaleContour));

                let thresholds = d3.range(
                        d3.min(loss, (d) => d.loss),
                        d3.max(loss, (d) => d.loss),
                        (d3.max(loss, (d) => d.loss) - d3.min(loss, (d) => d.loss)) / 21
                    ),
                    color = d3
                        .scaleSequential(d3.interpolateGreys)
                        .domain([d3.min(thresholds), d3.max(thresholds)]),
                    contourValues = d3
                        .contours()
                        .size([theta0Range.length, theta1Range.length])
                        .smooth(true)
                        .thresholds(thresholds)(loss.map((d) => d.loss));

                updateContour();

                // GD Paths
                gdPaths.selectAll("path.gd-line").remove();
            }

            function transition(path) {
                path.transition().duration(1000).attrTween("stroke-dasharray", tweenDash);
                //.on("end", function() { d3.select(this).call(transition); });
            }

            function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                return function (t) {
                    return i(t);
                };
            }

            /**
             * @name updateRegression
             * @description Function that updates the regression line.
             * @param {Array} regressionData
             */
            function updateRegression(regressionData) {
                regression
                    .selectAll("path.regression-line")
                    .data(regressionData)
                    .join(
                        (enter) =>
                            enter
                                .append("path")
                                .attr("class", `regression-line ${(d) => d.id}`)
                                .attr("clip-path", "url(#scatter-clip)")
                                .attr("fill", "none")
                                .attr("stroke", (d) => d.color)
                                .attr("stroke-width", 2)
                                .attr("d", (d) =>
                                    d3
                                        .line()
                                        .x((d) => xScaleScatter(d.x))
                                        .y((d) => yScaleScatter(d.y))(d.values)
                                ),
                        (update) =>
                            update
                                .transition()
                                .duration(100)
                                .attr("d", (d) =>
                                    d3
                                        .line()
                                        .x((d) => xScaleScatter(d.x))
                                        .y((d) => yScaleScatter(d.y))(d.values)
                                )
                    );
            }

            /**
             * @name updateGD
             * @description Function that updates the gradient descent regression lines.
             * @param {Array} data
             */
            function updateGD(data) {
                let lineGenerator = d3
                    .line()
                    .x((d) => xScaleContour(d.theta0))
                    .y((d) => yScaleContour(d.theta1));
                let paths = gdPaths.selectAll("path.gd-line").data(data);

                paths = paths
                    .enter((d) => d.id)
                    .append("path")
                    .attr("class", (d) => `gd-line ${d.id}`)
                    .attr("clip-path", "url(#contour-clip)")
                    .merge(paths);
                paths
                    .attr("fill", "none")
                    .attr("stroke", (d) => d.color)
                    .attr("stroke-width", 3)
                    .attr("d", (d) => lineGenerator(d.values));
            }

            /**
             * @name computeLoss
             * @description Function that computes a MSE loss.
             * @param {Array} data
             * @param {Number} theta0
             * @param {Number} theta1
             */
            function computeLoss(data, theta0, theta1) {
                return (
                    (1 / (2 * data.length)) *
                    d3.sum(data.map((d) => (theta1 * d.x + theta0 - d.y) ** 2))
                );
            }

            /**
             * @name thetaRange
             * @description Function that computes a range around theta based on a magnitude.
             * @param {Number} theta
             * @param {Number} magnitude
             * @param {Number} step
             */
            function thetaRange(theta, magnitude, step) {
                let extent = d3.extent([theta - magnitude, theta + magnitude]);
                return _.range(extent[0], extent[1], step).map((d) => +d.toFixed(2));
            }

            /**
             * @name normalize
             * @description Function that mean normalizes a number.
             * @param {Number} x
             * @param {Number} min
             * @param {Number} max
             */
            function normalize(x, min, max) {
                return (x - min) / (max - min);
            }

            /**
             * @name resetParameters
             * @description Function that resets all gradient descent parameters.
             */
            function resetParameters() {
                if (!normalized) {
                    data = dataRaw;
                } else {
                    data = dataNormalized;
                }

                theta0BestGD = 0;
                theta1BestGD = 0;
                for (let i = 0; i < 5000; i++) {
                    [theta0BestGD, theta1BestGD] = batchGDStep(
                        data.data,
                        theta0BestGD,
                        theta1BestGD
                    );
                }

                dataExtent = d3.extent(data.data.map((d) => d.x));
                theta0Range = thetaRange(
                    theta0BestGD,
                    d3.max([Math.abs(theta0BestGD), Math.abs(theta1BestGD)]) * 0.5,
                    0.1
                );
                theta1Range = thetaRange(
                    theta1BestGD,
                    d3.max([Math.abs(theta0BestGD), Math.abs(theta1BestGD)]) * 0.5,
                    0.1
                );
                theta0Init =
                    Math.random() > 0.5
                        ? theta0Range[_.random(0, 10)]
                        : theta0Range.slice(-_.random(0, 10))[0];
                theta1Init =
                    Math.random() > 0.5
                        ? theta1Range[_.random(0, 10)]
                        : theta1Range.slice(-_.random(0, 10))[0];
                theta0BGD = theta0Init;
                theta1BGD = theta1Init;
                bgdPath = [];
                theta0SGD = theta0Init;
                theta1SGD = theta1Init;
                sgdPath = [];
                theta0MBGD = theta0Init;
                theta1MBGD = theta1Init;
                mbgdPath = [];
                bgdPath.push({ theta0: theta0BGD, theta1: theta1BGD });
                sgdPath.push({ theta0: theta0SGD, theta1: theta1SGD });
                mbgdPath.push({ theta0: theta0MBGD, theta1: theta1MBGD });

                loss = [];
                theta0Range.forEach(function (theta0) {
                    theta1Range.forEach(function (theta1) {
                        loss.push({
                            theta0: theta0,
                            theta1: theta1,
                            loss: computeLoss(data.data, theta0, theta1),
                        });
                    });
                });
            }

            /**
             * @name newData
             * @description Function that preprocesses new data.
             */
            function newData() {
                dataRaw = createData(100);
                dataExtent = d3.extent(dataRaw.data.map((d) => d.x));
                dataNormalized = JSON.parse(JSON.stringify(dataRaw));
                dataNormalized.data.forEach(
                    (d) => (d.x = normalize(d.x, dataExtent[0], dataExtent[1]))
                );

                data = dataRaw;
            }

            /**
             * @name djdt0
             * @description Function that computes the first partial derivative.
             * @param {Array} data
             * @param {Number} theta0
             * @param {Number} theta1
             */
            function djdt0(data, theta0, theta1) {
                return (
                    (1 / data.length) * d3.sum(data.map((d) => theta0 + theta1 * d.x - d.y))
                );
            }

            /**
             * @name djdt1
             * @description Function that computes the second partial derivative.
             * @param {Array} data
             * @param {Number} theta0
             * @param {Number} theta1
             */
            function djdt1(data, theta0, theta1) {
                return (
                    (1 / data.length) *
                    d3.sum(data.map((d) => (theta0 + theta1 * d.x - d.y) * d.x))
                );
            }

            /**
             * @name batchGDStep
             * @description Function that computes one batch gradient descent step.
             * @param {Array} data
             * @param {Number} theta0
             * @param {Number} theta1
             */
            function batchGDStep(data, theta0, theta1) {
                theta0 = theta0 - djdt0(data, theta0, theta1) * learningRate;
                theta1 = theta1 - djdt1(data, theta0, theta1) * learningRate;

                return [theta0, theta1];
            }

            /**
             * @name miniBatchGDStep
             * @description Function that computes one mini batch gradient descent step.
             * @param {Array} data
             * @param {Number} batchSize
             * @param {Number} theta0
             * @param {Number} theta1
             */
            function miniBatchGDStep(data, batchSize, theta0, theta1) {
                data = _.shuffle(data).slice(0, batchSize);
                return batchGDStep(data, theta0, theta1);
            }

            /**
             * @name stochasticGDStep
             * @description Function that computes one stochastic gradient descent step.
             * @param {Array} data
             * @param {Number} theta0
             * @param {Number} theta1
             */
            function stochasticGDStep(data, theta0, theta1) {
                return miniBatchGDStep(data, 1, theta0, theta1);
            }

            /**
             * @name step
             * @description Generic function for one computation step.
             */
            function step() {
                ++stepCount;

                // Contour
                [theta0BGD, theta1BGD] = batchGDStep(data.data, theta0BGD, theta1BGD);
                [theta0SGD, theta1SGD] = stochasticGDStep(data.data, theta0SGD, theta1SGD);
                [theta0MBGD, theta1MBGD] = miniBatchGDStep(
                    data.data,
                    10,
                    theta0SGD,
                    theta1SGD
                );

                bgdPath.push({ theta0: theta0BGD, theta1: theta1BGD });
                sgdPath.push({ theta0: theta0SGD, theta1: theta1SGD });
                mbgdPath.push({ theta0: theta0MBGD, theta1: theta1MBGD });

                updateGD([
                    { id: "bgd", color: "blue", values: bgdPath },
                    { id: "sgd", color: "red", values: sgdPath },
                    { id: "mbgd", color: "green", values: mbgdPath },
                ]);

                // Scatter
                let regressionData, bgdLine, sgdLine, mbgdLine;

                bgdLine = [
                    { x: dataExtent[0], y: theta0BGD + theta1BGD * dataExtent[0] },
                    { x: dataExtent[1], y: theta0BGD + theta1BGD * dataExtent[1] },
                ];
                sgdLine = [
                    { x: dataExtent[0], y: theta0SGD + theta1SGD * dataExtent[0] },
                    { x: dataExtent[1], y: theta0SGD + theta1SGD * dataExtent[1] },
                ];
                mbgdLine = [
                    { x: dataExtent[0], y: theta0MBGD + theta1MBGD * dataExtent[0] },
                    { x: dataExtent[1], y: theta0SGD + theta1SGD * dataExtent[1] },
                ];
                regressionData = [
                    { id: "bgd", color: "blue", values: bgdLine },
                    { id: "sgd", color: "red", values: sgdLine },
                    { id: "mbgd", color: "green", values: mbgdLine },
                ];

                updateRegression(regressionData);

                // MathJax
                if (stepCount % 10 == 0) {
                    const nodes = [
                        document.getElementById("batchgd-theta"),
                        document.getElementById("batchgd-mse"),
                        document.getElementById("stochasticgd-theta"),
                        document.getElementById("stochasticgd-mse"),
                        document.getElementById("minibatchgd-theta"),
                        document.getElementById("minibatchgd-mse"),
                    ];
                    MathJax.typesetClear(nodes);

                    let batchgdMSE = computeLoss(data.data, theta0BGD, theta1BGD),
                        stochasticgdMSE = computeLoss(data.data, theta0SGD, theta1SGD),
                        minibatchgdMSE = computeLoss(data.data, theta0MBGD, theta1MBGD);

                    nodes[0].innerHTML = String.raw`$$\theta=\begin{pmatrix}${theta0BGD.toFixed(
                        2
                    )}\\${theta1BGD.toFixed(2)}\end{pmatrix}$$`;
                    nodes[1].innerHTML = String.raw`$$\textrm{MSE}=${batchgdMSE.toFixed(
                        2
                    )}$$`;
                    nodes[2].innerHTML = String.raw`$$\theta=\begin{pmatrix}${theta0SGD.toFixed(
                        2
                    )}\\${theta1SGD.toFixed(2)}\end{pmatrix}$$`;
                    nodes[3].innerHTML = String.raw`$$\textrm{MSE}=${stochasticgdMSE.toFixed(
                        2
                    )}$$`;
                    nodes[4].innerHTML = String.raw`$$\theta=\begin{pmatrix}${theta0MBGD.toFixed(
                        2
                    )}\\${theta1MBGD.toFixed(2)}\end{pmatrix}$$`;
                    nodes[5].innerHTML = String.raw`$$\textrm{MSE}=${minibatchgdMSE.toFixed(
                        2
                    )}$$`;
                    MathJax.typesetPromise(nodes).then(() => {});
                }
            }

            /**
             * @name init
             * @description Function that initializes the visualization.
             * @param {Boolean} createData
             */
            function init(createData) {
                if (createData) {
                    newData();
                }
                resetParameters();
                updateScatterChart();
                updateContourChart();
            }

            let moving, timer;
            d3.select("#chart5-race-button").on("click", function () {
                let button = d3.select(this);
                if (button.text() == "Pause") {
                    moving = false;
                    clearInterval(timer);
                    button.text("Play");
                } else {
                    moving = true;
                    timer = setInterval(step, 10);
                    button.text("Pause");
                }
            });

            d3.select("#chart5-new-data-button").on("click", function () {
                stepCount = 0;
                init(true);
            });

            d3.select("#chart5-normalize-button").on("click", function () {
                stepCount = 0;
                if (!normalized) {
                    normalized = true;
                } else {
                    normalized = false;
                }
                init(false);
            });

            let margin = { top: 40, right: 40, bottom: 40, left: 60 },
                width =
                    d3.select("#chart5-scatter").node().getBoundingClientRect().width -
                    margin.left -
                    margin.right,
                height =
                    d3.select("#chart5-scatter").node().getBoundingClientRect().height -
                    margin.top -
                    margin.bottom,
                learningRate = 0.01,
                theta0BestGT,
                theta1BestGT,
                theta0BestGD,
                theta1BestGD,
                theta0BGD,
                theta1BGD,
                bgdPath,
                theta0SGD,
                theta1SGD,
                sgdPath,
                theta0MBGD,
                theta1MBGD,
                mbgdPath,
                normalized = false,
                stepCount = 0,
                data,
                theta0Range,
                theta1Range,
                theta0Init,
                theta1Init,
                loss,
                dataExtent,
                dataRaw,
                dataNormalized;

            let svgScatterBase = d3
                    .select("#chart5-scatter")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.bottom + margin.top),
                svgScatter = svgScatterBase
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`),
                ordinal = d3
                    .scaleOrdinal()
                    .domain(["Batch GD", "Stochastic GD", "Mini-batch GD"])
                    .range(["blue", "red", "green"]),
                legend = legendColor().shape("line").shapePadding(2).scale(ordinal);

            let svgContourBase = d3
                    .select("#chart5-contour")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.bottom + margin.top),
                svgContour = svgContourBase
                    .append("g")
                    // .attr("fill", "none")
                    // .attr("stroke", "#fff")
                    .attr("stroke-opacity", 0.65)
                    .attr("transform", `translate(${margin.left},${margin.top})`);

            svgScatterBase
                .append("clipPath")
                .attr("id", "scatter-clip")
                .append("rect")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height);

            svgContourBase
                .append("clipPath")
                .attr("id", "contour-clip")
                .append("rect")
                .attr("width", width - margin.right)
                .attr("height", height);

            let xAxisScatter = svgScatter
                    .append("g")
                    .attr("transform", `translate(0, ${height})`),
                yAxisScatter = svgScatter.append("g"),
                xScaleScatter = d3.scaleLinear().range([0, width]),
                yScaleScatter = d3.scaleLinear().range([height, 0]),
                scatter = svgScatter.append("g"),
                regression = svgScatter.append("g");

            let xScaleContour = d3.scaleLinear().range([0, width - margin.right]),
                yScaleContour = d3.scaleLinear().range([height, 0]),
                xAxisContour = svgContour
                    .append("g")
                    .attr("class", "axis x")
                    .attr("transform", `translate(0,${height})`),
                yAxisContour = svgContour.append("g").attr("class", "axis y"),
                contours = svgContour.append("g"),
                gdPaths = svgContour.append("g");

            init(true);

            svgScatter
                .append("g")
                .attr("class", "legend")
                .attr("transform", "translate(20,20)")
                .style("font-size", "medium");
            svgScatter.select(".legend").append("rect");
            svgScatter.select(".legend").call(legend);
            let legendNode = svgScatter.select(".legend").node().getBBox();
            svgScatter
                .select(".legend rect")
                .attr("transform", `translate(0,${legendNode.y})`)
                .attr("width", legendNode.width)
                .attr("height", legendNode.height);

            svgContour
                .append("foreignObject")
                .attr("height", 50)
                .attr("width", 100)
                .attr(
                    "transform",
                    `translate(${-margin.left * 1.25},${height / 2 + 50}),rotate(-90)`
                )
                .append("xhtml:span")
                .attr("class", "axisLabel")
                .style("font-size", "medium");

            svgContour
                .append("foreignObject")
                .attr("height", 50)
                .attr("width", 100)
                .attr("transform", `translate(${width / 2 - 50},${height + 5})`)
                .append("xhtml:span")
                .attr("class", "axisLabel")
                .style("font-size", "medium");

            svgScatter
                .append("foreignObject")
                .attr("height", 50)
                .attr("width", 100)
                .attr(
                    "transform",
                    `translate(${-margin.left * 1.25},${height / 2 + 50}),rotate(-90)`
                )
                .append("xhtml:span")
                .attr("class", "axisLabel")
                .style("font-size", "medium");

            svgScatter
                .append("foreignObject")
                .attr("height", 50)
                .attr("width", 100)
                .attr("transform", `translate(${width / 2 - 50},${height + 5})`)
                .append("xhtml:span")
                .attr("class", "axisLabel")
                .style("font-size", "medium");

            let axisNodes = d3.selectAll(".axisLabel").nodes();
            axisNodes[0].innerHTML = String.raw`$$y$$`;
            axisNodes[1].innerHTML = String.raw`$$X$$`;
            axisNodes[2].innerHTML = String.raw`$$\theta_1$$`;
            axisNodes[3].innerHTML = String.raw`$$\theta_0$$`;
            MathJax.typesetPromise(axisNodes).then(() => {});
        }
    },
}
</script>