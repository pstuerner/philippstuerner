import {responsivefy, arrAvg} from '../../helpers.js';

function chart3(data) {
  function updateControls(data) {
    var yExtent = d3.extent(data.data, d => d.y),
        xExtent = d3.extent(data.data, d => d.X),
        m_value = Number((Math.max(...yExtent.map(d=>Math.abs(d)))/Math.max(...xExtent.map(d=>Math.abs(d)))).toFixed(1));
  
    var bData = [Number(yExtent[0].toFixed(1)),Number(yExtent[1].toFixed(1))],
        mData = [-2*m_value,2*m_value];
    
    var yMean = arrAvg(data.data.map(d=>d.y)).toFixed(1),
        mMean = arrAvg(mData).toFixed(1);
    
    bSlider.min(d3.min(bData)).max(d3.max(bData)).value(data.theta0_best);
    bSliderG.transition().duration(1000).call(bSlider);
    mSlider.min(d3.min(mData)).max(d3.max(mData)).value(mMean);
    mSliderG.transition().duration(1000).call(mSlider); 

    // Update MSE equation
    const node = document.getElementById('mse-equation');
    MathJax.typesetClear([node]);
    node.innerHTML = String.raw`$$ \textrm{MSE}(\theta) = \frac{1}{m}\sum_{i=1}^{m}{(\theta^Tx^i-y^i)^2}, \: \textrm{with} \: \theta=\begin{pmatrix}\theta_0^{\textrm{best}}\\\theta_1\end{pmatrix}=\begin{pmatrix}{${data.theta0_best.toFixed(2)}}\\\theta_1\end{pmatrix} $$`;
    MathJax.typesetPromise([node]).then(() => {});

    d3.selectAll('.chart3-best-fit').on('click', function() {
      mSlider.value(data.theta1_best);
      bSlider.value(data.theta0_best);
    });
  };

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
                    .attr('clip-path', 'url(#chart3-scatter-clip)')
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
                    .attr('clip-path', 'url(#chart3-scatter-clip)')
                    .transition()
                    .duration(150)
                    .delay((d,i)=>i*5)
                    .attr('d', d => lineGen(d.v))
                }
            );
        }

        function updateMSE() {
          const mse = arrAvg(squaredResiduals);
          const nodeMse = document.getElementById('chart3-mse');
          // const nodeMseShort = document.getElementsByClassName('chart3-mse-short')[0];
          MathJax.typesetClear([nodeMse]);
          nodeMse.innerHTML = String.raw`$$\textrm{MSE}=${mse.toFixed(2)}$$`;
          // nodeMseShort.innerHTML = String.raw`\(${mse.toFixed(2)}\)`;
          MathJax.typesetPromise([nodeMse]).then(() => {});
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
                    .attr('clip-path', 'url(#chart3-scatter-clip)')
                    .transition()
                    .duration(100)
                    .attr('d', d => lineGen(d.v))
                    .style('fill', 'none')
                    .style('stroke', 'black')
                },
                update => {
                    update
                    .attr('clip-path', 'url(#chart3-scatter-clip)')
                    .transition()
                    .duration(100)
                    .attr('d', d => lineGen(d.v))
                }
            )
        };
        const yPred = getPredictions(data.map(d=>d.X), m, b);
        const squaredResiduals = data.map((d,i)=>Math.pow(d.y-yPred[i],2));
        
        updateResiduals();
        updateMSE();
        updateLine();
    };

    // Update scales
    xScale.domain([0,d3.max(data, d=>d.X)]);
    yScale.domain(d3.extent(data, d=>d.y));

    // Update axes
    xAxisDraw.transition(t).call(xAxis.scale(xScale));
    yAxisDraw.transition(t).call(yAxis.scale(yScale));
    yAxisDraw.selectAll('text').attr('dx', '-0.6em');

    // m, b
    const m = mSlider.value();
    const b = bSlider.value();

    updateScatter();
    updateRegressionComponents(data, m, b)

    mSlider.on('onchange.chart', val => updateRegressionComponents(data, val, bSlider.value()));
    bSlider.on('onchange.chart', val => updateRegressionComponents(data, mSlider.value(), val));
  };

  // Controls
  var controlsHeight = '4em';

  var bSliderSvg = d3
    .select('div#chart3-bslider')
    .append('svg')
    .attr('width', '100%')
    .attr('height', controlsHeight)
    .call(responsivefy);

  var mSliderSvg = d3
    .select('div#chart3-mslider')
    .append('svg')
    .attr('width', '100%')
    .attr('height', controlsHeight)
    .call(responsivefy);

  var bSliderSvgRect = bSliderSvg.node().getBoundingClientRect(),
      mSliderSvgRect = mSliderSvg.node().getBoundingClientRect();
      
  var bSlider = d3
    .sliderBottom()
    .width(bSliderSvgRect.width*.9)
    .tickFormat(d3.format('.2'))
    .ticks(5)
    .handle(
      d3
        .symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .on('onchange', val => {
      const nodes = document.getElementsByClassName('chart3-bslider');
      MathJax.typesetClear(nodes);
      for (let node of nodes) {
        node.innerHTML = `\\(\\theta_0=${val.toFixed(1)}\\)`;
      }
      MathJax.typesetPromise(nodes).then(() => {});
  });

  var mSlider = d3
    .sliderBottom()
    .width(mSliderSvgRect.width*.9)
    .tickFormat(d3.format('.2'))
    .ticks(5)
    .handle(
      d3
        .symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .on('onchange.slider', val => {
      const nodes = document.getElementsByClassName('chart3-mslider');
      MathJax.typesetClear(nodes);
      for (let node of nodes) {
        node.innerHTML = `\\(\\theta_1=${val.toFixed(1)}\\)`;
      }
      MathJax.typesetPromise(nodes).then(() => {});
  });

  var bSliderG = bSliderSvg.append('g').attr('transform', `translate(${bSliderSvgRect.width*.05},${bSliderSvgRect.height/3})`);
  var mSliderG = mSliderSvg.append('g').attr('transform', `translate(${mSliderSvgRect.width*.05},${mSliderSvgRect.height/3})`);
  
  bSliderG.call(bSlider.min(0).max(1).value(0.5)).attr('id','chart3-bslider');
  mSliderG.call(mSlider.min(0).max(1).value(0.5)).attr('id','chart3-mslider');

  updateControls(data);

  // Chart
  const margin = {top: 40, bottom: 40, left: 60, right: 40},
        chartWidth = d3.select('#chart3-graph').node().getBoundingClientRect().width-margin.left-margin.right,
        chartHeight = d3.select('#chart3-graph').node().getBoundingClientRect().height-margin.top-margin.bottom,
        xScale = d3.scaleLinear().range([0, chartWidth]),
        yScale = d3.scaleLinear().range([chartHeight, 0]);
  
  const baseSvg = d3
                  .select('#chart3-graph')
                  .append("svg")
                  .attr('width', chartWidth+margin.left+margin.right)
                  .attr('height', chartHeight+margin.top+margin.bottom)
                  .call(responsivefy);

  baseSvg
  .append('clipPath')
  .attr('id', 'chart3-scatter-clip')
  .append('rect')
  .attr('width', chartWidth + margin.left + margin.right)
  .attr('height', chartHeight);

  const svg = baseSvg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Draw frameworks
  const residuals = svg.append('g').attr('class', 'residuals'),
        scatters = svg.append('g').attr('class', 'scatters'),
        lines = svg.append('g').attr('class', 'lines');

  // Draw axis
  const xAxis = d3.axisBottom(xScale),
        xAxisDraw = svg.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${chartHeight})`),
        yAxis = d3.axisLeft(yScale),
        yAxisDraw = svg.append('g').attr('class', 'y axis');
    
  updateChart(data.data);

  svg.append("foreignObject")
    .attr("height",50)
    .attr("width",100)
    .attr("transform",`translate(${-margin.left*1.25},${chartHeight/2+50}),rotate(-90)`)
    .append("xhtml:span")
    .attr("class", "axisLabel")
    .style('font-size', 'medium')

  svg.append("foreignObject")
    .attr("height",50)
    .attr("width",100)
    .attr("transform",`translate(${chartWidth/2-50},${chartHeight+5})`)
    .append("xhtml:span")
    .attr("class", "axisLabel")
    .style('font-size', 'medium')

  let axisNodes = d3.selectAll('#chart3 .axisLabel').nodes()
  axisNodes[0].innerHTML = String.raw`$$y$$`
  axisNodes[1].innerHTML = String.raw`$$X$$`
  MathJax.typesetPromise(axisNodes).then(() => {});

  d3.select('#chart3-fresh-data').on('click', function() {
    d3.json('https://api.philippstuerner.com/data/gradient_descent').then(function(data) {
      updateControls(data);
      updateChart(data.data);
    });
  });
}

d3.json('https://api.philippstuerner.com/data/gradient_descent').then(function(data) {
    chart3(data);
  });
