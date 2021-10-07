import {responsivefy} from '../../helpers.js';

function ready(data) {
    function updateSliders(data) {
        function update(handle, label, xScale, prefix, dMax, h) {
            // update position and text of label according to slider scale
            handle.attr("cx", xScale(h));                
            label.selectAll('svg').remove();
            label.append(() => MathJax.tex2svg(String.raw`${prefix}${h.toFixed(1)}`).querySelector("svg"));
            var labelWidth = label.select('svg').node().getBoundingClientRect().width
            label.attr("transform", `translate(${Math.min(xScale(dMax)-labelWidth, xScale(h))}, ${-35})`);
            label.attr("value", h);
        };

        var yExtent = d3.extent(data, d => d.y);
        var xExtent = d3.extent(data, d => d.X);
        var yMean = arrAvg(data.map(d=>d.y));
        const m_value = Number((Math.max(...yExtent.map(d=>Math.abs(d)))/Math.max(...xExtent.map(d=>Math.abs(d)))).toFixed(1));

        var bSlider = d3.select('#b-slider'),
            bTrack = bSlider.select('.track'),
            bOverlay = bSlider.select('.track-overlay'),
            bLabel = bSlider.select('#label'),
            bPrefix = '\\theta_0 = ',
            bXScale = sliderXScale.domain([yExtent[0],yExtent[1]]),
            mSlider = d3.select('#m-slider'),
            mTrack = mSlider.select('.track'),
            mOverlay = mSlider.select('.track-overlay'),
            mLabel = mSlider.select('#label'),
            mHandle = mSlider.select('.handle'),
            mPrefix = '\\theta_1 = ',
            mXScale = sliderXScale.domain([-2*m_value,2*m_value]);
        // debugger;
        var bHandle = bTrack.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9);

        bTrack
        .attr('x1', bXScale.range()[0])
        .attr('x2', bXScale.range()[1]);

        bLabel.append(() => MathJax.tex2svg(String.raw`${bPrefix}${yExtent[0].toFixed(1)}`)
            .querySelector("svg"))
            .attr("transform", `translate(${-10}, ${-35})`);


        bOverlay
        .call(d3.drag()
            .on("start.interrupt", function() { bSlider.interrupt(); })
            .on("start drag", function(event) {
                update(bHandle, bLabel, bXScale, bPrefix, yExtent[1], bXScale.invert(event.x));
            }));

        
        mLabel.append(() => MathJax.tex2svg(String.raw`${mPrefix}${yExtent[0].toFixed(1)}`)
            .querySelector("svg"))
            .attr("transform", `translate(${-10}, ${-35})`);

        mTrack
        .attr('x1', mXScale.range()[0])
        .attr('x2', mXScale.range()[1]);

        mOverlay
        .call(d3.drag()
            .on("start.interrupt", function() { mSlider.interrupt(); })
            .on("start drag", function(event) {
                var currentValue = event.x;
                update(mHandle, mLabel, mXScale, bPrefix, 2*m_value, mXScale.invert(currentValue));
            }));

        

        
        
        // b_slider = d3.select('#slider-container')
        // .append('input')
        // .attr('id', 'b-slider')
        // .attr('type', 'range')
        // .attr('min', yExtent[0])
        // .attr('max', yExtent[1])
        // .attr('value', Number(yMean.toFixed(1)))
        // .attr('step', 0.1);
        // d3.select('#b-value').text(Number(yMean.toFixed(1)));
        
        // const m_value = Number((Math.max(...yExtent.map(d=>Math.abs(d)))/Math.max(...xExtent.map(d=>Math.abs(d)))).toFixed(1));
        // m_slider = d3.select('#slider-container')
        // .append('input')
        // .attr('id', 'm-slider')
        // .attr('type', 'range')
        // .attr('min', -2*m_value)
        // .attr('max', 2*m_value)
        // .attr('value', 0)
        // .attr('step', 0.1);
        // d3.select('#m-value').text(0);
    }

    function updateChart(data) {
        // Transition
        const dur = 500;
        const t = d3.transition().duration(dur);

        function updateScatter() {
            scatters
            .selectAll('.scatter')
            .data(data)
            .join(
                enter => {
                    enter
                    .append('circle')
                    .attr('class', 'scatter')
                    .attr('id', d => `scatter-${d.i}`)
                    .attr('cy', d => yScale(d.y))
                    .attr('r', 5)
                    .style('fill', 'dodgerblue')
                    .transition(t)
                    .attr('cx', d => xScale(d.X))
                },
                update => {
                    update
                    .transition(t)
                    .delay((d,i)=>i*10)
                    .attr('cx', d => xScale(d.X))
                    .attr('cy', d => yScale(d.y))
                    .attr('r', 5)
                },
                exit => {
                    exit.remove()
                }
            )
        };
        
        function updateRegressionComponents(data, m ,b) {
            function getPredictions(X, m, b) {
                return X.map(d=>m*d+b);
            }

            function updateResiduals() {
                const residualLines = [];
                const lineGen = d3.line().x(d=>xScale(d.x)).y(d=>yScale(d.y));
    
                data.forEach(function(d,i) {
                    residualLines.push(
                        {
                            v: [
                                {x:d.X,y:d.y},
                                {x:d.X,y:yPred[i]}
                            ],
                            i: d.i
                        }
                    )
                });
                
                residuals
                .selectAll('.residual')
                .data(residualLines)
                .join(
                    enter => {
                        enter
                        .append('path')
                        .attr('clip-path', 'url(#scatter-clip)')
                        .attr('class', 'residual')
                        .attr('id', d => `residual-${d.i}`)
                        .transition()
                        .duration(2000)
                        .delay((d,i)=>i*10)
                        .attr('d', d => lineGen(d.v))
                        .style('fill', 'none')
                        .style('stroke', 'red')
                        .style('opacity', 0.5)
                        .style('stroke-width', 30)
                        .style('stroke-dasharray', ('5, 5'))
                    },
                    update => {
                        update
                        .attr('clip-path', 'url(#scatter-clip)')
                        .transition()
                        .duration(150)
                        .delay((d,i)=>i*5)
                        .attr('d', d => lineGen(d.v))
                    }
                );
            }

            function updateMSE() {
                // Update MSE
                const mse = arrAvg(squaredResiduals);
                d3.select('#mse').text(Number(mse.toFixed(2)));
            }

            function updateLine() {
                const lineData = [{v: [0,d3.max(data, d=>d.X)].map(d=>({x:d,y:getPredictions([d],m,b)[0]}))}];
                const lineGen = d3
                                .line()
                                .x(d=>xScale(d.x))
                                .y(d=>yScale(d.y)); 
                
                // Update regression
                lines
                .selectAll('.line')
                .data(lineData)
                .join(
                    enter => {
                        enter
                        .append('path')
                        .attr('class', 'line')
                        .attr('clip-path', 'url(#scatter-clip)')
                        .transition(t)
                        .attr('d', d => lineGen(d.v))
                        .style('fill', 'none')
                        .style('stroke', 'black')
                    },
                    update => {
                        update
                        .attr('clip-path', 'url(#scatter-clip)')
                        .transition()
                        .duration(100)
                        .attr('d', d => lineGen(d.v))
                    }
                )
            };

            const xMax = d3.max(data,d=>d.X);
            const xMin = d3.min(data,d=>d.X);
            const yMax = d3.max(data,d=>d.y);
            const yMin = d3.max(data,d=>d.y);
            const yPred = getPredictions(data.map(d=>d.X), m, b);
            const squaredResiduals = data.map((d,i)=>Math.pow(d.y-yPred[i],2));
            const residualValues = data.map((d,i)=>d.y-yPred[i]);
            const colorScale = d3
                                .scaleSequential(d3.interpolateRdYlGn)
                                .domain([
                                    d3.max(squaredResiduals),
                                    d3.min(squaredResiduals),
                                ]);
            
            updateResiduals();
            updateMSE();
            updateLine();
            
            // slider.append("line")
            //     .attr("class", "track")
            //     .attr("x1", xScale.range()[0])
            //     .attr("x2", xScale.range()[1])
            //     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            //     .attr("class", "track-inset")
            //     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            //     .attr("class", "track-overlay")
            //     .call(d3.drag()
            //         .on("start.interrupt", function() { slider.interrupt(); })
            //         .on("start drag", function(event) {
            //             var currentValue = event.x;
            //             update(xScale.invert(currentValue)); 
            //         })
            //     );

            // d3.select('#b-slider').on('input', function() {
            //     const m = Number(d3.select('#m-value')._groups[0][0].innerHTML);
            //     const b = Number(Number(this.value).toFixed(1))

            //     // Update visualization
            //     updateRegressionComponents(data,m,b);
                
            //     // Update label
            //     d3.select('#b-value').text(b);
            // });
    
            // d3.select('#m-slider').on('input', function() {
            //     const b = Number(d3.select('#b-value')._groups[0][0].innerHTML);
            //     const m = Number(Number(this.value).toFixed(1))

            //     // Update visualization
            //     updateRegressionComponents(data,m,b);
                
            //     // Update label
            //     d3.select('#m-value').text(m);
            // });
        };

        // Update scales
        xScale.domain([0,d3.max(data, d=>d.X)]);
        yScale.domain(d3.extent(data, d=>d.y));

        // Update axes
        xAxisDraw.transition(t).call(xAxis.scale(xScale));
        yAxisDraw.transition(t).call(yAxis.scale(yScale));
        yAxisDraw.selectAll('text').attr('dx', '-0.6em');

        // m, b
        const m = Number(d3.select('#m-slider').attr('value'));
        const b = Number(d3.select('#b-slider').attr('value'));

        updateScatter();
        updateRegressionComponents(data, m, b)
    };

    // Helper
    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

    // Transition
    const dur = 500;
    const t = d3.transition().duration(dur);

    // Margin convention
    const margin = {top: 40, bottom: 40, left: 40, right: 40};
    const width = d3.select('#chart1').node().getBoundingClientRect().width - margin.left - margin.right;
    // const height = d3.select('#chart1').node().getBoundingClientRect().height - margin.top - margin.bottom;
    const height = document.documentElement.clientHeight * 0.5 - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    
    // Draw base

    const baseSvg = d3
                    .select('#chart1')
                    .append("svg")
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .call(responsivefy);
    
    baseSvg
    .append('clipPath')
    .attr('id', 'scatter-clip')
    .append('rect')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height);

    const svg = baseSvg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw frameworks
    const residuals = svg.append('g').attr('class', 'residuals');
    const scatters = svg.append('g').attr('class', 'scatters'); 
    const lines = svg.append('g').attr('class', 'lines');

    // Draw axis
    const xAxis = d3.axisBottom(xScale);
    const xAxisDraw = svg.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${height})`);
    const yAxis = d3.axisLeft(yScale);
    const yAxisDraw = svg.append('g').attr('class', 'y axis');
    
    // Sliders
    const controlsHeight = document.documentElement.clientHeight * 0.1;

    const sliderSvg = d3
                    .select('#chart1-controls')
                    .append("svg")
                    .attr('width', width)
                    .attr('height', controlsHeight)
                    .call(responsivefy);

    var n = 2;
    var sliderWidth = width / n - 2 * (width / n) * .05;
    var bSliderXPos = (width / n) * .05;
    var mSliderXPos = width / 2+ (width / n) * .05;
    var yPos = controlsHeight / 2;
    var sliderXScale = d3.scaleLinear().range([0, sliderWidth]).clamp(true);
    
    var bSlider = sliderSvg.append("g")
                    .attr("class", "slider")
                    .attr("id", 'b-slider')
                    .attr("transform", "translate(" + bSliderXPos + "," + yPos + ")");
    
    
    var mSlider = sliderSvg.append("g")
        .attr("class", "slider")
        .attr("id", 'm-slider')
        .attr("transform", "translate(" + mSliderXPos + "," + yPos + ")");

    [bSlider,mSlider].map(function(item) {
        item.append("line")
            .attr("class", "track")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay");
            // .call(d3.drag()
            //     .on("start.interrupt", function() { slider.interrupt(); })
            //     .on("start drag", function(event) {
            //         var currentValue = event.x;
            //         update(xScale.invert(currentValue)); 
            //     })

        item.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")");
            // .selectAll("text")
            // .data(xScale.ticks(10))
            // .enter()
            // .append("text")
            // .attr("x", xScale)
            // .attr("y", 10)
            // .attr("text-anchor", "middle")
            // .text(function(d) { return d; });

        item.append('g').attr('id', 'label');
    });

    // Update
    updateChart(data.data);
    updateSliders(data.data);

    d3.select('#fresh-scatter-data').on('click', function() {
        d3.json('http://127.0.0.1:8000/data/gradient_descent').then(function(res) {
            updateSliders(res.data);
            updateChart(res.data);
        });
    });
}

d3.json('http://127.0.0.1:8000/data/gradient_descent').then(function(res) {
    ready(res);
});