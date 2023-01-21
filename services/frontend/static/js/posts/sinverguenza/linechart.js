// parse the date and close values
const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");

// function tweenDashIn() {
//     const l = this.getTotalLength(),
//         i = d3.interpolateString("0," + l, l + "," + l);
//     return function(t) { return i(t) };
//   }

// function transitionIn(path) {
//     path.transition()
//         .duration(1500)
//         .attrTween("stroke-dasharray", tweenDashIn)
//         .on("end", () => { d3.select(this).call(transitionIn); });
//   }

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
    Close: {
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

    var updateData, updateTitle, updateWidth, updateHeight, addPath, updatePath, removePath, updateX, updateY, yJoin;

    function chart(selection) {
        selection.each(function () {
            xExtent = d3.extent(X, d=>parseDate(d));
            yExtent = d3.extent(Y.map(d=>d3.extent(d.timeseries)).flat(Infinity))
            
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
                .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
                // .extent([[0, 0], [width, height]])
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
            yJoin = Y.map(item => {
                let newTimeseries = item.timeseries.map((value, index) => ({date: X[index], value: value})).filter(d=>d.value!==null);
                return {id: item.id, timeseries: newTimeseries, color: item.color};
            });
            
            lines.selectAll(".line")
                .data(yJoin, d=>d.id)
                .join(
                    enter => enter
                        .append("g")
                        .attr("class", "line")
                        .append("path")
                        .attr("d", d => line(d.timeseries))
                        .style('fill', 'none')
                        .style('stroke', d => lineStyles[d.id]['stroke'])
                        .style('stroke-dasharray', d => lineStyles[d.id]['stroke-dasharray'])
                        .style('stroke-width', d => lineStyles[d.id]['stroke-width'])
                        .call(transition),
                    update => update.select("path").attr("d", d => line(d.timeseries)),
                    exit => {
                        exit.transition().duration(500).select("path").style("stroke", "white")
                        exit.transition().delay(500).remove();
                    }
                )
            
            updateData = function(value) {                
                data.forEach((item,index) => {
                    Object.assign(item, value[index]);
                  });
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
                // yScale.range([height, 0]).domain(yExtent);
                // yAxisG.transition().duration(1500).call(yAxis);
                
                yJoin = Y.map(item => {
                    let newTimeseries = item.timeseries.map((value, index) => ({date: X[index], value: value})).filter(d=>d.value!==null);
                    return {id: item.id, timeseries: newTimeseries, color: item.color};
                });
                
                lines.selectAll(".line")
                .data(yJoin, d=>d.id)
                .join(
                    enter => enter
                        .append("g")
                        .attr("class", "line")
                        .append("path")
                        .attr("d", d => line(d.timeseries))
                        .style('fill', 'none')
                        .style('stroke', d => lineStyles[d.id.replace(/\(.*?\)/g, "")]['stroke'])
                        .style('stroke-width', d => lineStyles[d.id.replace(/\(.*?\)/g, "")]['stroke-width'])
                        .call(transition)
                        .style('stroke-dasharray', d => lineStyles[d.id.replace(/\(.*?\)/g, "")]['stroke-dasharray']),
                    update => update.select("path").attr("d", d=>line(d.timeseries)),  
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

            addPath = function() {
                data.push(path);
                updateData();
            }

            updatePath = function (name, values) {
                data.forEach(obj => {
                    if (obj.name === name) {
                      obj.values = values;
                    }
                });
                updateData()
            }

            removePath = function () {
                data.splice(data.findIndex(d => d.id === removeId), 1);
                updateData()
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
        if (data.length == 0) {data = value}
    	if (typeof updateData === 'function') updateData(value);
    	return chart;
	};

    chart.X = function(value) {
    	if (!arguments.length) return X;
    	X = data.map(d=>d[value]);
    	if (typeof updateX === 'function') updateX();
    	return chart;
	};


    chart.Y = function(value) {
    	if (!arguments.length) return Y;
        Y = Y.concat(value.map(x=>({id:x.id,timeseries:data.map(d=>d[x.timeseries]),color:x.color})));
        // Y = value.map(x=>({id:x.id,timeseries:data.map(d=>d[x.timeseries]),color:x.color}));
    	if (typeof updateY === 'function') updateY();
    	return chart;
	};

    chart.addPath = function(value) {
    	if (!arguments.length) return path;
    	path = value;
    	if (typeof addPath === 'function') addPath();
    	return chart;
	};

    chart.updatePath = function(name, values) {
    	if (typeof updatePath === 'function') updatePath(name, values);
    	return chart;
	};


    chart.removePath = function(value) {
    	if (!arguments.length) return removeId;
    	removeId = value;
    	if (typeof removePath === 'function') removePath();
    	return chart;
	};
    
    return chart;
}
    
