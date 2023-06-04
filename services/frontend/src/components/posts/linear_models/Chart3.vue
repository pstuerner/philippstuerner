<template>
    <div id="chart3" class="col-md-12 col-lg-12 col-xl-12" style="overflow-x: hidden;">
        <div class="row pb-3">
            <div style="position: relative; text-align: center;" class="col-1 p-0">
                <div style="position: absolute; bottom: 0; width: 100%;">
                    <b>Degree</b>
                </div>
            </div>
            <div style="position: relative; text-align: center;" class="col-1 p-0">
                <div style="position: absolute; bottom: 0; width: 100%;">
                    <b>Noise</b>
                </div>
            </div>
            <div style="position: relative; text-align: center;" class="col-5 p-0">
                <table style="width: 80%; margin-left: auto; margin-right: auto;">
                    <thead>
                        <tr>
                            <th colspan="4"><b>Train</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>$$\textrm{MAE}$$</td>
                            <td>$$\textrm{MSE}$$</td>
                            <td>$$\textrm{RMSE}$$</td>
                            <td>$$\textrm{R}^2$$</td>
                        </tr>
                        <tr>
                            <td class="chart3-mathjax">\({{ maeTrain }}\)</td>
                            <td class="chart3-mathjax">\({{ mseTrain }}\)</td>
                            <td class="chart3-mathjax">\({{ rmseTrain }}\)</td>
                            <td class="chart3-mathjax">\({{ r2Train }}\)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="position: relative; text-align: center;" class="col-5 p-0">
                <table style="width: 80%; margin-left: auto; margin-right: auto;">
                    <thead>
                        <tr>
                            <th colspan="4"><b>Test</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>$$\textrm{MAE}$$</td>
                            <td>$$\textrm{MSE}$$</td>
                            <td>$$\textrm{RMSE}$$</td>
                            <td>$$\textrm{R}^2$$</td>
                        </tr>
                        <tr>
                            <td class="chart3-mathjax">\({{ maeTest }}\)</td>
                            <td class="chart3-mathjax">\({{ mseTest }}\)</td>
                            <td class="chart3-mathjax">\({{ rmseTest }}\)</td>
                            <td class="chart3-mathjax">\({{ r2Test }}\)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div id="chart3-degree-container" style="height: 22em; position: relative;" class="col-1 p-0"></div>
            <div id="chart3-noise-container" style="height: 22em; position: relative;" class="col-1 p-0"></div>
            <div id="chart3-train-scatter" style="height: 22em; position: relative;" class="col-5 p-0"></div>
            <div id="chart3-test-scatter" style="height: 22em; position: relative;" class="col-5 p-0"></div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import _ from 'lodash';
import { mean, matrix, abs, multiply, transpose, subtract, square, sqrt, sum, index } from 'mathjs';
import { sliderLeft } from 'd3-simple-slider';


