<template>
    <div id="chart2" class="col-md-10 col-lg-10 col-xl-10">
        <div class="row">
            <div class="col-6 p-0 text-center">
                <h5 id='chart2-function' style="height: 3em;">\(h_{\theta}(x)=\theta \cdot x =
                    \begin{pmatrix}1\\2\end{pmatrix} \cdot x\)</h5>
                <div id="chart2-scatter" style="height: 22em;"></div>
            </div>
            <div class="col-6 p-0 text-center">
                <h5 id="chart2-mse" style="height: 3em;"></h5>
                <div id="chart2-loss-function" style="height: 22em;"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-6 p-1 text-center align-middle">
                <h4>Steps</h4>
                <div id="chart2-cxslider"></div>
            </div>
            <div class="col-12 col-md-6 p-1 text-center">
                <h4>Parameters</h4>
                <table style="text-align: right; margin-left: auto; margin-right: auto;">
                    <tr>
                        <td>
                            <label for="learning-rate" style="display: inline-block; text-align: right">
                                \(\eta = \)<span id="learning-rate-value"></span>
                            </label>
                        </td>
                        <td>
                            <input type="number" min="0" max="2" step="0.01" value="0.05" id="learning-rate">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="theta1-init" style="display: inline-block; text-align: right">
                                \(\theta_1^\textrm{init} = \)<span id="theta1-value"></span>
                            </label>
                        </td>
                        <td>
                            <input type="number" min="-4" max="10" step="0.1" value="0" id="theta1-init">
                        </td>
                    </tr>
                </table>
            </div>
            <div class="col-12 p-1" style="text-align: center;">
                <button type="button" id="chart2-btn-fast-backward" class="btn btn-primary btn-sm">
                    <i class="fa fa-fast-backward"></i>
                </button>

                <button type="button" id="chart2-btn-backward" class="btn btn-primary btn-sm">
                    <i class="fa fa-backward"></i>
                </button>

                <button type="button" id="chart2-btn-play" class="btn btn-primary btn-sm">
                    <i class="fa fa-play"></i>
                </button>

                <button type="button" id="chart2-btn-pause" class="btn btn-primary btn-sm">
                    <i class="fa fa-pause"></i>
                </button>

                <button type="button" id="chart2-btn-stop" class="btn btn-primary btn-sm">
                    <i class="fa fa-stop"></i>
                </button>

                <button type="button" id="chart2-btn-forward" class="btn btn-primary btn-sm">
                    <i class="fa fa-forward"></i>
                </button>

                <button type="button" id="chart2-btn-fast-forward" class="btn btn-primary btn-sm">
                    <i class="fa fa-fast-forward"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import _ from 'lodash';
import { sliderBottom } from 'd3-simple-slider';


