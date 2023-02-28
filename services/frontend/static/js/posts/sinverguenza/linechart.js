const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");

function tweenDash() {
    var l = this.getTotalLength();
    return d3.interpolateString("0," + l, l + "," + l);
  }

function transition(path) {
    path.transition()
      .duration(1000)
      .attrTween("stroke-dasharray", tweenDash)
      .on("end", function () { d3.select(this).attr("stroke-dasharray", null); });
  }

const lineStyles = {
    "Close_Adj Close": {
        'stroke': 'steelblue',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    BollingerBands_mavg: {
        'stroke': 'red',
        'stroke-dasharray': '5,5',
        'stroke-width': 1
    },
    BollingerBands_hband: {
        'stroke': 'red',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    BollingerBands_lband: {
        'stroke': 'red',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    SMAIndicator_mavg: {
        'stroke': 'blue',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    EMAIndicator_mavg: {
        'stroke': 'blue',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    WMAIndicator_mavg: {
        'stroke': 'blue',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    MACD_line: {
        'stroke': 'blue',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    MACD_signal: {
        'stroke': 'blue',
        'stroke-dasharray': '',
        'stroke-width': 2
    },
    MACD_diff: {
        'stroke': 'blue',
        'stroke-dasharray': '',
        'stroke-width': 2
    }
}

// Using Mike Bostock's Towards Reusable Charts Pattern
export function lineChart() {
    // All options that should be accessible to caller
    var X = [];
    var Y = [];
    var data = [];
    var path = [];
    var removeId = "";
    var title = "Chart ()"
    var margin = { top: 20, right: 40, bottom: 20, left: 40 };
    var width = 900 - margin.left - margin.right;
    var height = 200 - margin.top - margin.bottom;
    var yExtent = [0,0];
    var xExtent = [0,0];

    var xValue = function(d) { return parseDate(d["date"]); };
    var yValue = function(d) { return d["value"]; };

    var xScale = d3.scaleTime();
    var xScaleZoom = d3.scaleTime();
    var yScale = d3.scaleLinear();
    var yScaleZoom = d3.scaleLinear();

    var xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"))
        .ticks(d3.timeMonth.filter(function(d) { return d.getMonth() == 0; }))
    var yAxis = d3.axisLeft(yScale);

    var line = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

    var updateData, updateTitle, updateWidth, updateHeight, updateX, updateY, yJoin;

    function chart(selection) {
        selection.each(function () {
            xExtent = d3.extent(X, d=>parseDate(d));
            yExtent = d3.extent(Y.map(d=>d3.extent(d.timeseries, d=>yValue(d))).flat(Infinity))
            
            xScale.range([0, width]).domain(xExtent);
            xScaleZoom.range([0, width]).domain(xExtent);
            yScale.range([height, 0]).domain(yExtent);
            yScaleZoom.range([height, 0]).domain(yExtent);

            var svg = d3.select(this).append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
            
            var clip = svg
                .append("defs")
                .append("SVG:clipPath")
                .attr("id", "clip")
                .append("SVG:rect")
                .attr("width", width + margin.left + margin.right )
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);
            
            var lines = svg.append("g").attr("clip-path", "url(#clip)")
          
            var zoom = d3.zoom()
                .scaleExtent([.5, 20])
                .on("zoom", zoomChart);
          
            svg.append("rect")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height)
                .style("fill", "none")
                .call(zoom);
            
            var xAxisG = svg.append("g").attr("transform", `translate(0, ${height})`);
            xAxisG.transition().duration(1500).call(xAxis);
              
            var yAxisG = svg.append("g");
            yAxisG.transition().duration(1500).call(yAxis);

            var headline = svg
                .append("a")
                .attr("target", "_blank")
                .attr("xlink:href", `https://finance.yahoo.com/quote/${title.match(/\(([^)]+)\)/)[1]}/`)
                .append("text")
                .text(title)
                .attr("x", (width + margin.left + margin.right) / 2)
                .attr("y", 0)
                .attr("text-anchor", "middle"); 
            
            // lines.selectAll(".line")
            //     .data(Y, d=>d.id)
            //     .join(
            //         enter => enter
            //             .append("g")
            //             .attr("class", "line")
            //             .append("path")
            //             .attr("d", d => line(d.timeseries))
            //             .style('fill', 'none')
            //             .style('stroke', d => lineStyles[d.id]['stroke'])
            //             .style('stroke-dasharray', d => lineStyles[d.id]['stroke-dasharray'])
            //             .style('stroke-width', d => lineStyles[d.id]['stroke-width'])
            //             .call(transition),
            //         update => update.select("path").attr("d", d => line(d.timeseries)),
            //         exit => {
            //             exit.transition().duration(500).select("path").style("stroke", "white")
            //             exit.transition().delay(500).remove();
            //         }
            //     )
            lines.selectAll(".line")
                .data(Y, d=>[d.id,d.kwargs])
                .join(
                    enter => enter
                        .append("g")
                        .attr("class", "line")
                        .append("path")
                        .attr("d", d => line(d.timeseries))
                        .style('fill', 'none')
                        .style('stroke', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke'])
                        .style('stroke-width', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke-width'])
                        .call(transition)
                        .style('stroke-dasharray', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke-dasharray']),
                        update => update
                            .select("path")
                            .transition()
                            .duration(1000)
                            .attr("d", d=>line(d.timeseries))
                            .attr("stroke-dasharray", null)
                            .style('stroke-dasharray', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke-dasharray']),
                    exit => {
                        exit.transition().duration(500).select("path").style("stroke", "white")
                        exit.transition().delay(500).remove();
                    }
                )
            
            updateData = function() {         
            };

            updateX = function() {
                console.log(X)
            }

            function zoomChart(event) {
                xScale.domain(event.transform.rescaleX(xScaleZoom).domain())
                yScale.domain(event.transform.rescaleY(yScaleZoom).domain())
                
                xAxisG.call(xAxis);
                yAxisG.call(yAxis);

                lines.selectAll("path").attr("d", d=>line(d.timeseries))
              }

            updateY = function() {
                yExtent = d3.extent(Y.map(d=>d3.extent(d.timeseries)).flat(Infinity))
                
                lines.selectAll(".line")
                .data(Y, d=>[d.id,d.kwargs])
                .join(
                    enter => enter
                        .append("g")
                        .attr("class", "line")
                        .append("path")
                        .attr("d", d => line(d.timeseries))
                        .style('fill', 'none')
                        .style('stroke', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke'])
                        .style('stroke-width', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke-width'])
                        .call(transition)
                        .style('stroke-dasharray', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke-dasharray']),
                    update => update
                        .select("path")
                        .transition()
                        .duration(1000)
                        .attr("d", d=>line(d.timeseries))
                        .attr("stroke-dasharray", null)
                        .style('stroke-dasharray', d => lineStyles[d.id.split("_")[0] + "_" + d.key]['stroke-dasharray']),  
                    exit => {
                        exit.transition().duration(500).select("path").style("stroke", "white")
                        exit.transition().delay(500).remove();
                    }
                )
            }

            updateWidth = function() {
            }

            updateHeight = function() {
            }

            updateTitle = function() {
                headline.text(title)
            }
        });
    }

    chart.width = function(value) {
    	if (!arguments.length) return width;
    	width = value - margin.left - margin.right;
    	if (typeof updateWidth === 'function') updateWidth();
    	return chart;
	};

    chart.height = function(value) {
    	if (!arguments.length) return height;
    	height = value - margin.top - margin.bottom;
    	if (typeof updateHeight === 'function') updateHeight();
    	return chart;
	};

    chart.title = function(value) {
    	if (!arguments.length) return title;
    	title = value;
    	if (typeof updateTitle === 'function') updateTitle();
    	return chart;
	};

    chart.data = function(value) {
    	if (!arguments.length) return data;
        value.forEach(function (d) {
            let indexData = data.findIndex(item => item.id === d.id);

            if (indexData == -1) {
                data.push({id: d.id, data: d.data, kwargs:d.kwargs})
            } else {
                data[indexData] = {id: d.id, data: d.data, kwargs:d.kwargs}
            }
        })
    	if (typeof updateData === 'function') updateData(value);
    	return chart;
	};

    chart.X = function(value) {
    	if (!arguments.length) return X;
        let index = data.findIndex(item => item.id === value.data);
    	X = data[index].data.map(d=>d[value.key]);
    	if (typeof updateX === 'function') updateX();
    	return chart;
	};

    chart.Y = function(value) {
        if (!arguments.length) return Y;
        return chart
    }

    chart.addY = function(value) {
    	if (!arguments.length) return Y;
        value.forEach(function (d) {
            let indexData = data.findIndex(item => item.id === d.data);
            
            let indexY, keys, timeseries;

            if (JSON.stringify(d.keys) === JSON.stringify(["all"])) {
                keys = Object.keys(data[indexData].data[0]);
            } else {
                keys = d.keys;
            }
            console.log(Y)
            keys.forEach(function (key) {
                indexY = Y.findIndex(item => item.id === d.id && item.key === key);
                timeseries = data[indexData].data.map(item=>item[key]).map((v, index) => ({date: X[index], value: v})).filter(x=>x.value!==null);
                
                if (indexY == -1) {
                    Y.push({id:d.id, key: key, kwargs: data[indexData].kwargs, timeseries:timeseries})
                } else {
                    Y[indexY] = {id:d.id, key: key, kwargs: data[indexData].kwargs, timeseries:timeseries}
                }
            })
        })
    	if (typeof updateY === 'function') updateY();
    	return chart;
	};

    chart.removeY = function(value) {
    	if (!arguments.length) return Y;
        
        for (let i = 0; i < data.length; i++) {
            let newObj = Object.assign({}, ...Object.keys(data[i]).filter(k => !k.startsWith(value)).map(k => ({[k]: data[i][k]})));
            data[i] = newObj;
        }
        Y = Y.filter(item => !item.id.startsWith(value));
        
    	if (typeof updateY === 'function') updateY();
    	return chart;
	};
    
    return chart;
}
    
