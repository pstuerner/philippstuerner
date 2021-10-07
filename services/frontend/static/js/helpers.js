function sliders() {
    var width = 400,
        height = 200,
        n = 1,
        pos = 1,
        id = "slider-id",
        prefix = "val = ",
        min = 0,
        max = 100,
        padding = .05;
    
    function mySlider(selection) {
        selection.each(function(data) {
            function update(h) {
                // update position and text of label according to slider scale
                handle.attr("cx", xScale(h));                
                label.selectAll('svg').remove();
                label.append(() => MathJax.tex2svg(String.raw`${data.prefix}${h.toFixed(1)}`).querySelector("svg"));
                var labelWidth = label.select('svg').node().getBoundingClientRect().width
                label.attr("transform", `translate(${Math.min(xScale(data.max)-labelWidth, xScale(h))}, ${-35})`);
                label.attr("value", h);
                }

            var sliderWidth = width / n - 2 * (width / n) * padding;
            var xPos = width / n * (data.pos - 1) + (width / n) * padding;
            var yPos = height / 2;

            var xScale = d3.scaleLinear().range([0, sliderWidth]).domain([data.min, data.max]).clamp(true);
            var svg = d3.select(this);
            var slider = svg.append("g")
                            .attr("class", "slider")
                            .attr("id", data.id)
                            .attr("transform", "translate(" + xPos + "," + yPos + ")");

            slider.append("line")
                .attr("class", "track")
                .attr("x1", xScale.range()[0])
                .attr("x2", xScale.range()[1])
                .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-inset")
                .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-overlay")
                .call(d3.drag()
                    .on("start.interrupt", function() { slider.interrupt(); })
                    .on("start drag", function(event) {
                        var currentValue = event.x;
                        update(xScale.invert(currentValue)); 
                    })
                );

            slider.insert("g", ".track-overlay")
                .attr("class", "ticks")
                .attr("transform", "translate(0," + 18 + ")")
                .selectAll("text")
                .data(xScale.ticks(10))
                .enter()
                .append("text")
                .attr("x", xScale)
                .attr("y", 10)
                .attr("text-anchor", "middle")
                .text(function(d) { return d; });
                
            var handle = slider.insert("circle", ".track-overlay")
                            .attr("class", "handle")
                            .attr("r", 9);
                            
            var label = slider.append('g');
            label
            .append(() => MathJax.tex2svg(String.raw`${data.prefix}${data.min.toFixed(1)}`)
                                .querySelector("svg"))
                                .attr("transform", `translate(${-10}, ${-35})`);                        
        })
    }
  
    mySlider.width = function(value) {
      if (!arguments.length) return width;
      width = value;
      return mySlider;
    };

    mySlider.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return mySlider;
      };

    mySlider.min = function(value) {
        if (!arguments.length) return min;
        min = value;
        return mySlider;
      };

    mySlider.max = function(value) {
        if (!arguments.length) return max;
        max = value;
        return mySlider;
    };

    mySlider.n = function(value) {
        if (!arguments.length) return n;
        n = value;
        return mySlider;
    };

    mySlider.pos = function(value) {
        if (!arguments.length) return pos;
        pos = value;
        return mySlider;
    };

    mySlider.id = function(value) {
        if (!arguments.length) return id;
        id = value;
        return mySlider;
    };

    mySlider.prefix = function(value) {
        if (!arguments.length) return prefix;
        prefix = value;
        return mySlider;
    };
  
    return mySlider;
  }


function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

function arrAvg(arr) {
    return arr.reduce((a,b) => a + b, 0) / arr.length;
}

export {responsivefy, sliders, arrAvg}