export default {
    data() {
        return {
        }
    },
    mounted() {
        this.drawChart2();
    },
    watch: {
    },
    methods: {
        drawChart2 () {
            d3.select("#chart2-scatter").selectAll("svg").remove();
            d3.select("#chart2-loss-function").selectAll("svg").remove();
            d3.select("#chart2-cxslider").selectAll("svg").remove();
            d3.json("/data/data.json").then(
                function (data) {
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
                     * @description Function that updates the MathJax for the MSE value.
                     */
                    function updateMathJax(theta1) {
                        const mse =
                            (1 / (2 * data.data.length)) *
                            d3.sum(
                                data.data.map((d) =>
                                    Math.pow(data.theta0_best * d.X_b + theta1 * d.X - d.y, 2)
                                )
                            );
                        const nodes = [
                            document.getElementById("chart2-function"),
                            document.getElementById("chart2-mse"),
                        ];
                        MathJax.typesetClear(nodes);
                        nodes[0].innerHTML = String.raw`$$ h_{\theta}(x)=\theta \cdot x = \begin{pmatrix}${data.theta0_best.toFixed(
                            2
                        )}\\${theta1.toFixed(2)}\end{pmatrix} \cdot x $$`;
                        nodes[1].innerHTML = String.raw`$$ \textrm{MSE}=${mse.toFixed(2)} $$`;
                        MathJax.typesetPromise(nodes).then(() => {});
                    }

                    /**
                     * @name plotScatter
                     * @description Function that updates the scatter plot.
                     */
                    function plotScatter() {
                        scatters
                            .selectAll(".scatter")
                            .data(data.data)
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
                     * @name plotLoss
                     * @description Function that updates the loss plot.
                     */
                    function plotLoss() {
                        const lineData = [
                            { v: xRangeLoss.map((d, i) => ({ x: d, y: yRangeLoss[i] })) },
                        ];
                        const lineGen = d3
                            .line()
                            .x((d) => xScaleLoss(d.x))
                            .y((d) => yScaleLoss(d.y));

                        loss.selectAll(".line")
                            .data(lineData)
                            .join((enter) => {
                                enter
                                    .append("path")
                                    .attr("class", "line")
                                    .attr("clip-path", "url(#loss-clip)")
                                    .transition()
                                    .duration(100)
                                    .attr("d", (d) => lineGen(d.v))
                                    .style("fill", "none")
                                    .style("stroke", "black");
                            });
                    }

                    /**
                     * @name updateLossDot
                     * @description Function that updates the scatter plot's loss dot.
                     * @param {Number} theta1
                     */
                    function updateLossDot(theta1) {
                        const mse =
                            (1 / (2 * data.data.length)) *
                            d3.sum(
                                data.data.map((d) =>
                                    Math.pow(data.theta0_best * d.X_b + theta1 * d.X - d.y, 2)
                                )
                            );
                        lossdot
                            .selectAll(".dot")
                            .data([{ x: theta1, y: mse }])
                            .join(
                                (enter) => {
                                    enter
                                        .append("circle")
                                        .attr("class", "dot")
                                        .attr("clip-path", "url(#loss-clip)")
                                        .transition()
                                        .duration(100)
                                        .attr("cx", (d) => xScaleLoss(d.x))
                                        .attr("cy", (d) => yScaleLoss(d.y))
                                        .attr("r", 5)
                                        .style("fill", "red");
                                },
                                (update) => {
                                    update
                                        .transition()
                                        .duration(100)
                                        .attr("cx", (d) => xScaleLoss(d.x))
                                        .attr("cy", (d) => yScaleLoss(d.y))
                                        .attr("r", 5);
                                }
                            );
                    }

                    /**
                     * @name updateResiduals
                     * @description Function that updates the scatter plot's residuals.
                     * @param {Number} m
                     * @param {Number} b
                     */
                    function updateResiduals(m, b) {
                        const residualLines = [];
                        const lineGen = d3
                            .line()
                            .x((d) => xScaleScatter(d.x))
                            .y((d) => yScaleScatter(d.y));
                        const yPred = getPredictions(
                            data.data.map((d) => d.X),
                            m,
                            b
                        );

                        data.data.forEach(function (d, i) {
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
                                        .attr("clip-path", "url(#scatter-clip)")
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
                                        .attr("clip-path", "url(#scatter-clip)")
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
                     * @param {Number} m
                     * @param {Number} b
                     */
                    function updateLine(m, b) {
                        const lineData = [
                            {
                                v: [0, d3.max(data.data, (d) => d.X)].map((d) => ({
                                    x: d,
                                    y: getPredictions([d], m, b)[0],
                                })),
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
                                        .attr("clip-path", "url(#scatter-clip)")
                                        .transition()
                                        .duration(100)
                                        .attr("d", (d) => lineGen(d.v))
                                        .style("fill", "none")
                                        .style("stroke", "black");
                                },
                                (update) => {
                                    update
                                        .attr("clip-path", "url(#scatter-clip)")
                                        .transition()
                                        .duration(100)
                                        .attr("d", (d) => lineGen(d.v));
                                }
                            );
                    }

                    const margin = { top: 40, bottom: 40, left: 60, right: 40 },
                        chartWidth =
                            d3.select("#chart2-scatter").node().getBoundingClientRect().width -
                            margin.left -
                            margin.right,
                        chartHeight =
                            d3.select("#chart2-scatter").node().getBoundingClientRect().height -
                            margin.top -
                            margin.bottom;

                    const scatterBaseSvg = d3
                        .select("#chart2-scatter")
                        .append("svg")
                        .attr("width", chartWidth + margin.left + margin.right)
                        .attr("height", chartHeight + margin.top + margin.bottom);

                    const lossBaseSvg = d3
                        .select("#chart2-loss-function")
                        .append("svg")
                        .attr("width", chartWidth + margin.left + margin.right)
                        .attr("height", chartHeight + margin.top + margin.bottom);

                    scatterBaseSvg
                        .append("clipPath")
                        .attr("id", "scatter-clip")
                        .append("rect")
                        .attr("width", chartWidth + margin.left + margin.right)
                        .attr("height", chartHeight);

                    lossBaseSvg
                        .append("clipPath")
                        .attr("id", "loss-clip")
                        .append("rect")
                        .attr("width", chartWidth + margin.left + margin.right)
                        .attr("height", chartHeight);

                    const scatterSvg = scatterBaseSvg
                        .append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);
                    const lossSvg = lossBaseSvg
                        .append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);

                    // Draw frameworks
                    const residuals = scatterSvg.append("g").attr("class", "residuals"),
                        scatters = scatterSvg.append("g").attr("class", "scatters"),
                        lines = scatterSvg.append("g").attr("class", "lines"),
                        loss = lossSvg.append("g").attr("class", "loss-group"),
                        lossdot = lossSvg.append("g").attr("class", "lossdot-group");

                    // Draw axis
                    const xScaleScatter = d3
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
                            .attr("transform", `translate(0, ${chartHeight})`)
                            .transition(t)
                            .call(d3.axisBottom(xScaleScatter).scale(xScaleScatter)),
                        yAxisDrawScatter = scatterSvg
                            .append("g")
                            .attr("class", "y axis")
                            .transition(t)
                            .call(d3.axisLeft(yScaleScatter).scale(yScaleScatter));
                    yAxisDrawScatter.selectAll("text").attr("dx", "-0.6em");

                    const xStartLoss = data.theta1_best * -2,
                        xEndLoss = data.theta1_best * 4,
                        xRangeLoss = _.range(xStartLoss, xEndLoss + 0.1, 0.1),
                        yRangeLoss = xRangeLoss.map(function (theta1) {
                            return (
                                (1 / (2 * data.data.length)) *
                                d3.sum(
                                    data.data.map((d) =>
                                        Math.pow(
                                            data.theta0_best * d.X_b + theta1 * d.X - d.y,
                                            2
                                        )
                                    )
                                )
                            );
                        });

                    const xScaleLoss = d3
                            .scaleLinear()
                            .range([0, chartWidth])
                            .domain([xStartLoss, xEndLoss]),
                        yScaleLoss = d3
                            .scaleLinear()
                            .range([chartHeight, 0])
                            .domain(d3.extent(yRangeLoss)),
                        xAxisDrawLoss = lossSvg
                            .append("g")
                            .attr("class", "x axis")
                            .attr("transform", `translate(0, ${chartHeight})`)
                            .transition(t)
                            .call(d3.axisBottom(xScaleLoss).scale(xScaleLoss)),
                        yAxisDrawLoss = lossSvg
                            .append("g")
                            .attr("class", "y axis")
                            .transition(t)
                            .call(d3.axisLeft(yScaleLoss).scale(yScaleLoss));
                    yAxisDrawLoss.selectAll("text").attr("dx", "-0.6em");

                    plotScatter(data.data);
                    plotLoss(data.data);

                    var theta1_init = +d3.select("#theta1-init").attr("value");
                    var learning_rate = +d3.select("#learning-rate").attr("value");

                    var controlsHeight = "4em";
                    var steps_dict = { 0: theta1_init };

                    var cxSliderSvg = d3
                        .select("div#chart2-cxslider")
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", controlsHeight);

                    var cxSliderSvgRect = cxSliderSvg.node().getBoundingClientRect();
                    var cxSlider = sliderBottom()
                        .width(cxSliderSvgRect.width * 0.9)
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
                                    steps_dict[next] =
                                        steps_dict[next - 1] -
                                        learning_rate *
                                            (d3.sum(
                                                data.data.map(
                                                    (d) =>
                                                        (data.theta0_best * d.X_b +
                                                            steps_dict[next - 1] * d.X -
                                                            d.y) *
                                                        d.X
                                                )
                                            ) /
                                                data.data.length);
                                    next++;
                                }
                            }
                            updateResiduals(steps_dict[val], data.theta0_best);
                            updateLine(steps_dict[val], data.theta0_best);
                            updateLossDot(steps_dict[val]);
                            updateMathJax(steps_dict[val]);
                        });

                    var cxSliderG = cxSliderSvg
                        .append("g")
                        .attr(
                            "transform",
                            `translate(${cxSliderSvgRect.width * 0.05},${
                                cxSliderSvgRect.height / 3
                            })`
                        );

                    cxSliderG.call(cxSlider.value(30)).attr("id", "chart2-cxslider");
                    cxSlider.value(0);

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

                    lossSvg
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

                    lossSvg
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

                    let axisNodes = d3.selectAll("#chart2 .axisLabel").nodes();
                    axisNodes[0].innerHTML = String.raw`$$y$$`;
                    axisNodes[1].innerHTML = String.raw`$$X$$`;
                    axisNodes[2].innerHTML = String.raw`$$\textrm{MSE}$$`;
                    axisNodes[3].innerHTML = String.raw`$$\theta_1$$`;
                    MathJax.typesetPromise(axisNodes).then(() => {});

                    var myTimer;
                    d3.select("#chart2-btn-play").on("click", function () {
                        clearInterval(myTimer);
                        myTimer = setInterval(function () {
                            var t = (cxSlider.value() + 1) % (cxSlider.max() + 1);
                            if (t == 0) {
                                clearInterval(myTimer);
                            } else {
                                cxSlider.value(t);
                            }
                        }, 150);
                    });

                    d3.select("#chart2-btn-pause").on("click", function () {
                        clearInterval(myTimer);
                    });

                    d3.select("#chart2-btn-stop").on("click", function () {
                        clearInterval(myTimer);
                        cxSlider.value(cxSlider.min());
                    });

                    d3.select("#chart2-btn-forward").on("click", function () {
                        clearInterval(myTimer);
                        if (cxSlider.value().toFixed(0) == cxSlider.max().toFixed(0)) {
                            cxSlider.value(cxSlider.min());
                        } else {
                            cxSlider.value(cxSlider.value() + 1);
                        }
                    });

                    d3.select("#chart2-btn-backward").on("click", function () {
                        clearInterval(myTimer);
                        if (cxSlider.value().toFixed(0) == cxSlider.min().toFixed(0)) {
                            cxSlider.value(cxSlider.max());
                        } else {
                            cxSlider.value(cxSlider.value() - 1);
                        }
                    });

                    d3.select("#chart2-btn-fast-forward").on("click", function () {
                        clearInterval(myTimer);
                        cxSlider.value(cxSlider.max());
                    });

                    d3.select("#chart2-btn-fast-backward").on("click", function () {
                        clearInterval(myTimer);
                        cxSlider.value(cxSlider.min());
                    });

                    d3.select("#learning-rate").on("input", function () {
                        learning_rate = +this.value;
                        steps_dict = { 0: theta1_init };
                        if (!(cxSlider.value() in steps_dict)) {
                            var next =
                                d3.max(
                                    Object.keys(steps_dict)
                                        .map((d) => Number(d))
                                        .filter((d) => d < cxSlider.value())
                                ) + 1;
                            while (next <= cxSlider.value()) {
                                steps_dict[next] =
                                    steps_dict[next - 1] -
                                    learning_rate *
                                        (d3.sum(
                                            data.data.map(
                                                (d) =>
                                                    (data.theta0_best * d.X_b +
                                                        steps_dict[next - 1] * d.X -
                                                        d.y) *
                                                    d.X
                                            )
                                        ) /
                                            data.data.length);
                                next++;
                            }
                        }
                        updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLine(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLossDot(steps_dict[cxSlider.value()]);
                        updateMathJax(steps_dict[cxSlider.value()]);
                    });

                    d3.select("#theta1-init").on("input", function () {
                        theta1_init = +this.value;
                        steps_dict = { 0: theta1_init };
                        if (!(cxSlider.value() in steps_dict)) {
                            var next =
                                d3.max(
                                    Object.keys(steps_dict)
                                        .map((d) => Number(d))
                                        .filter((d) => d < cxSlider.value())
                                ) + 1;
                            while (next <= cxSlider.value()) {
                                steps_dict[next] =
                                    steps_dict[next - 1] -
                                    learning_rate *
                                        (d3.sum(
                                            data.data.map(
                                                (d) =>
                                                    (data.theta0_best * d.X_b +
                                                        steps_dict[next - 1] * d.X -
                                                        d.y) *
                                                    d.X
                                            )
                                        ) /
                                            data.data.length);
                                next++;
                            }
                        }
                        updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLine(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLossDot(steps_dict[cxSlider.value()]);
                        updateMathJax(steps_dict[cxSlider.value()]);
                    });

                    d3.select("#chart2-scenario-1").on("click", function () {
                        cxSlider.value(0);
                        learning_rate = 1.75;
                        theta1_init = 9;
                        steps_dict = { 0: theta1_init };
                        updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLine(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLossDot(steps_dict[cxSlider.value()]);
                        document.getElementById("learning-rate").value = 1.75;
                        document.getElementById("theta1-init").value = 9;
                        document.getElementById("chart2-btn-play").click();
                    });

                    d3.select("#chart2-scenario-2").on("click", function () {
                        cxSlider.value(0);
                        learning_rate = 1.78;
                        theta1_init = -2;
                        steps_dict = { 0: theta1_init };
                        updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLine(steps_dict[cxSlider.value()], data.theta0_best);
                        document.getElementById("learning-rate").value = 1.77;
                        document.getElementById("theta1-init").value = -2;
                        document.getElementById("chart2-btn-play").click();
                    });

                    d3.select("#chart2-scenario-3").on("click", function () {
                        cxSlider.value(0);
                        learning_rate = 0.01;
                        theta1_init = 7;
                        steps_dict = { 0: theta1_init };
                        updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLine(steps_dict[cxSlider.value()], data.theta0_best);
                        document.getElementById("learning-rate").value = 0.01;
                        document.getElementById("theta1-init").value = 7;
                        document.getElementById("chart2-btn-play").click();
                    });

                    d3.select("#chart2-scenario-4").on("click", function () {
                        cxSlider.value(0);
                        learning_rate = 0.1;
                        theta1_init = -4;
                        steps_dict = { 0: theta1_init };
                        updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
                        updateLine(steps_dict[cxSlider.value()], data.theta0_best);
                        document.getElementById("learning-rate").value = 0.1;
                        document.getElementById("theta1-init").value = -4;
                        document.getElementById("chart2-btn-play").click();
                    });
                }
            );
        }
    },
}
</script>