export default {
    data() {
        return {
            r2Train: 0,
            r2Test: 0,
            mseTrain: 0,
            mseTest: 0,
            rmseTrain: 0,
            rmseTest: 0,
            maeTrain: 0,
            maeTest: 0,
            degree: 0,
            noise: 0,
        }
    },
    mounted() {
        this.drawChart3();
    },
    watch: {
        r2Train() {
            this.typesetMathJax();
        }
    },
    methods: {
        typesetMathJax() {
            const nodes = document.getElementsByClassName("chart3-mathjax");
            MathJax.typesetClear(nodes);
            MathJax.typesetPromise(nodes).then(() => {
                MathJax.typesetPromise(nodes);
            });

        },
        drawChart3() {
            var vm = this;
            d3.select("#chart3-degree-container").selectAll("svg").remove();
            d3.select("#chart3-noise-container").selectAll("svg").remove();
            d3.select("#chart3-train-scatter").selectAll("svg").remove();
            d3.select("#chart3-test-scatter").selectAll("svg").remove();
            d3.json(
                "https://api.philippstuerner.com/linear_models/data/poly_data?degrees=20&noise=5"
            ).then(function (dataRaw) {
                vm.dataRaw = dataRaw;
                vm.dataTrain = null;
                vm.dataTest = null;
                vm.xExtentTrain = null;
                vm.yExtentTrain = null;
                vm.xExtentTest = null;
                vm.yExtentTest = null;
                vm.xTrain = null;
                vm.yTrain = null;
                vm.yTrainMean = null;
                vm.xTest = null;
                vm.yTest = null;
                vm.yTestMean = null;
                vm.thetas = null;
                vm.yHatTrain = null;
                vm.residualsTrain = null;
                vm.squaredResidualsTrain = null;
                vm.mseTrain = null;
                vm.rmseTrain = null;
                vm.maeTrain = null;
                vm.r2Train = null;
                vm.yHatTest = null;
                vm.residualsTest = null;
                vm.squaredResidualsTest = null;
                vm.mseTest = null;
                vm.rmseTest = null;
                vm.maeTest = null;
                vm.r2Test = null;
                vm.theta = null;
                vm.noiseChangeAllow = false;

                vm.dataInit(vm.dataRaw);

                // Define margin and size
                let margin = { top: 20, right: 30, bottom: 30, left: 40 },
                    width =
                        d3.select("#chart3-train-scatter").node().getBoundingClientRect()
                            .width -
                        margin.left -
                        margin.right,
                    height =
                        d3.select("#chart3-train-scatter").node().getBoundingClientRect()
                            .height -
                        margin.top -
                        margin.bottom,
                    marginSliders = { top: 50, right: 0, bottom: 50, left: 0 },
                    widthSliders =
                        d3.select("#chart3-degree-container").node().getBoundingClientRect()
                            .width -
                        marginSliders.left -
                        marginSliders.right,
                    heightSliders =
                        d3.select("#chart3-degree-container").node().getBoundingClientRect()
                            .height -
                        marginSliders.top -
                        marginSliders.bottom;

                // Define slider
                vm.degreeSlider = sliderLeft()
                    .height(heightSliders)
                    .tickFormat(d3.format(".2"))
                    .ticks(5)
                    .step(1)
                    .handle(d3.symbol().type(d3.symbolCircle).size(200)())
                    .on("onchange.slider", (val) => {
                        vm.predict();
                        vm.updateRegression();
                    });
                vm.noiseSlider = sliderLeft()
                    .height(heightSliders)
                    .tickFormat(d3.format(".2"))
                    .ticks(5)
                    .step(1)
                    .handle(d3.symbol().type(d3.symbolCircle).size(200)())
                    .on("end.slider", (val) => {
                        d3.json(
                            `https://api.philippstuerner.com/linear_models/data/poly_data?degrees=20&noise=${+val}`
                        ).then(function (dataUpdate) {
                            vm.dataRaw = dataUpdate;
                            vm.dataInit();
                            vm.predict();
                            vm.updateAxes();
                            vm.updateScatter();
                            vm.updateRegression();
                        });
                    })
                    .on("onchange.slider", (val) => {
                        if (vm.noiseChangeAllow) {
                            d3.json(
                                `https://api.philippstuerner.com/linear_models/data/poly_data?degrees=20&noise=${+val}`
                            ).then(function (dataUpdate) {
                                vm.dataRaw = dataUpdate;
                                vm.dataInit();
                                vm.predict();
                                vm.updateAxes();
                                vm.updateScatter();
                                vm.updateRegression();
                            });
                        }
                        vm.noiseChangeAllow = false;
                    });

                // Create charts
                vm.svgTrain = d3
                    .select("#chart3-train-scatter")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr(
                        "transform",
                        "translate(" + margin.left + "," + margin.top + ")"
                    );
                vm.svgTest = d3
                    .select("#chart3-test-scatter")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr(
                        "transform",
                        "translate(" + margin.left + "," + margin.top + ")"
                    );

                // Apply clip
                vm.svgTrain
                    .append("clipPath")
                    .attr("id", "chart3-train-clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);
                vm.svgTest
                    .append("clipPath")
                    .attr("id", "chart3-test-clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                // Define the scales
                vm.xScaleTrain = d3.scaleLinear().range([0, width]);
                vm.yScaleTrain = d3.scaleLinear().range([height, 0]);
                vm.xScaleTest = d3.scaleLinear().range([0, width]);
                vm.yScaleTest = d3.scaleLinear().range([height, 0]);

                // Create axes
                vm.xAxisTrain = vm.svgTrain
                    .append("g")
                    .attr("transform", `translate(0,${height})`);
                vm.yAxisTrain = vm.svgTrain.append("g");
                vm.xAxisTest = vm.svgTest
                    .append("g")
                    .attr("transform", `translate(0,${height})`);
                vm.yAxisTest = vm.svgTest.append("g");

                // Create scatter group
                vm.scatterTrain = vm.svgTrain
                    .append("g")
                    .attr("class", "scatter-train-group");
                vm.scatterTest = vm.svgTest.append("g").attr("class", "scatter-test-group");

                // Create regression line group
                vm.regressionLineTrain = vm.svgTrain
                    .append("g")
                    .attr("class", "regression-line-train-group");
                vm.regressionLineTest = vm.svgTest
                    .append("g")
                    .attr("class", "regression-line-test-group");

                // Create sliders
                vm.svgDegreeSlider = d3
                    .select("#chart3-degree-container")
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
                        `translate(${widthSliders / 2},${marginSliders.top})`
                    );
                vm.svgNoiseSlider = d3
                    .select("#chart3-noise-container")
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
                        `translate(${widthSliders / 2},${marginSliders.top})`
                    );

                vm.svgDegreeSlider
                    .transition()
                    .duration(500)
                    .call(vm.degreeSlider.min(1).max(20).value(1))
                    .attr("id", "chart3-degree-slider");

                vm.svgNoiseSlider
                    .transition()
                    .duration(500)
                    .call(vm.noiseSlider.min(0).max(20).value(4))
                    .attr("id", "chart3-noise-slider");

                // Update
                vm.predict();
                vm.updateAxes();
                vm.updateScatter();
                vm.updateRegression();

                d3.selectAll(".chart3-options").on("click", function () {
                    let degree = +d3.select(this).property("id").split("-").slice(-3, -2),
                        noise = +d3.select(this).property("id").split("-").slice(-1);
                    vm.noiseChangeAllow = true;
                    setTimeout((d) => {
                        vm.degreeSlider.value(degree);
                        vm.noiseSlider.value(noise);
                        vm.degree = degree;
                        vm.noise = noise;
                    }, 1000);
                })
            })
        },
        dataInit() {
            var vm = this;
            vm.dataTrain = _.sortBy(vm.dataRaw.data_train, [
                function (o) {
                    return o.X;
                },
            ]);
            vm.dataTest = _.sortBy(vm.dataRaw.data_test, [
                function (o) {
                    return o.X;
                },
            ]);
            vm.xExtentTrain = d3.extent(vm.dataTrain.map((d) => d.X));
            vm.yExtentTrain = d3.extent(vm.dataTrain.map((d) => d.y));
            vm.xExtentTest = d3.extent(vm.dataTest.map((d) => d.X));
            vm.yExtentTest = d3.extent(vm.dataTest.map((d) => d.y));
            vm.xTrain = matrix([
                vm.dataTrain.map((d) => 1),
                vm.dataTrain.map((d) => d.X),
            ]);
            vm.yTrain = matrix(vm.dataTrain.map((d) => [+d.y]));
            vm.yTrainMean = mean(vm.yTrain);
            vm.xTest = matrix([vm.dataTest.map((d) => 1), vm.dataTest.map((d) => d.X)]);
            vm.yTest = matrix(vm.dataTest.map((d) => [+d.y]));
            vm.yTestMean = mean(vm.yTest);
            vm.thetas = vm.dataRaw.polynomials.map((d) => d.theta);
        },
        predict() {
            var vm = this;
            let degreeIndex = +vm.degreeSlider.value() - 1,
                xPolyTrain = matrix(
                    vm.dataRaw.polynomials[degreeIndex].X_poly_train
                ),
                xPolyTest = matrix(
                    vm.dataRaw.polynomials[degreeIndex].X_poly_test
                );

            vm.theta = transpose(matrix([vm.thetas[degreeIndex]]));

            // Train
            vm.yHatTrain = multiply(xPolyTrain, vm.theta);
            vm.residualsTrain = subtract(vm.yTrain, vm.yHatTrain);
            vm.squaredResidualsTrain = vm.residualsTrain.map(d => square(d));
            vm.mseTrain = mean(vm.squaredResidualsTrain).toFixed(2);
            vm.rmseTrain = sqrt(mean(vm.squaredResidualsTrain)).toFixed(2);
            vm.maeTrain = mean(abs(vm.residualsTrain)).toFixed(2);
            vm.r2Train =
                (1 -
                    sum(vm.squaredResidualsTrain) /
                    sum(subtract(vm.yTrain, vm.yTrainMean).map(d => square(d)))).toFixed(2);

            // Test
            vm.yHatTest = multiply(xPolyTest, vm.theta);
            vm.residualsTest = subtract(vm.yTest, vm.yHatTest);
            vm.squaredResidualsTest = vm.residualsTest.map(d => square(d));
            vm.mseTest = mean(vm.squaredResidualsTest).toFixed(2);
            vm.rmseTest = sqrt(mean(vm.squaredResidualsTest)).toFixed(2);
            vm.maeTest = mean(abs(vm.residualsTest)).toFixed(2);
            vm.r2Test =
                (1 -
                    sum(vm.squaredResidualsTest) /
                    sum(subtract(vm.yTest, vm.yTestMean).map(d => square(d)))).toFixed(2);
        },
        updateRegression() {
            var vm = this;
            // Function to adjust the regression line according to new data and theta values
            let lineDataTrain = [
                {
                    v: vm.yHatTrain.valueOf().map(function (d, i) {
                        return {
                            x: vm.xTrain.subset(index(1, i)),
                            y: _.clamp(
                                d,
                                vm.yExtentTrain[0] -
                                abs(vm.yExtentTrain[0] * 0.5),
                                vm.yExtentTrain[1] +
                                abs(vm.yExtentTrain[0] * 0.5)
                            ),
                        };
                    }),
                },
            ],
                lineDataTest = [
                    {
                        v: vm.yHatTest.valueOf().map(function (d, i) {
                            return {
                                x: vm.xTest.subset(index(1, i)),
                                y: _.clamp(
                                    d,
                                    vm.yExtentTest[0] - abs(vm.yExtentTest[0] * 0.5),
                                    vm.yExtentTest[1] + abs(vm.yExtentTest[0] * 0.5)
                                ),
                            };
                        }),
                    },
                ],
                lineGenTrain = d3
                    .line()
                    .x((d) => vm.xScaleTrain(d.x))
                    .y((d) => vm.yScaleTrain(d.y)),
                lineGenTest = d3
                    .line()
                    .x((d) => vm.xScaleTest(d.x))
                    .y((d) => vm.yScaleTest(d.y));

            // Update regression
            vm.regressionLineTrain
                .selectAll(".line-train")
                .data(lineDataTrain)
                .join(
                    (enter) => {
                        enter
                            .append("path")
                            .attr("class", "line-train")
                            .attr("clip-path", "url(#chart3-train-clip)")
                            .transition()
                            .duration(100)
                            .attr("d", (d) => lineGenTrain(d.v))
                            .style("fill", "none")
                            .style("stroke", "black");
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(100)
                            .attr("d", (d) => lineGenTrain(d.v));
                    }
                );

            vm.regressionLineTest
                .selectAll(".line-test")
                .data(lineDataTest)
                .join(
                    (enter) => {
                        enter
                            .append("path")
                            .attr("class", "line-test")
                            .attr("clip-path", "url(#chart3-test-clip)")
                            .transition()
                            .duration(100)
                            .attr("d", (d) => lineGenTest(d.v))
                            .style("fill", "none")
                            .style("stroke", "black");
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(100)
                            .attr("d", (d) => lineGenTest(d.v));
                    }
                );
        },
        updateScatter() {
            var vm = this;
            vm.scatterTrain
                .selectAll(".scatter-train")
                .data(vm.dataTrain)
                .join(
                    (enter) => {
                        enter
                            .append("circle")
                            .attr("class", "scatter-train")
                            .attr("id", (d) => `scatter-train-${d.i}`)
                            .attr("cy", (d) => vm.yScaleTrain(d.y))
                            .attr("r", 5)
                            .style("fill", "dodgerblue")
                            .transition()
                            .duration(500)
                            .attr("cx", (d) => vm.xScaleTrain(d.X));
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(500)
                            .delay((d, i) => i * 10)
                            .attr("cx", (d) => vm.xScaleTrain(d.X))
                            .attr("cy", (d) => vm.yScaleTrain(d.y))
                            .attr("r", 5);
                    },
                    (exit) => {
                        exit.remove();
                    }
                );

            vm.scatterTest
                .selectAll(".scatter-test")
                .data(vm.dataTest)
                .join(
                    (enter) => {
                        enter
                            .append("circle")
                            .attr("class", "scatter-test")
                            .attr("id", (d) => `scatter-test-${d.i}`)
                            .attr("cy", (d) => vm.yScaleTest(d.y))
                            .attr("r", 5)
                            .style("fill", "dodgerblue")
                            .transition()
                            .duration(500)
                            .attr("cx", (d) => vm.xScaleTest(d.X));
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(500)
                            .delay((d, i) => i * 10)
                            .attr("cx", (d) => vm.xScaleTest(d.X))
                            .attr("cy", (d) => vm.yScaleTest(d.y))
                            .attr("r", 5);
                    },
                    (exit) => {
                        exit.remove();
                    }
                );
        },
        updateAxes() {
            var vm = this;
            vm.xScaleTrain.domain(d3.extent(vm.dataTrain.map((d) => d.X)));
            vm.yScaleTrain.domain(d3.extent(vm.dataTrain.map((d) => d.y)));
            vm.xScaleTest.domain(d3.extent(vm.dataTest.map((d) => d.X)));
            vm.yScaleTest.domain(d3.extent(vm.dataTest.map((d) => d.y)));

            vm.xAxisTrain.transition().duration(500).call(d3.axisBottom(vm.xScaleTrain));
            vm.yAxisTrain.transition().duration(500).call(d3.axisLeft(vm.yScaleTrain));
            vm.xAxisTest.transition().duration(500).call(d3.axisBottom(vm.xScaleTest));
            vm.yAxisTest.transition().duration(500).call(d3.axisLeft(vm.yScaleTest));
        }
    },
}
</script>