<template>
    <div id="chart2" class="col-md-10 col-lg-10 col-xl-10">
        <div class="row" style="height: 22em;">
            <div id="chart2-graph" style="height: 100%;" class="col-9 p-0"></div>
            <div id="chart2-cost-functions" class="col-3 p-0" style="height: 100%; position: relative; font-size:12pt;">
                <div class="card" style="overflow-x: hidden; text-align: center;">
                    <div class="card-body" style="padding: 0.5rem;">
                        <h5 class="card-title">\(\textrm{R}^2\)</h5>
                        <p class="card-text chart2-mathjax">$${{ r2 }}$$</p>
                    </div>
                </div>
                <div class="card" style="overflow-x: hidden; text-align: center;">
                    <div class="card-body" style="padding: 0.5rem;">
                        <h5 class="card-title">MSE</h5>
                        <p class="card-text chart2-mathjax">$${{ mse }}$$</p>
                    </div>
                </div>
                <div class="card" style="overflow-x: hidden; text-align: center;">
                    <div class="card-body" style="padding: 0.5rem;">
                        <h5 class="card-title">RMSE</h5>
                        <p class="card-text chart2-mathjax">$${{ rmse }}$$</p>
                    </div>
                </div>
                <div class="card" style="overflow-x: hidden; text-align: center;">
                    <div class="card-body" style="padding: 0.5rem;">
                        <h5 class="card-title">MAE</h5>
                        <p class="card-text chart2-mathjax">$${{ mae }}$$</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-4 p-1">
                <div style="text-align: center;">\(\theta_0\)</div>
                <div id="chart2-theta0-container" style="height: 4em;"></div>
            </div>
            <div class="col-12 col-md-4 p-1">
                <div style="text-align: center;">\(\theta_1\)</div>
                <div id="chart2-theta1-container" style="height: 4em;"></div>
            </div>
            <div class="col-12 col-md-4 p-1">
                <div style="text-align: center;">\(\theta_2\)</div>
                <div id="chart2-theta2-container" style="height: 4em;"></div>
            </div>
            <div class="col-12 p-1" style="text-align: center;">
                <button class="chart2-new-data btn btn-primary">New data</button>
                <button class="btn btn-primary" id="chart2-best-fit" style="margin-right: 1em;">Best
                    fit</button>
                <form style="display: inline-block;">
                    <label class="checkbox-inline">
                        <input type="checkbox" id="chart2-residuals-check" value=""> Residuals
                    </label>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import _ from 'lodash';
import hljs from 'highlight.js';
import { latexifyMatrix } from '@/assets/js/helpers.js';
import { mean, matrix, max, abs, multiply, transpose, subtract, square, sqrt, sum, index, round, inv } from 'mathjs';
import { sliderBottom } from 'd3-simple-slider';


