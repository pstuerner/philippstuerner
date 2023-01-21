import { responsivefy, arrAvg, latexifyMatrix } from "../../helpers.js";

/**
 * @name chart1
 * @description Main function that creates the visualization.
 * @param {Object} dataRaw
 */
function chart1(dataRaw) {
    /**
     * @name predict
     * @description Function that makes a prediction and set loss values.
     */
    function predict() {
        yHat = math.multiply(math.transpose(theta), X);
        residuals = math.subtract(y.valueOf()[0], yHat.valueOf()[0]);
        squaredResiduals = math.square(residuals);
        mse = math.mean(squaredResiduals);
        rmse = math.sqrt(math.mean(squaredResiduals));
        mae = math.mean(math.abs(residuals));
        r2 =
            1 -
            math.sum(squaredResiduals) /
                math.sum(math.square(math.subtract(y, yMean)));
    }

    /**
     * @name updateMathjax
     * @description Function that updates the dynamic MathJax values.
     */
    function updateMathjax() {
        const nodes = [
            document.getElementById("chart1-mse"),
            document.getElementById("chart1-rmse"),
            document.getElementById("chart1-mae"),
            document.getElementById("chart1-r2"),
        ];
        MathJax.typesetClear(nodes);
        nodes[0].innerHTML = String.raw`$$ ${mse.toFixed(2)} $$`;
        nodes[1].innerHTML = String.raw`$$ ${rmse.toFixed(2)} $$`;
        nodes[2].innerHTML = String.raw`$$ ${mae.toFixed(2)} $$`;
        nodes[3].innerHTML = String.raw`$$ ${r2.toFixed(2)} $$`;
        MathJax.typesetPromise(nodes).then(() => {});
    }

    /**
     * @name updateMathjaxNewData
     * @description Function that updates MathJax content based on new data.
     */
    function updateMathjaxNewData() {
        let X_ = math.transpose(X),
            matX_ = latexifyMatrix(math.round(X_, 2), 5, 2, 5, false, false),
            y_ = math.transpose(y),
            maty_ = latexifyMatrix(math.round(y_, 2), 5, 1, 5, false, false),
            XT = math.transpose(X_),
            matXT = latexifyMatrix(math.round(XT, 2), 2, 5, false, 5, false),
            XTX = math.multiply(XT, X_),
            matXTX = latexifyMatrix(
                math.round(XTX, 2),
                2,
                2,
                false,
                false,
                false
            ),
            XTXinv = math.inv(XTX),
            matXTXinv = latexifyMatrix(
                math.round(XTXinv, 2),
                2,
                2,
                false,
                false,
                false
            ),
            XTXinvXTy = math.multiply(math.multiply(XTXinv, XT), y_),
            matXTXinvXTy = latexifyMatrix(
                math.round(XTXinvXTy, 2),
                2,
                1,
                false,
                false,
                false
            );

        const nodes = [
            document.getElementById("chart1-theta0"),
            document.getElementById("chart1-theta1"),
            document.getElementById("normal-equation"),
        ];
        MathJax.typesetClear(nodes);

        nodes[0].innerHTML = String.raw`\(\theta_0=${theta0_best.toFixed(2)}\)`;
        nodes[1].innerHTML = String.raw`\(\theta_1=${theta1_best.toFixed(2)}\)`;
        nodes[2].innerHTML = String.raw`
    \begin{split}
    \hat{\theta}  & = (X^{T}X)^{-1}X^{T}y \\
                  & = \left( ${matX_}^{T} ${matX_} \right)^{-1} ${matX_}^{T} ${maty_} \\
                  & = \left( ${matXT} ${matX_} \right)^{-1} ${matX_}^{T} ${maty_} \\
                  & = \left( ${matXTX} \right)^{-1} ${matX_}^{T} ${maty_} \\
                  & = ${matXTXinv} ${matX_}^{T} ${maty_} \\
                  & = ${matXTXinvXTy}
    \end{split}`;
        MathJax.typesetPromise(nodes).then(() => {});

        d3.select("#normal-equation-code").text(
            `>>> import numpy as np
>>> X=[${[...math.round(X._data[1].slice(0, 5), 2), ...["..."]].toString()}]
>>> y=[${[...math.round(y._data[0].slice(0, 5), 2), ...["..."]].toString()}]
>>> X_b = np.c_[np.ones((len(X), 1)), X]
>>> theta_hat = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)
>>> theta_hat
array([${theta0_best.toFixed(2)}, ${[theta1_best.toFixed(2)]}])`
        );

        hljs.highlightAll();
    }

    /**
     * @name updateResiduals
     * @description Function that updates the scatter plots residuals.
     */
    function updateResiduals() {
        let residualLines = [],
            lineGen = d3
                .line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.y));

        if (showResiduals) {
            data.forEach(function (d, i) {
                residualLines.push({
                    v: [
                        { x: d.X, y: d.y },
                        {
                            x: d.X,
                            y: _.clamp(
                                yHat.subset(math.index(0, i)),
                                yExtent[0],
                                yExtent[1]
                            ),
                        },
                    ],
                });
            });

            resids
                .selectAll(".residual")
                .data(residualLines)
                .join(
                    (enter) => {
                        enter
                            .append("path")
                            .attr("class", "residual")
                            .attr("id", (d) => `residual-${d.i}`)
                            .attr("clip-path", "url(#chart1-clip)")
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
                            .duration(500)
                            .delay((d, i) => i * 10)
                            .attr("d", (d) => lineGen(d.v));
                    }
                );
        } else {
            residualLines = [];
            data.forEach(function (d, i) {
                residualLines.push({
                    v: [
                        { x: d.X, y: d.y },
                        { x: d.X, y: d.y },
                    ],
                });
            });

            resids
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
    }

    /**
     * @name updateRegression
     * @description Function that updates the charts regression line.
     */
    function updateRegression() {
        let lineData = [
                {
                    v: yHat.valueOf()[0].map(function (d, i) {
                        return {
                            x: X.subset(math.index(1, i)),
                            y: _.clamp(
                                d,
                                yExtent[0] - math.abs(yExtent[0] * 0.1),
                                yExtent[1] + math.abs(yExtent[0] * 0.1)
                            ),
                        };
                    }),
                },
            ],
            lineGen = d3
                .line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.y));

        // Update regression
        regressionLine
            .selectAll(".line")
            .data(lineData)
            .join(
                (enter) => {
                    enter
                        .append("path")
                        .attr("class", "line")
                        .attr("clip-path", "url(#chart1-clip)")
                        .transition()
                        .duration(100)
                        .attr("d", (d) => lineGen(d.v))
                        .style("fill", "none")
                        .style("stroke", "black");
                },
                (update) => {
                    update
                        .attr("clip-path", "url(#chart1-clip)")
                        .transition()
                        .duration(100)
                        .attr("d", (d) => lineGen(d.v));
                }
            );
    }

    /**
     * @name updateSliders
     * @description Function that updates the sliders based on new data.
     */
    function updateSliders() {
        // Function to adjust slider values according to new data
        let theta1_value = Number(
                (
                    Math.max(...yExtent.map((d) => Math.abs(d))) /
                    Math.max(...xExtent.map((d) => Math.abs(d)))
                ).toFixed(1)
            ),
            theta0Range = [
                Number(yExtent[0].toFixed(1)),
                Number(yExtent[1].toFixed(1)),
            ],
            theta1Range = [-2 * theta1_value, 2 * theta1_value],
            theta0 = arrAvg(theta0Range).toFixed(1),
            theta1 = arrAvg(theta1Range).toFixed(1);

        theta = math.matrix([[theta0], [theta1]]);

        svgTheta0Slider
            .transition()
            .duration(500)
            .call(
                theta0Slider
                    .min(d3.min(theta0Range))
                    .max(d3.max(theta0Range))
                    .value(theta0)
            )
            .attr("id", "chart1-theta0-slider");

        svgTheta1Slider
            .transition()
            .duration(500)
            .call(
                theta1Slider
                    .min(d3.min(theta1Range))
                    .max(d3.max(theta1Range))
                    .value(theta1)
            )
            .attr("id", "chart1-theta1-slider");
    }

    /**
     * @name updateAxis
     * @description Function that updates the axis based on new data.
     */
    function updateAxis() {
        // Function to adjust the axis according to new data
        xScale.domain(d3.extent(data, (d) => d.X));
        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
        yScale.domain(d3.extent(data, (d) => d.y));
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));
    }

    /**
     * @name updateScatter
     * @description Function that updates the scatter chart based on new data.
     */
    function updateScatter() {
        // Function to adjust the scatter according to new data
        scatter
            .selectAll(".scatter")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("circle")
                        .attr("class", "scatter")
                        .attr("id", (d) => `scatter-${d.i}`)
                        .attr("cy", (d) => yScale(d.y))
                        .attr("r", 5)
                        .style("fill", "dodgerblue")
                        .transition()
                        .duration(500)
                        .attr("cx", (d) => xScale(d.X));
                },
                (update) => {
                    update
                        .transition()
                        .duration(500)
                        .delay((d, i) => i * 10)
                        .attr("cx", (d) => xScale(d.X))
                        .attr("cy", (d) => yScale(d.y))
                        .attr("r", 5);
                },
                (exit) => {
                    exit.remove();
                }
            );
    }

    // Prepare data
    let data = _.sortBy(dataRaw.data, [
            function (o) {
                return o.X;
            },
        ]),
        theta0_best = dataRaw.theta0_best,
        theta1_best = dataRaw.theta1_best,
        xExtent = d3.extent(data.map((d) => d.X)),
        yExtent = d3.extent(data.map((d) => d.y)),
        X = math.matrix([data.map((d) => d.X_b), data.map((d) => d.X)]),
        y = math.matrix([data.map((d) => d.y)]),
        yMean = math.mean(y);

    let theta,
        yHat,
        residuals,
        squaredResiduals,
        mse,
        rmse,
        mae,
        r2,
        showResiduals = false;

    // Define margin and size
    let margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width =
            d3.select("#chart1-graph").node().getBoundingClientRect().width -
            margin.left -
            margin.right,
        height =
            d3.select("#chart1-graph").node().getBoundingClientRect().height -
            margin.top -
            margin.bottom,
        marginSliders = { top: 0, right: 50, bottom: 0, left: 50 },
        widthSliders =
            d3.select("#chart1-theta0-container").node().getBoundingClientRect()
                .width -
            marginSliders.left -
            marginSliders.right,
        heightSliders =
            d3.select("#chart1-theta0-container").node().getBoundingClientRect()
                .height -
            marginSliders.top -
            marginSliders.bottom;

    // Define the scales
    let xScale = d3.scaleLinear().range([0, width]),
        yScale = d3.scaleLinear().range([height, 0]);

    // Define sliders
    let theta0Slider = d3
            .sliderBottom()
            .width(widthSliders)
            .tickFormat(d3.format(".2"))
            .ticks(5)
            .handle(d3.symbol().type(d3.symbolCircle).size(200)())
            .on("onchange", (val) => {
                theta._data[0][0] = val;
                predict();
                updateMathjax();
                updateRegression();
                updateResiduals();
            }),
        theta1Slider = d3
            .sliderBottom()
            .width(widthSliders)
            .tickFormat(d3.format(".2"))
            .ticks(5)
            .handle(d3.symbol().type(d3.symbolCircle).size(200)())
            .on("onchange", (val) => {
                theta._data[1][0] = val;
                predict();
                updateMathjax();
                updateRegression();
                updateResiduals();
            });

    // Create chart
    let svg = d3
        .select("#chart1-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Apply clip
    svg.append("clipPath")
        .attr("id", "chart1-clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    // Create axes
    let xAxis = svg.append("g").attr("transform", `translate(0,${height})`),
        yAxis = svg.append("g");

    // Create residuals group
    let resids = svg.append("g").attr("class", "residuals-group");

    // Create scatter group
    let scatter = svg.append("g").attr("class", "scatter-group");

    // Create regression line group
    let regressionLine = svg.append("g").attr("class", "regression-line-group");

    // Create sliders
    let svgTheta0Slider = d3
            .select("#chart1-theta0-container")
            .append("svg")
            .attr(
                "width",
                widthSliders + marginSliders.left + marginSliders.right
            )
            .attr(
                "height",
                heightSliders + marginSliders.top + marginSliders.bottom
            )
            .call(responsivefy)
            .append("g")
            .attr(
                "transform",
                `translate(${marginSliders.left},${heightSliders / 2})`
            ),
        svgTheta1Slider = d3
            .select("#chart1-theta1-container")
            .append("svg")
            .attr(
                "width",
                widthSliders + marginSliders.left + marginSliders.right
            )
            .attr(
                "height",
                heightSliders + marginSliders.top + marginSliders.bottom
            )
            .call(responsivefy)
            .append("g")
            .attr(
                "transform",
                `translate(${marginSliders.left},${heightSliders / 2})`
            );

    // Update
    updateSliders();
    updateAxis();
    predict();
    updateMathjax();
    updateMathjaxNewData();
    updateResiduals();
    updateScatter();
    updateRegression();

    d3.selectAll(".chart1-new-data").on("click", function () {
        d3.json(
            "https://api.philippstuerner.com/data/linear?return_theta=true"
        ).then(function (dataRaw) {
            data = _.sortBy(dataRaw.data, [
                function (o) {
                    return o.X;
                },
            ]);
            theta0_best = dataRaw.theta0_best;
            theta1_best = dataRaw.theta1_best;
            xExtent = d3.extent(data.map((d) => d.X));
            yExtent = d3.extent(data.map((d) => d.y));
            X = math.matrix([data.map((d) => d.X_b), data.map((d) => d.X)]);
            y = math.matrix([data.map((d) => d.y)]);
            yMean = math.mean(y);

            updateSliders();
            updateAxis();
            predict();
            updateMathjax();
            updateMathjaxNewData();
            updateResiduals();
            updateScatter();
            updateRegression();
        });
    });

    d3.select("#chart1-residuals-check").on("click", function () {
        if (this.checked) {
            showResiduals = true;
        } else {
            showResiduals = false;
        }

        updateResiduals();
    });

    d3.select("#chart1-best-fit").on("click", function () {
        theta0Slider.value(theta0_best);
        theta1Slider.value(theta1_best);
    });
}

d3.json("https://api.philippstuerner.com/linear_models/data/linear?return_theta=true").then(
    function (dataRaw) {
        chart1(dataRaw);
    }
);
