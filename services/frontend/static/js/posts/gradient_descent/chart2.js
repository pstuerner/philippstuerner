import {responsivefy, arrAvg} from '../../helpers.js';

function chart2(data) {
  const dur = 50;
  const t = d3.transition().duration(dur);

  function getPredictions(X, m, b) {
      return X.map(d=>m*d+b);
  };

  function updateMathJax(theta1) {
    const mse = 1/(2*data.data.length)*d3.sum(data.data.map(d=>Math.pow(data.theta0_best*d.X_b+theta1*d.X-d.y,2)));
    const nodes = [
      document.getElementById('chart2-function'),
      document.getElementById('chart2-mse'),
    ];
    MathJax.typesetClear(nodes);
    nodes[0].innerHTML = String.raw`$$ h_{\theta}(x)=\theta \cdot x = \begin{pmatrix}${data.theta0_best.toFixed(2)}\\${theta1.toFixed(2)}\end{pmatrix} \cdot x $$`;
    nodes[1].innerHTML = String.raw`$$ \textrm{MSE}=${mse.toFixed(2)} $$`;
    MathJax.typesetPromise(nodes).then(() => {});  
  };

  function plotScatter() {
      scatters
      .selectAll('.scatter')
      .data(data.data)
      .join(
          enter => {
              enter
              .append('circle')
              .attr('class', 'scatter')
              .attr('id', d => `scatter-${d.i}`)
              .attr('cy', d => yScaleScatter(d.y))
              .attr('r', 5)
              .style('fill', 'dodgerblue')
              .transition(t)
              .attr('cx', d => xScaleScatter(d.X))
          },
          update => {
              update
              .transition(t)
              .delay((d,i)=>i*5)
              .attr('cx', d => xScaleScatter(d.X))
              .attr('cy', d => yScaleScatter(d.y))
              .attr('r', 5)
          },
          exit => {
              exit.remove()
          }
      )
  };

  function plotLoss() {
      const lineData = [{v: xRangeLoss.map((d,i)=>({x:d,y:yRangeLoss[i]}))}];
      const lineGen = d3
                      .line()
                      .x(d=>xScaleLoss(d.x))
                      .y(d=>yScaleLoss(d.y)); 
      
      loss
      .selectAll('.line')
      .data(lineData)
      .join(
          enter => {
              enter
              .append('path')
              .attr('class', 'line')
              .attr('clip-path', 'url(#loss-clip)')
              .transition()
              .duration(100)
              .attr('d', d => lineGen(d.v))
              .style('fill', 'none')
              .style('stroke', 'black')
          }
      )
  };

  function updateLossDot(theta1) {
    const mse = 1/(2*data.data.length)*d3.sum(data.data.map(d=>Math.pow(data.theta0_best*d.X_b+theta1*d.X-d.y,2)));
    lossdot
    .selectAll('.dot')
    .data([{x:theta1,y:mse}])
    .join(
      enter => {
        enter
        .append('circle')
        .attr('class', 'dot')
        .attr('clip-path', 'url(#loss-clip)')
        .transition()
        .duration(100)
        .attr('cx', d=>xScaleLoss(d.x))
        .attr('cy', d=>yScaleLoss(d.y))
        .attr('r', 5)
        .style('fill', 'red')
      },
      update => {
        update
        .transition()
        .duration(100)
        .attr('cx', d => xScaleLoss(d.x))
        .attr('cy', d => yScaleLoss(d.y))
        .attr('r', 5)
      },
    )
  };

  function updateResiduals(m, b) {
      const residualLines = [];
      const lineGen = d3.line().x(d=>xScaleScatter(d.x)).y(d=>yScaleScatter(d.y));
      const yPred = getPredictions(data.data.map(d=>d.X), m, b);

      data.data.forEach(function(d,i) {
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
              .delay((d,i)=>i*5)
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
  };

  function updateLine(m, b) {
      const lineData = [{v: [0,d3.max(data.data, d=>d.X)].map(d=>({x:d,y:getPredictions([d],m,b)[0]}))}];
      const lineGen = d3
                      .line()
                      .x(d=>xScaleScatter(d.x))
                      .y(d=>yScaleScatter(d.y)); 
      
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
              .transition()
              .duration(100)
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

  const margin = {top: 40, bottom: 40, left: 40, right: 40},
        chartWidth = d3.select('#chart2-scatter').node().getBoundingClientRect().width-margin.left-margin.right,
        chartHeight = d3.select('#chart2-scatter').node().getBoundingClientRect().height-margin.top-margin.bottom;
  
  const scatterBaseSvg = d3
                  .select('#chart2-scatter')
                  .append("svg")
                  .attr('width', chartWidth+margin.left+margin.right)
                  .attr('height', chartHeight+margin.top+margin.bottom)
                  .call(responsivefy);
  
  const lossBaseSvg = d3
    .select('#chart2-loss-function')
    .append("svg")
    .attr('width', chartWidth+margin.left+margin.right)
    .attr('height', chartHeight+margin.top+margin.bottom)
    .call(responsivefy);

  scatterBaseSvg
  .append('clipPath')
  .attr('id', 'scatter-clip')
  .append('rect')
  .attr('width', chartWidth + margin.left + margin.right)
  .attr('height', chartHeight);

  lossBaseSvg
  .append('clipPath')
  .attr('id', 'loss-clip')
  .append('rect')
  .attr('width', chartWidth + margin.left + margin.right)
  .attr('height', chartHeight);

  const scatterSvg = scatterBaseSvg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
  const lossSvg = lossBaseSvg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Draw frameworks
  const residuals = scatterSvg.append('g').attr('class', 'residuals'),
        scatters = scatterSvg.append('g').attr('class', 'scatters'),
        lines = scatterSvg.append('g').attr('class', 'lines'),
        loss = lossSvg.append('g').attr('class', 'loss-group'),
        lossdot = lossSvg.append('g').attr('class', 'lossdot-group');

  // Draw axis
  const xScaleScatter = d3.scaleLinear().range([0, chartWidth]).domain([0,d3.max(data.data, d=>d.X)]),
        yScaleScatter = d3.scaleLinear().range([chartHeight, 0]).domain(d3.extent(data.data, d=>d.y)),
        xAxisDrawScatter = scatterSvg.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${chartHeight})`).transition(t).call(d3.axisBottom(xScaleScatter).scale(xScaleScatter)),
        yAxisDrawScatter = scatterSvg.append('g').attr('class', 'y axis').transition(t).call(d3.axisLeft(yScaleScatter).scale(yScaleScatter));
        yAxisDrawScatter.selectAll('text').attr('dx', '-0.6em');
  
  const xStartLoss = data.theta1_best*-2,
        xEndLoss = data.theta1_best*4,
        xRangeLoss = _.range(xStartLoss, xEndLoss + 0.1, 0.1),
        yRangeLoss = xRangeLoss.map(function(theta1) {return 1/(2*data.data.length)*d3.sum(data.data.map(d=>Math.pow(data.theta0_best*d.X_b+theta1*d.X-d.y,2)))});
        
  const xScaleLoss = d3.scaleLinear().range([0, chartWidth]).domain([xStartLoss,xEndLoss]),
        yScaleLoss = d3.scaleLinear().range([chartHeight, 0]).domain(d3.extent(yRangeLoss)),
        xAxisDrawLoss = lossSvg.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${chartHeight})`).transition(t).call(d3.axisBottom(xScaleLoss).scale(xScaleLoss)),
        yAxisDrawLoss = lossSvg.append('g').attr('class', 'y axis').transition(t).call(d3.axisLeft(yScaleLoss).scale(yScaleLoss));
        yAxisDrawLoss.selectAll('text').attr('dx', '-0.6em');

  plotScatter(data.data);
  plotLoss(data.data);
  
  var theta1_init = +d3.select('#theta1-init').attr('value');
  var learning_rate = +d3.select('#learning-rate').attr('value');

  var controlsHeight = '4em';
  var steps_dict = {0:theta1_init};

  var cxSliderSvg = d3
    .select('div#chart2-cxslider')
    .append('svg')
    .attr('width', '100%')
    .attr('height', controlsHeight);

  var cxSliderSvgRect = cxSliderSvg.node().getBoundingClientRect();
  var cxSlider = d3
    .sliderBottom()
    .width(cxSliderSvgRect.width*.9)
    .ticks(5)
    .min(0)
    .max(200)
    .step(1)
    .handle(
      d3
        .symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .on('drag start', val => {
      clearInterval (myTimer);
    })
    .on('onchange', val => {
      if (!(val in steps_dict)) {
          var next = d3.max(Object.keys(steps_dict).map(d=>Number(d)).filter(d=>d<val)) + 1;
          while (next <= val) {
            steps_dict[next] = steps_dict[next-1] - learning_rate * (d3.sum(data.data.map(d=>(data.theta0_best*d.X_b+steps_dict[next-1]*d.X-d.y)*d.X))/data.data.length);
            next++;
          }
        };
      updateResiduals(steps_dict[val], data.theta0_best);
      updateLine(steps_dict[val], data.theta0_best);
      updateLossDot(steps_dict[val]);
      updateMathJax(steps_dict[val]);
    });

  var cxSliderG = cxSliderSvg.append('g').attr('transform', `translate(${cxSliderSvgRect.width*.05},${cxSliderSvgRect.height/3})`);

  cxSliderG.call(cxSlider.value(30)).attr('id','chart2-cxslider');
  cxSlider.value(0);

  var myTimer;
  d3.select("#chart2-btn-play").on("click", function() {
    clearInterval (myTimer);
    myTimer = setInterval (function() {
        var t = (cxSlider.value() + 1) % (cxSlider.max() + 1);
        if (t == 0) { t = cxSlider.min(); }
        cxSlider.value(t);
      }, 150);
  });

  d3.select("#chart2-btn-pause").on("click", function() {
    clearInterval (myTimer);
  });

  d3.select("#chart2-btn-stop").on("click", function() {
    clearInterval (myTimer);
    cxSlider.value(cxSlider.min());
  });

  d3.select("#chart2-btn-forward").on("click", function() {
    clearInterval (myTimer);
    if (cxSlider.value().toFixed(0) == cxSlider.max().toFixed(0)) {
      cxSlider.value(cxSlider.min());
    } else {
      cxSlider.value(cxSlider.value()+1)
    }
  });

  d3.select("#chart2-btn-backward").on("click", function() {
    clearInterval (myTimer);
    if (cxSlider.value().toFixed(0) == cxSlider.min().toFixed(0)) {
      cxSlider.value(cxSlider.max());
    } else {
      cxSlider.value(cxSlider.value()-1)
    }
  });

  d3.select("#chart2-btn-fast-forward").on("click", function() {
    clearInterval (myTimer);
    cxSlider.value(cxSlider.max());
  });

  d3.select("#chart2-btn-fast-backward").on("click", function() {
    clearInterval (myTimer);
    cxSlider.value(cxSlider.min());
  });

  d3.select("#learning-rate").on("input", function() {
    learning_rate = +this.value;
    steps_dict = {0:theta1_init};
    if (!(cxSlider.value() in steps_dict)) {
        var next = d3.max(Object.keys(steps_dict).map(d=>Number(d)).filter(d=>d<cxSlider.value())) + 1;
        while (next <= cxSlider.value()) {
          steps_dict[next] = steps_dict[next-1] - learning_rate * (d3.sum(data.data.map(d=>(data.theta0_best*d.X_b+steps_dict[next-1]*d.X-d.y)*d.X))/data.data.length);
          next++;
        }
      };
    updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
    updateLine(steps_dict[cxSlider.value()], data.theta0_best);
    updateLossDot(steps_dict[cxSlider.value()]);
    updateMathJax(steps_dict[cxSlider.value()]);
  });

  d3.select("#theta1-init").on("input", function() {
    theta1_init = +this.value;
    steps_dict = {0:theta1_init};
    if (!(cxSlider.value() in steps_dict)) {
        var next = d3.max(Object.keys(steps_dict).map(d=>Number(d)).filter(d=>d<cxSlider.value())) + 1;
        while (next <= cxSlider.value()) {
          steps_dict[next] = steps_dict[next-1] - learning_rate * (d3.sum(data.data.map(d=>(data.theta0_best*d.X_b+steps_dict[next-1]*d.X-d.y)*d.X))/data.data.length);
          next++;
        }
      };
    updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
    updateLine(steps_dict[cxSlider.value()], data.theta0_best);
    updateLossDot(steps_dict[cxSlider.value()]);
    updateMathJax(steps_dict[cxSlider.value()]);
  });

  d3.select('#chart2-scenario-1').on('click', function() {
    cxSlider.value(0);
    learning_rate = 1.75;
    theta1_init = 9;
    steps_dict = {0:theta1_init};
    updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
    updateLine(steps_dict[cxSlider.value()], data.theta0_best);
    updateLossDot(steps_dict[cxSlider.value()]);
    document.getElementById("learning-rate").value=1.75;
    document.getElementById("theta1-init").value=9;
    document.getElementById('chart2-btn-play').click();
  })

  d3.select('#chart2-scenario-2').on('click', function() {
    cxSlider.value(0);
    learning_rate = 1.78;
    theta1_init = -2;
    steps_dict = {0:theta1_init};
    updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
    updateLine(steps_dict[cxSlider.value()], data.theta0_best);
    document.getElementById("learning-rate").value=1.77;
    document.getElementById("theta1-init").value=-2;
    document.getElementById('chart2-btn-play').click();
  })

  d3.select('#chart2-scenario-3').on('click', function() {
    cxSlider.value(0);
    learning_rate = 0.01;
    theta1_init = 7;
    steps_dict = {0:theta1_init};
    updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
    updateLine(steps_dict[cxSlider.value()], data.theta0_best);
    document.getElementById("learning-rate").value=0.01;
    document.getElementById("theta1-init").value=7;
    document.getElementById('chart2-btn-play').click();
  })

  d3.select('#chart2-scenario-4').on('click', function() {
    cxSlider.value(0);
    learning_rate = 0.1;
    theta1_init = -4;
    steps_dict = {0:theta1_init};
    updateResiduals(steps_dict[cxSlider.value()], data.theta0_best);
    updateLine(steps_dict[cxSlider.value()], data.theta0_best);
    document.getElementById("learning-rate").value=0.1;
    document.getElementById("theta1-init").value=-4;
    document.getElementById('chart2-btn-play').click();
  })
}

$(document).ready(function(){
  $('input[type="number"]').on('keyup',function(){
      var v = parseInt($(this).val());
      var min = parseInt($(this).attr('min'));
      var max = parseInt($(this).attr('max'));

      if (v < min){
          $(this).val(min);
      } else if (v > max){
          $(this).val(max);
      }
  })
});

d3.json('/static/js/posts/gradient_descent/data.json').then(function(data) {
  chart2(data)
});