import {responsivefy} from '../../helpers.js';

if (typeof screen.orientation !== 'undefined') {} else {
    alert('Hi mobile user 👋\nThis post is not optimized for smartphones. Consider using a desktop device to get the best chart and animation experience. Apologies!')
};

d3.csv('/static/data/rf_pred.csv').then(function(dataRaw) {
    function computeConfusionMatrix (cutoff) {
        cm = {
            'tn': [], 'fp': [],
            'fn': [], 'tp': []
        };

        data.forEach(function (d) {
            let p = d['pred']>=cutoff;
            // debugger;
            if (p && d['true']==5) {
                cm.tp.push(d)
                d['bucket'] = 'tp'
            } else if (!p && !(d['true']==5)) {
                cm.tn.push(d)
                d['bucket'] = 'tn'
            } else if (p && !(d['true']==5)) {
                cm.fp.push(d)
                d['bucket'] = 'fp'
            } else {
                cm.fn.push(d)
                d['bucket'] = 'fn'
            }
        
        })
    };

    function updateMathJax () {
        const nodes = [
            document.getElementById('eq-accuracy'),
            document.getElementById('eq-precision'),
            document.getElementById('eq-recall'),
            document.getElementById('eq-f1'),
        ];
        MathJax.typesetClear(nodes);
        
        let accuracy = +((cm.tn.length+cm.tp.length)/(cm.tn.length+cm.tp.length+cm.fn.length+cm.fp.length)).toFixed(4),
            precision = +(cm.tp.length/(cm.tp.length+cm.fp.length)).toFixed(4),
            recall = +(cm.tp.length/(cm.tp.length+cm.fn.length)).toFixed(4);

        nodes[0].innerHTML = String.raw`$$\frac{${cm.tn.length}+${cm.tp.length}}{${cm.tn.length}+${cm.tp.length}+${cm.fn.length}+${cm.fp.length}} = ${accuracy}$$`
        nodes[1].innerHTML = String.raw`$$\frac{${cm.tp.length}}{${cm.tp.length}+${cm.fp.length}} = ${precision}$$`
        nodes[2].innerHTML = String.raw`$$\frac{${cm.tp.length}}{${cm.tp.length}+${cm.fn.length}} = ${recall}$$`
        nodes[3].innerHTML = String.raw`$$2*\frac{${recall}*${precision}}{${recall}+${precision}} = ${(2*(recall*precision)/(recall+precision)).toFixed(4)}$$`
        MathJax.typesetPromise(nodes).then(() => {});
    };

    function shuffleData (n) {
        data = _.shuffle(dataRaw).slice(0,n)
    }

    function updateBubbles () {
        data.forEach(function(d) {
            d['x'] = center[0];
            d['y'] = center[1];
        });

        bubbles = bubbles.data(data, function(d) { return d.i;});
        
        bubbles.exit().transition().attr("r", 0).remove();

        bubbles = bubbles.enter()
            .append("circle")
            .attr('class', 'bubble')
            .attr('id',d=>`circle-${d.i}`)
            .attr("r", function(d) {
                return radiusScale(d.pred)
            })
            .style("fill", function(d) {
                return colorScale(d.pred);
            })
            .merge(bubbles);
        
        simulation.nodes(data).on('tick',ticked);
        simulation.force("x").initialize(data);
        simulation.force("y").initialize(data);
        simulation.force("collide").initialize(data);
        simulation.alpha(0.5).alphaTarget(0.3).restart();
    }
    
    let cm, data;
    let margin = {top: 40, bottom: 40, left: 40, right: 40},
        chartWidth = d3.select('#force').node().getBoundingClientRect().width-margin.left-margin.right,
        chartHeight = d3.select('#force').node().getBoundingClientRect().height-margin.top-margin.bottom,
        center = [
            (chartWidth+margin.left+margin.right)/2,
            (chartHeight+margin.top+margin.bottom)/2,
        ];

    dataRaw.forEach(function(d){d['i']=+d['i'];d['pred']=+d['pred'];d['true']=+d['true'];});
    shuffleData(500);    
    
    var cutoffSliderSvg = d3
                .select('div#cutoff-slider')
                .append('svg')
                .attr("width", '100%')
                .attr("height", chartHeight)
                .attr("transform", `translate(0,${margin.top})`)
                .call(responsivefy),
        cutoffSliderSvgRect = cutoffSliderSvg.node().getBoundingClientRect(),
        cutoffSlider = d3
                .sliderLeft()
                .height(chartHeight*.8)
                .tickFormat(d3.format('.2'))
                .ticks(5)
                .handle(
                d3
                    .symbol()
                    .type(d3.symbolCircle)
                    .size(200)()
                )
                .on('onchange.slider', val => {
                    computeConfusionMatrix(val)
                    updateMathJax()

                    simulation.alpha(0.5).alphaTarget(0.3).restart();
                    simulation.force("x").initialize(data);
                    simulation.force("y").initialize(data);
                    simulation.force("collide").initialize(data);
                    
                    // bubbles.attr("r", function(d) { 
                    //     return radiusScale(d.pred);
                    //     }).style("fill", function(d) {
                    //     return colorScale(d.pred);
                    //     }); 
                }),
        cutOffSliderG = cutoffSliderSvg.append('g').attr('transform', `translate(${cutoffSliderSvgRect.width*2/3},${chartHeight*.1})`);
    
    cutOffSliderG.call(cutoffSlider.min(0).max(1).value(0.)).attr('id','cutoff-slider');

    var svg = d3.select("#force")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("transform", `translate(${margin.left},${margin.top})`)
    
    var radiusScale = d3.scaleLinear()
        .domain([0, 1])
        .range([5,30]);
    
    var colorScale = d3.scaleLinear()
        .domain([0,0.5,1])
        .range(["#c7e9b4","#41b6c4","#253494"]);  
    
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(function(d) {
            if (d.bucket == 'tn') {
                return chartWidth*1/4
            } else if (d.bucket == 'fp') {
                return chartWidth*3/4
            } else if (d.bucket == 'fn') {
                return chartWidth*1/4
            } else {
                return chartWidth*3/4
            }
        }).strength(0.05))
        .force("y", d3.forceY(function(d) {
                if (d.bucket == 'tn') {
                    return chartHeight*1/4
                } else if (d.bucket == 'fp') {
                    return chartHeight*1/4
                } else if (d.bucket == 'fn') {
                    return chartHeight*3/4
                } else {
                    return chartHeight*3/4
                }
            }   
        ).strength(0.05))
        .force("collide", d3.forceCollide()
        .radius(function(d) {
            return radiusScale(d.pred)
        }).strength(0.3));
    
        
    let bubbles = svg
        .selectAll("circle.bubble")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'bubble')
        .attr('id',d=>`circle-${d.i}`)
        .attr("r", function(d) {
            return radiusScale(d.pred)
        })
        .style("fill", function(d) {
            return colorScale(d.pred);
        });    
    
    // updateBubbles();
    // var labels = svg.selectAll("text")
    // .data(data.slice(0,endslice))
    // .enter()
    // .append("text")
    // .text(function(d) {
    //     return d.true;
    // })
    // .style("text-anchor","middle");
    
    simulation.nodes(data).on("tick", ticked);
    
    function ticked() {
        bubbles.attr("cx", function(d) {
            return d.x;
        }).attr("cy", function(d) {
            return d.y;
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        
        // labels.attr("x", function(d) {
        //     return d.x;
        // })
        // .attr("y", function(d) {
        //     return d.y +5;
        // })
    
    }

    // create a tooltip
    var tooltip = d3.select("#force")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

    let buttonShuffle = d3
                        .select('#button-shuffle')
                        .on("click", function (d) {
                            shuffleData(500);
                            updateBubbles();
                            cutoffSlider.value(0.51);
                            cutoffSlider.value(0.5);
                        });

    var mouseover = function(d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(d) {
        let id = this.id.split('-')[1],
            digit = data[data.findIndex(d=>d.i==id)],
            color = (digit.bucket=='tn' || digit.bucket=='tp') ? 'forestgreen' : 'crimson',
            bucketDict = {'tn': 'True Negative', 'fp': 'False Positive', 'fn': 'False Negative', 'tp': 'True Positive'};
        
        tooltip
            .html(`
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src=../static/images/mnist/${id}.png alt="Card image cap" style="margin-left:auto; margin-right:auto; width: 50%; height: 50%">
                    <div class="card-body">
                        <h5 class="card-title">Test digit #${id}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>Bucket:</b> <span style="color:${color}">${bucketDict[digit.bucket]}</span></li>
                        <li class="list-group-item"><b>Probability:</b> ${(+digit.pred*100).toFixed(2)}%</li>
                        <li class="list-group-item"><b>True label:</b> ${digit.true}</li>
                    </ul>
                </div>
            `)
            .style("left", (d3.pointer(d)[0]+margin.left) + "px")
            .style("top", (d3.pointer(d)[1]+margin.top) + "px")
    }
    var mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    cutoffSlider.value(0.5);
  });