export default {
    data() {
        return {
            r2: 0,
            mse: 0,
            rmse: 0,
            mae: 0,
            theta0: 0,
            theta1: 0,
            theta2: 0,
        }
    },
    mounted() {
        this.drawChart2();
    },
    watch: {
        theta0 () {
            this.typesetMathJax();
        },
        theta1 () {
            this.typesetMathJax();
        },
        theta2 () {
            this.typesetMathJax();
        }
    },
    methods: {
        typesetMathJax() {
            const nodes = document.getElementsByClassName("chart2-mathjax");
            MathJax.typesetClear(nodes);
            MathJax.typesetPromise(nodes).then(() => {
                MathJax.typesetPromise(nodes);
            });

        },
        drawChart2() {
            var vm = this;
            d3.select("#chart2-theta0-container").selectAll("svg").remove();
            d3.select("#chart2-theta1-container").selectAll("svg").remove();
            d3.select("#chart2-theta2-container").selectAll("svg").remove();
            d3.json(
                "https://api.philippstuerner.com/linear_models/data/quadratic?return_theta=true&return_test=false&noise=4"
            ).then(function (dataRaw) {
                vm.data = _.sortBy(dataRaw.data, [
                    function (o) {
                        return o.X;
                    },
                ]);
                vm.theta0_best = dataRaw.theta0_best;
                vm.theta1_best = dataRaw.theta1_best;
                vm.theta2_best = dataRaw.theta2_best;
                vm.xExtent = d3.extent(vm.data.map((d) => d.X));
                vm.yExtent = d3.extent(vm.data.map((d) => d.y));
                vm.X = matrix([
                    vm.data.map((d) => d.X_b),
                    vm.data.map((d) => d.X),
                    vm.data.map((d) => d.XX),
                ]);
                vm.y = matrix([vm.data.map((d) => d.y)]);
                vm.yMean = mean(vm.y);

                vm.theta = null;
                vm.theta0 = null;
                vm.theta1 = null;
                vm.theta2 = null;
                vm.yHat = null;
                vm.yHatRange = null;
                vm.residuals = null;
                vm.squaredResiduals = null;
                vm.mse = null;
                vm.rmse = null;
                vm.mae = null;
                vm.r2 = null;
                vm.showResiduals = false;

                // Define margin and size
                let margin = { top: 20, right: 30, bottom: 30, left: 40 },
                    width =
                        d3.select("#chart2-graph").node().getBoundingClientRect().width -
                        margin.left -
                        margin.right,
                    height =
                        d3.select("#chart2-graph").node().getBoundingClientRect().height -
                        margin.top -
                        margin.bottom,
                    marginSliders = { top: 0, right: 50, bottom: 0, left: 50 },
                    widthSliders =
                        d3.select("#chart2-theta0-container").node().getBoundingClientRect()
                            .width -
                        marginSliders.left -
                        marginSliders.right,
                    heightSliders =
                        d3.select("#chart2-theta0-container").node().getBoundingClientRect()
                            .height -
                        marginSliders.top -
                        marginSliders.bottom;

                // Define the scales
                vm.xScale = d3.scaleLinear().range([0, width]);
                vm.yScale = d3.scaleLinear().range([height, 0]);

                // Define sliders
                vm.theta0Slider = sliderBottom()
                    .width(widthSliders)
                    .tickFormat(d3.format(".2"))
                    .ticks(5)
                    .handle(d3.symbol().type(d3.symbolCircle).size(200)())
                    .on("onchange", (val) => {
                        vm.theta._data[0][0] = val;
                        vm.theta0 = val;
                        vm.predict();
                        vm.updateRegression();
                        vm.updateResiduals();
                    });
                vm.theta1Slider = sliderBottom()
                        .width(widthSliders)
                        .tickFormat(d3.format(".2"))
                        .ticks(5)
                        .handle(d3.symbol().type(d3.symbolCircle).size(200)())
                        .on("onchange", (val) => {
                            vm.theta._data[1][0] = val;
                            vm.theta1 = val;
                            vm.predict();
                            vm.updateRegression();
                            vm.updateResiduals();
                        });
                vm.theta2Slider = sliderBottom()
                        .width(widthSliders)
                        .tickFormat(d3.format(".2"))
                        .ticks(5)
                        .handle(d3.symbol().type(d3.symbolCircle).size(200)())
                        .on("onchange", (val) => {
                            vm.theta._data[2][0] = val;
                            vm.theta2 = val;
                            vm.predict();
                            vm.updateRegression();
                            vm.updateResiduals();
                        });

                // Create chart
                let svg = d3
                    .select("#chart2-graph")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Apply clip
                svg.append("clipPath")
                    .attr("id", "chart2-clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                // Create axes
                vm.xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
                vm.yAxis = svg.append("g");

                // Create residuals group
                vm.resids = svg.append("g").attr("class", "residuals-group");

                // Create scatter group
                vm.scatter = svg.append("g").attr("class", "scatter-group");

                // Create regression line group
                vm.regressionLine = svg.append("g").attr("class", "regression-line-group");

                // Create sliders
                vm.svgTheta0Slider = d3
                    .select("#chart2-theta0-container")
                    .append("svg")
                    .attr(
                        "width",
                        widthSliders + marginSliders.left + marginSliders.right
                    )
                    .attr(
                        "height",
                        heightSliders + marginSliders.top + marginSliders.bottom
                    )
                    .append("g")
                    .attr(
                        "transform",
                        `translate(${marginSliders.left},${heightSliders / 2})`
                    );
                vm.svgTheta1Slider = d3
                        .select("#chart2-theta1-container")
                        .append("svg")
                        .attr(
                            "width",
                            widthSliders + marginSliders.left + marginSliders.right
                        )
                        .attr(
                            "height",
                            heightSliders + marginSliders.top + marginSliders.bottom
                        )
                        .append("g")
                        .attr(
                            "transform",
                            `translate(${marginSliders.left},${heightSliders / 2})`
                        );
                    vm.svgTheta2Slider = d3
                        .select("#chart2-theta2-container")
                        .append("svg")
                        .attr(
                            "width",
                            widthSliders + marginSliders.left + marginSliders.right
                        )
                        .attr(
                            "height",
                            heightSliders + marginSliders.top + marginSliders.bottom
                        )
                        .append("g")
                        .attr(
                            "transform",
                            `translate(${marginSliders.left},${heightSliders / 2})`
                        );

                // Update
                vm.updateSliders();
                vm.updateAxis();
                vm.predict();
                vm.updateMathjaxNewData();
                vm.updateResiduals();
                vm.updateScatter();
                vm.updateRegression();

                d3.selectAll(".chart2-new-data").on("click", function () {
                    d3.json(
                        "https://api.philippstuerner.com/linear_models/data/quadratic?return_theta=true&return_test=false&noise=4"
                    ).then(function (dataRaw) {
                        vm.data = _.sortBy(dataRaw.data, [
                            function (o) {
                                return o.X;
                            },
                        ]);
                        vm.theta0_best = dataRaw.theta0_best;
                        vm.theta1_best = dataRaw.theta1_best;
                        vm.theta2_best = dataRaw.theta2_best;
                        vm.xExtent = d3.extent(vm.data.map((d) => d.X));
                        vm.yExtent = d3.extent(vm.data.map((d) => d.y));
                        vm.X = matrix([
                            vm.data.map((d) => d.X_b),
                            vm.data.map((d) => d.X),
                            vm.data.map((d) => d.XX),
                        ]);
                        vm.y = matrix([vm.data.map((d) => d.y)]);
                        vm.yMean = mean(vm.y);

                        vm.updateSliders();
                        vm.updateAxis();
                        vm.predict();
                        vm.updateMathjaxNewData();
                        vm.updateResiduals();
                        vm.updateScatter();
                        vm.updateRegression();
                    });
                });

                d3.select("#chart2-residuals-check").on("click", function () {
                    if (this.checked) {
                        vm.showResiduals = true;
                    } else {
                        vm.showResiduals = false;
                    }

                    vm.updateResiduals();
                });

                d3.select("#chart2-best-fit").on("click", function () {
                    vm.theta0Slider.value(vm.theta0_best);
                    vm.theta1Slider.value(vm.theta1_best);
                    vm.theta2Slider.value(vm.theta2_best);
                });
            });
        },
        predict() {
            var vm = this;
            vm.yHat = multiply(transpose(vm.theta), vm.X);
            vm.residuals = subtract(vm.y.valueOf()[0], vm.yHat.valueOf()[0]);
            vm.squaredResiduals = vm.residuals.map(d=>square(d));
            vm.mse = mean(vm.squaredResiduals).toFixed(2);
            vm.rmse = sqrt(mean(vm.squaredResiduals)).toFixed(2);
            vm.mae = mean(abs(vm.residuals)).toFixed(2);
            vm.r2 =
                (1 -
                sum(vm.squaredResiduals) /
                    sum(subtract(vm.y, vm.yMean).map(d=>square(d)))).toFixed(2);
        },
        updateMathjaxNewData () {
            let X_ = transpose(this.X),
                matX_ = latexifyMatrix(round(X_, 2), 5, 3, 5, false, false),
                y_ = transpose(this.y),
                maty_ = latexifyMatrix(round(y_, 2), 5, 1, 5, false, false),
                XT = transpose(X_),
                matXT = latexifyMatrix(round(XT, 2), 3, 5, false, 5, false),
                XTX = multiply(XT, X_),
                matXTX = latexifyMatrix(
                    round(XTX, 2),
                    3,
                    3,
                    false,
                    false,
                    false
                ),
                XTXinv = inv(XTX),
                matXTXinv = latexifyMatrix(
                    round(XTXinv, 3),
                    3,
                    3,
                    false,
                    false,
                    false
                ),
                XTXinvXTy = multiply(multiply(XTXinv, XT), y_),
                matXTXinvXTy = latexifyMatrix(
                    round(XTXinvXTy, 2),
                    3,
                    1,
                    false,
                    false,
                    false
                );

            const nodes = [
                document.getElementById("chart2-normal-equation"),
            ];
            MathJax.typesetClear(nodes);

            nodes[0].innerHTML = String.raw`
        \begin{split}
        \hat{\theta}  & = (X^{T}X)^{-1}X^{T}y \\
                    & = \left( ${matX_}^{T} ${matX_} \right)^{-1} ${matX_}^{T} ${maty_} \\
                    & = \left( ${matXT} ${matX_} \right)^{-1} ${matX_}^{T} ${maty_} \\
                    & = \left( ${matXTX} \right)^{-1} ${matX_}^{T} ${maty_} \\
                    & = ${matXTXinv} ${matX_}^{T} ${maty_} \\
                    & = ${matXTXinvXTy}
        \end{split}`;
            MathJax.typesetPromise(nodes).then(() => {});

            d3.select("#chart2-normal-equation-code").html(
                _.escape(`>>> import numpy as np
>>> from sklearn.preprocessing import PolynomialFeatures
>>> X=np.array([${[
                ...round(this.X._data[1].slice(0, 5), 2),
                ...["..."],
            ].toString()}])
>>> y=np.array([${[
                ...round(this.y._data[0].slice(0, 5), 2),
                ...["..."],
            ].toString()}])
>>> X_poly = PolynomialFeatures(degree=2, include_bias=False).fit_transform(X.reshape(-1,1))
>>> X_poly_b = np.c_[np.ones((len(X_poly), 1)), X_poly]
>>> theta_hat = np.linalg.inv(X_poly_b.T.dot(X_poly_b)).dot(X_poly_b.T).dot(y)
>>> theta_hat
array([${this.theta0_best.toFixed(2)}, ${this.theta1_best.toFixed(
                2
            )}, ${this.theta2_best.toFixed(2)}])`)
        );
            hljs.highlightElement(d3.select("#chart2-normal-equation-code").node())
        },
        updateResiduals () {
            var vm = this;
            let residualLines = [],
                lineGen = d3
                    .line()
                    .x((d) => vm.xScale(d.x))
                    .y((d) => vm.yScale(d.y));

            if (vm.showResiduals) {
                vm.data.forEach(function (d, i) {
                    residualLines.push({
                        v: [
                            { x: d.X, y: d.y },
                            {
                                x: d.X,
                                y: _.clamp(
                                    vm.yHat.subset(index(0, i)),
                                    vm.yExtent[0],
                                    vm.yExtent[1]
                                ),
                            },
                        ],
                    });
                });

                vm.resids
                    .selectAll(".residual")
                    .data(residualLines)
                    .join(
                        (enter) => {
                            enter
                                .append("path")
                                .attr("class", "residual")
                                .attr("id", (d) => `residual-${d.i}`)
                                .attr("clip-path", "url(#chart2-clip)")
                                .transition()
                                .duration(200)
                                .delay((d, i) => i * 20)
                                .attr("d", (d) => lineGen(d.v))
                                .style("fill", "none")
                                .style("stroke", "red")
                                .style("opacity", 0.8)
                                .style("stroke-width", 30)
                                .style("stroke-dasharray", "5, 5");
                        },
                        (update) => {
                            update
                                .transition()
                                .duration(200)
                                .delay((d, i) => i * 10)
                                .attr("d", (d) => lineGen(d.v));
                        }
                    );
            } else {
                residualLines = [];
                vm.data.forEach(function (d, i) {
                    residualLines.push({
                        v: [
                            { x: d.X, y: d.y },
                            { x: d.X, y: d.y },
                        ],
                    });
                });

                vm.resids
                    .selectAll(".residual")
                    .data([])
                    .exit()
                    .transition()
                    .duration(200)
                    .delay((d, i) => i * 20)
                    .attr("d", (d) => lineGen(d.v))
                    .style("opacity", 0)
                    .remove();
            }
        },
        updateRegression () {
            var vm = this;
            // Function to adjust the regression line according to new data and theta values
            let lineData = [
                    {
                        v: vm.yHat.valueOf()[0].map(function (d, i) {
                            return {
                                x: vm.X.subset(index(1, i)),
                                y: _.clamp(
                                    d,
                                    vm.yExtent[0] - abs(vm.yExtent[0] * 0.5),
                                    vm.yExtent[1] + abs(vm.yExtent[0] * 0.5)
                                ),
                            };
                        }),
                    },
                ],
                lineGen = d3
                    .line()
                    .x((d) => vm.xScale(d.x))
                    .y((d) => vm.yScale(d.y));

            // Update regression
            vm.regressionLine
                .selectAll(".line")
                .data(lineData)
                .join(
                    (enter) => {
                        enter
                            .append("path")
                            .attr("class", "line")
                            .attr("clip-path", "url(#chart2-clip)")
                            .transition()
                            .duration(100)
                            .attr("d", (d) => lineGen(d.v))
                            .style("fill", "none")
                            .style("stroke", "black");
                    },
                    (update) => {
                        update
                            .attr("clip-path", "url(#chart2-clip)")
                            .transition()
                            .duration(100)
                            .attr("d", (d) => lineGen(d.v));
                    }
                );
        },
        updateSliders () {
            var vm = this;
            // Function to adjust slider values according to new data
            let theta1_value = Number(
                    (
                        max(...vm.yExtent.map((d) => abs(d))) /
                        max(...vm.xExtent.map((d) => abs(d)))
                    ).toFixed(1)
                ),
                theta0Range = [
                    Number(vm.yExtent[0].toFixed(1)),
                    Number(vm.yExtent[1].toFixed(1)),
                ],
                theta1Range = [-2 * theta1_value, 2 * theta1_value],
                theta2Range = [-5, 5],
                theta0 = vm.arrAvg(theta0Range).toFixed(1),
                theta1 = vm.arrAvg(theta1Range).toFixed(1),
                theta2 = 0;

            vm.theta = matrix([[theta0], [theta1], [theta2]]);

            vm.svgTheta0Slider
                .transition()
                .duration(500)
                .call(
                    vm.theta0Slider
                        .min(d3.min(theta0Range))
                        .max(d3.max(theta0Range))
                        .value(theta0)
                )
                .attr("id", "chart2-theta0-slider");

            vm.svgTheta1Slider
                .transition()
                .duration(500)
                .call(
                    vm.theta1Slider
                        .min(d3.min(theta1Range))
                        .max(d3.max(theta1Range))
                        .value(theta1)
                )
                .attr("id", "chart2-theta1-slider");

            vm.svgTheta2Slider
                .transition()
                .duration(500)
                .call(
                    vm.theta2Slider
                        .min(d3.min(theta2Range))
                        .max(d3.max(theta2Range))
                        .value(theta2)
                )
                .attr("id", "chart2-theta2-slider");
        },
        updateAxis () {
            var vm = this;
            // Function to adjust the axis according to new data
            vm.xScale.domain(d3.extent(vm.data, (d) => d.X));
            vm.xAxis.transition().duration(500).call(d3.axisBottom(vm.xScale));
            vm.yScale.domain(d3.extent(vm.data, (d) => d.y));
            vm.yAxis.transition().duration(500).call(d3.axisLeft(vm.yScale));
        },
        updateScatter () {
            var vm = this;
            // Function to adjust the scatter according to new data
            vm.scatter
                .selectAll(".scatter")
                .data(vm.data)
                .join(
                    (enter) => {
                        enter
                            .append("circle")
                            .attr("class", "scatter")
                            .attr("id", (d) => `scatter-${d.i}`)
                            .attr("cy", (d) => vm.yScale(d.y))
                            .attr("r", 5)
                            .style("fill", "dodgerblue")
                            .transition()
                            .duration(500)
                            .attr("cx", (d) => vm.xScale(d.X));
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(500)
                            .delay((d, i) => i * 10)
                            .attr("cx", (d) => vm.xScale(d.X))
                            .attr("cy", (d) => vm.yScale(d.y))
                            .attr("r", 5);
                    },
                    (exit) => {
                        exit.remove();
                    }
                );
        },
        arrAvg(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        }
    },
}
</script>