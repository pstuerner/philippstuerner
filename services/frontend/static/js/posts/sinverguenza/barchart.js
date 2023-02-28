// Using Mike Bostock's Towards Reusable Charts Pattern
export function barChart() {
 
    // All options that should be accessible to caller
    var data = [];
    var width = 900;
    var height = 200;
    var barPadding = 1;
    var fillColor = 'steelblue';

    var updateData;
    var updateWidth;
    var updateFillColor;
    
    function chart(selection){
        selection.each(function () {
            var barSpacing = height / data.length;
            var barHeight = barSpacing - barPadding;
            var maxValue = d3.max(data);
            var widthScale = width / maxValue;
            var svg = d3.select(this).append('svg').attr('height', height).attr('width', width);
            var bars = svg
                .selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('y', function (d, i) { return i * barSpacing })
                .attr('height', barHeight)
                .attr('x', 0)
                .attr('width', function (d) { return d*widthScale})
                .style('fill', fillColor);

            updateData = function() {
                barSpacing = height / data.length;
                barHeight = barSpacing - barPadding;
                maxValue = d3.max(data);
                widthScale = width / maxValue;
                
                bars = svg
                .selectAll('rect')
                .data(data)
                .join(
                    enter => enter
                        .append('rect')
                        .transition().duration(1000)
                        .attr('y', function (d, i) { return i * barSpacing })
                        .attr('height', barHeight)
                        .attr('x', 0)
                        .attr('width', function (d) { return d*widthScale}),
                    update => update
                        .transition().duration(1000)
                        .attr('y', function (d, i) { return i * barSpacing })
                        .attr('height', barHeight)
                        .attr('x', 0)
                        .attr('width', function (d) { return d*widthScale}),
                    exit => exit.remove()
                )
            };

            updateWidth = function() {
                widthScale = width / maxValue;
                bars.transition().duration(1000).attr('width', function(d) { return d*widthScale});
                svg.transition().duration(1000).attr('width', width);
            };

            updateFillColor = function() {
                bars.transition().duration(1000).style('fill', fillColor);
            };
        });
    }

    chart.width = function(value) {
    	if (!arguments.length) return width;
    	width = value;
    	if (typeof updateWidth === 'function') updateWidth();
    	return chart;
	};

    chart.data = function(value) {
    	if (!arguments.length) return data;
    	data = value;
    	if (typeof updateData === 'function') updateData();
    	return chart;
	};

    chart.fillColor = function(value) {
    	if (!arguments.length) return fillColor;
    	fillColor = value;
    	if (typeof updateFillColor === 'function') updateFillColor();
    	return chart;
	};

    return chart;
}
