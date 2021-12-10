import { responsivefy } from "../../helpers.js";

/**
 * @name setTheta
 * @description Helper function that sets theta.
 * @param {Number} theta0
 * @param {Number} theta1
 */
function setTheta(theta0, theta1) {
    return math.matrix([[theta0], [theta1]]);
}

/**
 * @name sigmoid
 * @description Logistics function.
 * @param {Number} t
 */
function sigmoid(t) {
    return 1 / (1 + Math.pow(Math.E, -t));
}

/**
 * @name predict
 * @description Function that makes a predictoin.
 * @param {Array} X
 * @param {Array} theta
 */
function predict(X, theta) {
    let p = math.multiply(X, theta);
    return p.map((d) => sigmoid(d));
}

/**
 * @name loss
 * @description Function that computes cross entropy loss.
 * @param {Array} X
 * @param {Array} y
 * @param {Array} theta
 */
function loss(X, y, theta) {
    let p = predict(X, theta),
        l = math.dotMultiply(
            math.add(
                math.dotMultiply(y, math.log2(p)),
                math.dotMultiply(
                    math.subtract(1, y),
                    math.log2(math.subtract(1, p))
                )
            ),
            -1
        );
    return math.mean(l);
}

/**
 * @name batchGDStep
 * @description Function that performs a batch gradient descent step.
 * @param {Array} X
 * @param {Array} y
 * @param {Number} learningRate
 * @param {Array} theta
 */
function batchGDStep(X, y, learningRate, theta) {
    let gradient = math.divide(
        math.multiply(math.transpose(X), math.subtract(predict(X, theta), y)),
        X.size()[0]
    );
    return math.subtract(theta, math.multiply(learningRate, gradient));
}

/**
 * @name chart4
 * @description Main function that creates the visualization.
 * @param {Object} dataRaw
 */
