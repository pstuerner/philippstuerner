function latexifyMatrix (matrix, rows, cols, row_dots=false, col_dots=false, ddot=false) {
    let matrixSmall = [];
  
    row_dots = !(row_dots===false) ? row_dots -1 : row_dots;
    col_dots = !(col_dots===false) ? col_dots - 1 : col_dots;
    // debugger;
    for (let r=0; r<rows; ++r) {
      if (cols > 1) {
        matrixSmall.push(math.subset(math.row(matrix,r),math.index(0,_.range(cols))).valueOf()[0])
      } else {
        matrixSmall.push([math.row(matrix,r)])
      }
    }
  
    matrixSmall = math.matrix(matrixSmall)
    
    if (!(row_dots===false)) {
      let dot_cell = cols % 2 == 0 ? cols/2 : Math.round(cols/2)-1;
      for (let c=0;c<cols;++c) {
        if (!(c==dot_cell)) {
          matrixSmall._data[row_dots][c] = null
        } else {
          matrixSmall._data[row_dots][c] = 999
        }
      }
    }
    
    if (!(col_dots===false)) {
      let dot_cell = rows % 2 == 0 ? rows/2 : Math.round(rows/2)-1;
      for (let r=0;r<rows;++r) {
        if (!(r==dot_cell)) {
          matrixSmall._data[r][col_dots] = null
        } else {
          matrixSmall._data[r][col_dots] = -999
        }
      }
    }
  
    if (ddot) {
      matrixSmall._data[rows-1][cols-1] = 1530
    }
  
    let matrixStr = math.matrix(matrixSmall).toString()
    let matrixTex = math.parse(matrixStr).toTex().replaceAll('null','').replace('-999','\\dots').replace('999','\\vdots').replace('1530','\\ddots')
  
    return matrixTex
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

export {responsivefy, arrAvg, latexifyMatrix}