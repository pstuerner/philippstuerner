import {responsivefy, arrAvg, latexifyMatrix} from '../../helpers.js';

function chart3(dataRaw) {
    function predict () {
        let degreeIndex = +degreeSlider.value()-1,
            xPolyTrain = math.matrix(dataRaw.polynomials[degreeIndex].X_poly_train),
            xPolyTest = math.matrix(dataRaw.polynomials[degreeIndex].X_poly_test);
        
        theta = math.transpose(math.matrix([thetas[degreeIndex]]))
        
        // Train
        yHatTrain = math.multiply(xPolyTrain,theta)
        residualsTrain = math.subtract(yTrain,yHatTrain)
        squaredResidualsTrain = math.square(residualsTrain)
        mseTrain = math.mean(squaredResidualsTrain)
        rmseTrain = math.sqrt(math.mean(squaredResidualsTrain))
        maeTrain = math.mean(math.abs(residualsTrain))
        r2Train = 1 - (math.sum(squaredResidualsTrain)/math.sum(math.square(math.subtract(yTrain,yTrainMean))))
        d3.select('#chart3-train-mae').text(maeTrain.toFixed(2))
        d3.select('#chart3-train-mse').text(mseTrain.toFixed(2))
        d3.select('#chart3-train-rmse').text(rmseTrain.toFixed(2))
        d3.select('#chart3-train-r2').text(r2Train.toFixed(3))
        
        // Test
        yHatTest = math.multiply(xPolyTest,theta)
        residualsTest = math.subtract(yTest,yHatTest)
        squaredResidualsTest = math.square(residualsTest)
        mseTest = math.mean(squaredResidualsTest)
        rmseTest = math.sqrt(math.mean(squaredResidualsTest))
        maeTest = math.mean(math.abs(residualsTest))
        r2Test = 1 - (math.sum(squaredResidualsTest)/math.sum(math.square(math.subtract(yTest,yTestMean))))
        d3.select('#chart3-test-mae').text(maeTest.toFixed(2))
        d3.select('#chart3-test-mse').text(mseTest.toFixed(2))
        d3.select('#chart3-test-rmse').text(rmseTest.toFixed(2))
        d3.select('#chart3-test-r2').text(r2Test.toFixed(3))
    }

    function updateRegression () {
        // Function to adjust the regression line according to new data and theta values
        let lineDataTrain = [{
                            v: yHatTrain.valueOf().map(function (d,i) {
                                return {x: xTrain.subset(math.index(1,i)), y: _.clamp(d,yExtentTrain[0]-math.abs(yExtentTrain[0]*.5),yExtentTrain[1]+math.abs(yExtentTrain[0]*.5))}
                            })
                        }],
            lineDataTest = [{
                v: yHatTest.valueOf().map(function (d,i) {
                    return {x: xTest.subset(math.index(1,i)), y: _.clamp(d,yExtentTest[0]-math.abs(yExtentTest[0]*.5),yExtentTest[1]+math.abs(yExtentTest[0]*.5))}
                })
            }],
            lineGenTrain = d3.line().x(d=>xScaleTrain(d.x)).y(d=>yScaleTrain(d.y)),
            lineGenTest = d3.line().x(d=>xScaleTest(d.x)).y(d=>yScaleTest(d.y)); 

        // Update regression
        regressionLineTrain
        .selectAll('.line-train')
        .data(lineDataTrain)
        .join(
            enter => {
                enter
                .append('path')
                .attr('class', 'line-train')
                .attr('clip-path', 'url(#chart3-train-clip)')
                .transition()
                .duration(100)
                .attr('d', d => lineGenTrain(d.v))
                .style('fill', 'none')
                .style('stroke', 'black')
            },
            update => {
                update
                .transition()
                .duration(100)
                .attr('d', d => lineGenTrain(d.v))
            }
        )

        regressionLineTest
        .selectAll('.line-test')
        .data(lineDataTest)
        .join(
            enter => {
                enter
                .append('path')
                .attr('class', 'line-test')
                .attr('clip-path', 'url(#chart3-test-clip)')
                .transition()
                .duration(100)
                .attr('d', d => lineGenTest(d.v))
                .style('fill', 'none')
                .style('stroke', 'black')
            },
            update => {
                update
                .transition()
                .duration(100)
                .attr('d', d => lineGenTest(d.v))
            }
        )
    }

    function updateScatter() {
        scatterTrain
        .selectAll('.scatter-train')
        .data(dataTrain)
        .join(
            enter => {
                enter
                .append('circle')
                .attr('class', 'scatter-train')
                .attr('id', d => `scatter-train-${d.i}`)
                .attr('cy', d => yScaleTrain(d.y))
                .attr('r', 5)
                .style('fill', 'dodgerblue')
                .transition()
                .duration(500)
                .attr('cx', d => xScaleTrain(d.X))
            },
            update => {
                update
                .transition()
                .duration(500)
                .delay((d,i)=>i*10)
                .attr('cx', d => xScaleTrain(d.X))
                .attr('cy', d => yScaleTrain(d.y))
                .attr('r', 5)
            },
            exit => {
                exit.remove()
            }
        )

        scatterTest
        .selectAll('.scatter-test')
        .data(dataTest)
        .join(
            enter => {
                enter
                .append('circle')
                .attr('class', 'scatter-test')
                .attr('id', d => `scatter-test-${d.i}`)
                .attr('cy', d => yScaleTest(d.y))
                .attr('r', 5)
                .style('fill', 'dodgerblue')
                .transition()
                .duration(500)
                .attr('cx', d => xScaleTest(d.X))
            },
            update => {
                update
                .transition()
                .duration(500)
                .delay((d,i)=>i*10)
                .attr('cx', d => xScaleTest(d.X))
                .attr('cy', d => yScaleTest(d.y))
                .attr('r', 5)
            },
            exit => {
                exit.remove()
            }
        )
    }

    function updateAxes () {
        xScaleTrain.domain(d3.extent(dataTrain.map(d=>d.X)))
        yScaleTrain.domain(d3.extent(dataTrain.map(d=>d.y)))
        xScaleTest.domain(d3.extent(dataTest.map(d=>d.X)))
        yScaleTest.domain(d3.extent(dataTest.map(d=>d.y)))

        xAxisTrain.transition().duration(500).call(d3.axisBottom(xScaleTrain))
        yAxisTrain.transition().duration(500).call(d3.axisLeft(yScaleTrain))
        xAxisTest.transition().duration(500).call(d3.axisBottom(xScaleTest))
        yAxisTest.transition().duration(500).call(d3.axisLeft(yScaleTest))
    }

    function dataInit () {
        dataTrain = _.sortBy(dataRaw.data_train, [function(o) { return o.X; }])
        dataTest = _.sortBy(dataRaw.data_test, [function(o) { return o.X; }])
        xExtentTrain = d3.extent(dataTrain.map(d=>d.X))
        yExtentTrain = d3.extent(dataTrain.map(d=>d.y))
        xExtentTest = d3.extent(dataTest.map(d=>d.X))
        yExtentTest = d3.extent(dataTest.map(d=>d.y))
        xTrain = math.matrix([dataTrain.map(d=>1), dataTrain.map(d=>d.X)])
        yTrain = math.matrix(dataTrain.map(d=>[+d.y]))
        yTrainMean = math.mean(yTrain)
        xTest = math.matrix([dataTest.map(d=>1), dataTest.map(d=>d.X)])
        yTest = math.matrix(dataTest.map(d=>[+d.y]))
        yTestMean = math.mean(yTest)
        thetas = dataRaw.polynomials.map(d=>d.theta)
    }
    
    let dataTrain, dataTest, xExtentTrain, yExtentTrain, xExtentTest, yExtentTest, xTrain, yTrain, yTrainMean, xTest, yTest, yTestMean, thetas, yHatTrain, residualsTrain, squaredResidualsTrain, mseTrain, rmseTrain, maeTrain, r2Train, yHatTest, residualsTest, squaredResidualsTest, mseTest, rmseTest, maeTest, r2Test, theta, noiseChangeAllow = false;

    dataInit();
    
    // Define margin and size
    let margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = d3.select('#chart3-train-scatter').node().getBoundingClientRect().width - margin.left - margin.right,
        height = d3.select('#chart3-train-scatter').node().getBoundingClientRect().height - margin.top - margin.bottom,
        marginSliders = {top: 50, right: 0, bottom: 50, left: 0},
        widthSliders = d3.select('#chart3-degree-container').node().getBoundingClientRect().width - marginSliders.left - marginSliders.right,
        heightSliders = d3.select('#chart3-degree-container').node().getBoundingClientRect().height - marginSliders.top - marginSliders.bottom;

    // Define slider
    let degreeSlider = d3
                    .sliderLeft()
                    .height(heightSliders)
                    .tickFormat(d3.format('.2'))
                    .ticks(5)
                    .step(1)
                    .handle(
                    d3
                        .symbol()
                        .type(d3.symbolCircle)
                        .size(200)()
                    )
                    .on('onchange.slider', val => {
                        predict()
                        updateRegression()
                    }),
        noiseSlider = d3
                    .sliderLeft()
                    .height(heightSliders)
                    .tickFormat(d3.format('.2'))
                    .ticks(5)
                    .step(1)
                    .handle(
                    d3
                        .symbol()
                        .type(d3.symbolCircle)
                        .size(200)()
                    )
                    .on('end.slider', val => {
                        d3.json(`http://localhost:8081/data/poly_data?degrees=20&noise=${+val}`).then(function(dataUpdate) {
                            dataRaw = dataUpdate;
                            dataInit()
                            predict()
                            updateAxes()
                            updateScatter()
                            updateRegression()
                        });
                    })
                    .on('onchange.slider', val => {
                        if (noiseChangeAllow) {
                            d3.json(`http://localhost:8081/data/poly_data?degrees=20&noise=${+val}`).then(function(dataUpdate) {
                                dataRaw = dataUpdate;
                                dataInit()
                                predict()
                                updateAxes()
                                updateScatter()
                                updateRegression()
                            });
                        }
                        noiseChangeAllow = false;
                    });
    
    // Create charts
    let svgTrain = d3.select("#chart3-train-scatter")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(responsivefy)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        svgTest = d3.select("#chart3-test-scatter")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(responsivefy)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Apply clip
    svgTrain
    .append('clipPath')
    .attr('id', 'chart3-train-clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);
    svgTest
    .append('clipPath')
    .attr('id', 'chart3-test-clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

    // Define the scales
    let xScaleTrain = d3.scaleLinear().range([0, width]),
        yScaleTrain = d3.scaleLinear().range([height, 0]),
        xScaleTest = d3.scaleLinear().range([0, width]),
        yScaleTest = d3.scaleLinear().range([height, 0]);
    
    // Create axes
    let xAxisTrain = svgTrain.append("g").attr("transform", `translate(0,${height})`),
        yAxisTrain = svgTrain.append("g"),
        xAxisTest = svgTest.append("g").attr("transform", `translate(0,${height})`),
        yAxisTest = svgTest.append("g");

    // Create scatter group
    let scatterTrain = svgTrain.append('g').attr('class', 'scatter-train-group'),
        scatterTest = svgTest.append('g').attr('class', 'scatter-test-group');

    // Create regression line group
    let regressionLineTrain = svgTrain.append('g').attr('class', 'regression-line-train-group'),
        regressionLineTest = svgTest.append('g').attr('class', 'regression-line-test-group');

    // Create sliders
    let svgDegreeSlider = d3
        .select('#chart3-degree-container')
        .append('svg')
        .attr("width", widthSliders + marginSliders.left + marginSliders.right)
        .attr("height", heightSliders + marginSliders.top + marginSliders.bottom)
        .call(responsivefy)
        .append('g')
        .attr('transform', `translate(${widthSliders/2},${marginSliders.top})`),
        svgNoiseSlider = d3
        .select('#chart3-noise-container')
        .append('svg')
        .attr("width", widthSliders + marginSliders.left + marginSliders.right)
        .attr("height", heightSliders + marginSliders.top + marginSliders.bottom)
        .call(responsivefy)
        .append('g')
        .attr('transform', `translate(${widthSliders/2},${marginSliders.top})`);
    
    svgDegreeSlider
        .transition()
        .duration(500)
        .call(degreeSlider
            .min(1)
            .max(20)
            .value(1)
        )
        .attr('id','chart3-degree-slider');
    
    svgNoiseSlider
        .transition()
        .duration(500)
        .call(noiseSlider
            .min(0)
            .max(20)
            .value(4)
        )
        .attr('id','chart3-noise-slider');

    // Update
    predict()
    // updateMathjax()
    // updateResiduals()
    updateAxes()
    updateScatter()
    updateRegression()

    d3.selectAll('.chart3-options').on('click', function () {
        let degree = +d3.select(this).property('id').split('-').slice(-3,-2),
            noise = +d3.select(this).property('id').split('-').slice(-1);
        noiseChangeAllow = true;
        setTimeout(d=>{degreeSlider.value(degree);noiseSlider.value(noise)}, 1000);
    })
}

d3.json('http://localhost:8081/data/poly_data?degrees=20&noise=5').then(function(dataRaw) {
    chart3(dataRaw); 
});
    