function chart4(dataRaw) {
    /**
     * @name plop
     * @description Named transition for updating circles.
     * @param {Object} circle
     * @param {Number} duration
     */
    function plop(circle, duration) {
        circle
            .attr("r", 8)
            .style("fill", (d) => d.color)
            .transition("plop")
            .duration(duration)
            .attr("r", 5);
    }

    /**
     * @name updateScatter
     * @description Function that updates the scatter plot.
     */
    function updateScatter() {
        let m = math.concat(
                math.concat(math.column(X, 1), y),
                predData,
                math.largerEq(predData, 0.5)
            ),
            dataScatter = m.valueOf().map((d, i) => ({
                i: i,
                x: +d[0].toFixed(2),
                y: +d[1].toFixed(2),
                color: d[1] == d[3] ? "green" : "red",
            }));

        scatter
            .selectAll(".scatter")
            .data(dataScatter, (d) => `${d["i"]}-${d["color"]}`)
            .join(
                (enter) =>
                    enter
                        .append("circle")
                        .attr("class", "scatter")
                        .attr("cx", (d) => xScale(d.x))
                        .attr("cy", (d) => yScale(d.y))
                        .call(plop, 500),
                (update) =>
                    update
                        .transition()
                        .delay((d, i) => 10 * i)
                        .duration(500)
                        .attr("cx", (d) => xScale(d.x))
                        .attr("cy", (d) => yScale(d.y))
            )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    }

    /**
     * @name updateSigmoids
     * @description Function that updates the sigmoid shape.
     */
    function updateSigmoids() {
        const line = d3
            .line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

        sigmoid
            .selectAll(".sigmoid-path")
            .data([
                { id: sigmoid, color: "steelblue", values: predComb },
                { id: sigmoid, color: "red", values: predCombInv },
            ])
            .join(
                (enter) =>
                    enter
                        .append("path")
                        .attr("class", "sigmoid-path")
                        .attr("clip-path", "url(#chart4-logreg-clip)")
                        .attr("fill", "none")
                        .attr("stroke", (d) => d.color)
                        .attr("stroke-width", 1.5)
                        .attr("d", (d) => line(d.values)),
                (update) =>
                    update
                        .transition()
                        .duration(5)
                        .attr("d", (d) => line(d.values))
            );
    }

    /**
     * @name updateSliders
     * @description Function that updates the slider values based on new data.
     */
    function updateSliders() {
        svgTheta0Slider
            .transition()
            .duration(500)
            .call(
                theta0Slider
                    .min(dataRaw.theta0_best * 0.25)
                    .max(dataRaw.theta0_best * 1.75)
                    .value(0)
            );
        theta0Slider.value(
            _.random(dataRaw.theta0_best * 0.25, dataRaw.theta0_best * 1.75)
        );
        svgTheta1Slider
            .transition()
            .duration(500)
            .call(
                theta1Slider
                    .min(dataRaw.theta1_best * 0.25)
                    .max(dataRaw.theta1_best * 1.75)
                    .value(0)
            );
        theta1Slider.value(
            _.random(dataRaw.theta1_best * 0.25, dataRaw.theta1_best * 1.75)
        );
    }

    /**
     * @name updateAxes
     * @description Function that updates the axes based on new data.
     */
    function updateAxes() {
        xScale.domain(d3.extent(d, (d) => d.x));
        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
    }

    /**
     * @name init
     * @description Function that initializes the input data.
     */
    function init() {
        data = dataRaw.data;
        X = math.matrix(data.map((d) => [+d.X_b, +d.X]));
        y = math.matrix(data.map((d) => [+d.y]));
        d = data.map((d) => ({ x: +d.X, y: +d.y }));
        theta = setTheta(5, -6);
        learningRate = 0.2;
        xRange = math
            .matrix(
                _.range(
                    math.min(math.column(X, 1)),
                    math.max(math.column(X, 1)),
                    0.005
                ).map((d) => [1, +d.toFixed(2)])
            )
            .reshape([-1, 2]);
    }

    /**
     * @name step
     * @description Generic function for one computation step.
     */
    function step() {
        let lossOld = loss(X, y, theta);
        theta = batchGDStep(X, y, learningRate, theta);
        let lossNew = loss(X, y, theta),
            tol = lossOld - lossNew;
        theta0Slider.value(theta.valueOf()[0][0]);
        theta1Slider.value(theta.valueOf()[1][0]);

        if (tol < 1e-6) {
            clearInterval(timer);
            d3.select("#chart4-converge-button").text("Converge");
        }
    }

    let data,
        X,
        y,
        d,
        theta,
        learningRate,
        xRange,
        predRange,
        predData,
        predComb,
        predCombInv;

    // Define margin and size
    let margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width =
            d3.select("#chart4-logreg-container").node().getBoundingClientRect()
                .width -
            margin.left -
            margin.right,
        height =
            d3.select("#chart4-logreg-container").node().getBoundingClientRect()
                .height -
            margin.top -
            margin.bottom,
        marginSliders = { top: 0, right: 50, bottom: 0, left: 50 },
        widthSliders =
            d3.select("#chart4-theta0-container").node().getBoundingClientRect()
                .width -
            marginSliders.left -
            marginSliders.right,
        heightSliders =
            d3.select("#chart4-theta0-container").node().getBoundingClientRect()
                .height -
            marginSliders.top -
            marginSliders.bottom;

    // Define the scales
    let xScale = d3.scaleLinear().range([0, width]),
        yScale = d3.scaleLinear().range([height, 0]).domain([0, 1]);

    // Define slider
    let theta0Slider = d3
            .sliderBottom()
            .width(widthSliders)
            .tickFormat(d3.format(".2"))
            .ticks(5)
            .step(0.001)
            .handle(d3.symbol().type(d3.symbolCircle).size(200)())
            .on("onchange.slider", (val) => {
                theta = setTheta(val, theta.valueOf()[1][0]);
                predRange = predict(xRange, theta);
                predData = predict(X, theta);
                predComb = predRange
                    .valueOf()
                    .map((d, i) => ({ x: xRange.valueOf()[i][1], y: d[0] }));
                predCombInv = predComb.map((d) => ({ x: d.x, y: 1 - d.y }));
                updateSigmoids();
                updateScatter();
            }),
        theta1Slider = d3
            .sliderBottom()
            .width(widthSliders)
            .tickFormat(d3.format(".2"))
            .ticks(5)
            .step(0.001)
            .handle(d3.symbol().type(d3.symbolCircle).size(200)())
            .on("onchange.slider", (val) => {
                theta = setTheta(theta.valueOf()[0][0], val);
                predRange = predict(xRange, theta);
                predData = predict(X, theta);
                predComb = predRange
                    .valueOf()
                    .map((d, i) => ({ x: xRange.valueOf()[i][1], y: d[0] }));
                predCombInv = predComb.map((d) => ({ x: d.x, y: 1 - d.y }));
                updateSigmoids();
                updateScatter();
            });

    // Create charts
    let svg = d3
        .select("#chart4-logreg-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Apply clip
    svg.append("clipPath")
        .attr("id", "chart4-logreg-clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    // Create axes
    let xAxis = svg.append("g").attr("transform", `translate(0,${height})`),
        yAxis = svg.append("g").call(d3.axisLeft(yScale));

    // Create groups
    let sigmoid = svg.append("g").attr("class", "sigmoid-group"),
        line2sig = svg.append("g").attr("class", "line2sig-group"),
        scatter = svg.append("g").attr("class", "scatter-group");

    // Create sliders
    let svgTheta0Slider = d3
            .select("#chart4-theta0-container")
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
            )
            .attr("id", "chart4-theta0-slider"),
        svgTheta1Slider = d3
            .select("#chart4-theta1-container")
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
            )
            .attr("id", "chart4-theta1-slider");

    let tooltip = d3
            .select("#chart4-logreg-container")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px"),
        dot,
        actualY,
        dotX,
        dotY,
        color,
        bucket,
        mouseover = function (d) {
            let yPosStart, yNegStart;
            dot = d3.select(this);
            actualY = yScale.invert(dot.attr("cy"));
            dotX = xScale.invert(+dot.attr("cx"));
            dotY = predict(math.matrix([[1, dotX]]), theta).valueOf()[0][0];
            color =
                (actualY == 0 && dotY < 0.5) || (actualY == 1 && dotY >= 0.5)
                    ? "green"
                    : "red";
            if (actualY == 0 && dotY < 0.5) {
                bucket = "True Negative";
                yPosStart = 0;
                yNegStart = dotY;
            } else if (actualY == 1 && dotY >= 0.5) {
                bucket = "True Positive";
                yPosStart = 1;
                yNegStart = dotY;
            } else if (actualY == 0 && dotY >= 0.5) {
                bucket = "False Positive";
                yPosStart = 1 - dotY;
                yNegStart = 0;
            } else {
                bucket = "False Negative";
                yPosStart = 1 - dotY;
                yNegStart = 1;
            }

            tooltip.style("opacity", 0.9);
            d3.select(this).style("stroke", "black").style("opacity", 1);

            let lineData = [
                    {
                        id: "toPositive",
                        color: "blue",
                        values: [
                            { x: dotX, y: yPosStart },
                            { x: dotX, y: dotY },
                        ],
                    },
                    {
                        id: "toNegative",
                        color: "red",
                        values: [
                            { x: dotX, y: yNegStart },
                            { x: dotX, y: 1 - dotY },
                        ],
                    },
                ],
                lineGenerator = d3
                    .line()
                    .x((d) => xScale(d.x))
                    .y((d) => yScale(d.y));
            line2sig
                .selectAll(".line2sig")
                .data(lineData)
                .join((enter) => {
                    enter
                        .append("path")
                        .attr("class", "line2sig")
                        .attr("clip-path", "url(#chart4-logreg-clip)")
                        .attr("fill", "none")
                        .attr("stroke", (d) => d.color)
                        .attr("stroke-width", 1)
                        .attr("stroke-dasharray", "5,3")
                        .attr("opacity", 0.8)
                        .attr("d", (d) => lineGenerator(d.values));
                });
        },
        mousemove = function (d) {
            tooltip.html(`
                                    <div class="card" style="width: 18rem;">
                                        <div class="card-body">
                                            <h5 class="card-title"><span style="color:${color}">${bucket}</span></h5>
                                        </div>
                                        <ul class="list-group list-group-flush">
                                            <li id="logreg-prob" class="list-group-item"></li>
                                        </ul>
                                    </div>
                                `);

            d3.select("#logreg-prob")
                .append("foreignObject")
                .append("xhtml:span")
                .attr("id", "logreg-prob-span")
                .style("font-size", "medium");

            let nodes = d3.select("#logreg-prob-span").nodes();
            nodes[0].innerHTML = String.raw`$$ \sigma(${dotX.toFixed(
                2
            )}) = \frac{1}{1+e^{-${dotX.toFixed(2)}}} = ${dotY.toFixed(
                3
            )} $$ $$ 1 - \sigma(${dotX.toFixed(2)}) = ${(1 - dotY).toFixed(
                3
            )} $$`;
            MathJax.typesetPromise(nodes).then(() => {});

            let offsetY = actualY == 0 ? tooltip.node().clientHeight : 0;

            tooltip
                .style("left", d3.pointer(d)[0] + margin.left + 10 + "px")
                .style(
                    "top",
                    d3.pointer(d)[1] + margin.top - offsetY + 10 + "px"
                );
        },
        mouseleave = function (d) {
            tooltip.style("opacity", 0);
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "none")
                .style("opacity", 0.8);
            line2sig.selectAll(".line2sig").remove();
        };

    init();
    updateAxes();
    updateSliders();

    let timer;
    d3.select("#chart4-converge-button").on("click", function () {
        let button = d3.select(this);
        if (button.text() == "Pause") {
            clearInterval(timer);
            button.text("Converge");
        } else {
            timer = setInterval(step, 5);
            button.text("Pause");
        }
    });

    d3.selectAll(".data-update").on("change", function () {
        let xIdx = +d3.select("#chart4-feature-selection").property("value"),
            yIdx = +d3.select("#chart4-target-selection").property("value");
        d3.json(
            `https://api.philippstuerner.com/data/logreg_data?X_idx=${xIdx}&y_idx=${yIdx}&return_theta=true&normalize=false`
        ).then(function (dataUpdate) {
            clearInterval(timer);
            d3.select("#chart4-converge-button").text("Converge");
            dataRaw = dataUpdate;
            init();
            updateAxes();
            updateSliders();
        });
    });
}

d3.json(
    "https://api.philippstuerner.com/data/logreg_data?X_idx=2&y_idx=2&return_theta=true&normalize=false"
).then(function (dataRaw) {
    chart4(dataRaw);
});
