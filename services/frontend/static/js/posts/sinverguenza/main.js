import Plotly from 'plotly.js-dist';
import * as d3 from 'd3';
// import * as d3 from 'd3';

window.charts = [];

var assets, symbols, lineChartsLoaded;
var showCompaniesButton = d3.select("#show-companies");
var loadMoreDiv = d3.select("#load-more-div");
var loadMoreButton = d3.select("#load-more");
var applyIndicatorsButton = d3.select("#apply-indicators");

const gridExtent = ["MACD"];

const traceStyles = {
  BollingerBands_mavg: {
    mode: "lines",
    line: {shape: 'linear', color: "orange", dash: "dashdot", width: 1},
    showlegend: true
  },
  BollingerBands_hband: {
    mode: "lines",
    line: {shape: 'linear', color: "orange", dash: "solide", width: 2},
    showlegend: false
  },
  BollingerBands_lband: {
    mode: "lines",
    line: {shape: 'linear', color: "orange", dash: "solide", width: 2},
    showlegend: false
  },
  SMAIndicator_mavg: {
    mode: "lines",
    line: {shape: 'linear', color: "red", dash: "solide", width: 2},
    showlegend: true
  },
  EMAIndicator_mavg: {
    mode: "lines",
    line: {shape: 'linear', color: "green", dash: "solide", width: 2},
    showlegend: true
  },
  WMAIndicator_mavg: {
    mode: "lines",
    line: {shape: 'linear', color: "blue", dash: "solide", width: 2},
    showlegend: true
  },
  MACD_line: {
    mode: "lines",
    line: {shape: 'linear', color: "red", dash: "solide", width: 2},
    showlegend: true
  },
  MACD_signal: {
    mode: "lines",
    line: {shape: 'linear', color: "blue", dash: "solide", width: 2},
    showlegend: false
  },
  MACD_diff: {
    mode: "lines",
    line: {shape: 'linear', color: "green", dash: "solide", width: 2},
    showlegend: false
  },
}

function createChart (info, ohlcv) {
  d3
  .select("#charts-container")
  .append("div")
  .attr("class", "pt-5 pb-5")
  .attr("id", info.symbol);

  var chart = {
      info: info,
      OHLCV: ohlcv,
      data: [
          {
              name: "Adj Close",
              x: ohlcv.map(d=>d.Date),
              y: ohlcv.map(d=>d["Adj Close"]),
              meta: {kwargs: {}, id: "Adj Close"},
              xaxis: "x1",
              yaxis: "y1"
          }
      ],
      layout: {
          height: 500,
          title: `<a href="https://finance.yahoo.com/quote/${info.symbol}/" target="_blank">${info.shortName} (${info.symbol})</a>`,
          dragmode: "pan",
          grid: {
            rows: 1, columns: 1, pattern: "independent"
          },
          margin: {'t': 50}
      },
      config: {
          scrollZoom: true
      }
  };

  window.charts.push(chart);
  Plotly.newPlot(info.symbol, chart.data, chart.layout, chart.config);
}

function createIndicators (indicators, offset = 0) {
  for (let j = offset; j < window.charts.length; j++) {
    if ((Object.keys(indicators).length === 0)) {return}
    var timeseries = window.charts[j].OHLCV;
    d3.json("https://api.philippstuerner.com/sinverguenza/indicators", {
      method:"POST",
      body: JSON.stringify({
        timeseries: timeseries,
        indicators: indicators,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (r) {
      var chart = window.charts[j];
      var data = chart.data;
      var symbol = chart.info.symbol;

      r.forEach(function (item) {
        item.data = JSON.parse(item.data);
        var indices = data.map((dictionary, index) => {
          return dictionary.meta.id === item.id ? index : -1;
        }).filter(index => index !== -1);
        
        if (indices.length) {
          if (JSON.stringify(item.kwargs) != JSON.stringify(data[indices[0]].meta.kwargs)) {
            var update = {name: [], y: [], meta: []};
            Object.keys(item.data[0]).forEach(function (key) {
              update.name.push(`${item.id.split('_')[0]}(${Object.values(item.kwargs).join(',')})`)
              update.y.push(item.data.map(d=>d[key]))
              update.meta.push({kwargs: item.kwargs, id: item.id})
            })  
            Plotly.restyle(symbol, update, indices);
            // Plotly.restyle(symbol, {name: [`${item.id.split('_')[0]}(${Object.values(item.kwargs).join(',')})`], y: [item.data.map(d=>d.mavg)], meta: [{kwargs: item.kwargs, id: item.id}]}, [i]);
          } else {
            console.log("exists & unchanged")
          }
        } else {
          var indicator = item.id.split('_')[0];
          var traces = [];
          var yAxis = "yaxis1";
          var xAxis = "xaxis1";
          var existingAxes = Object
            .keys(chart.layout)
            .filter(key => key.startsWith('yaxis'))
            .map(key => key === "yaxis" ? "yaxis" : `yaxis${parseInt(key.match(/\d+/)[0])}`);
          var rows = chart.layout.grid.rows;
          var height = chart.layout.height;

          if (gridExtent.includes(indicator)) {
            rows += 1;
            yAxis = `yaxis${rows}`;
            xAxis = `xaxis${rows}`;
            existingAxes.push(yAxis);
            
            var subplotHeight = (height - height / 2) / (rows - 1);
            chart.layout.grid.rows = rows;
            chart.layout[yAxis] = {};
            chart.layout[xAxis] = {matches: "x"};

            for (let i = 0; i < existingAxes.length; i++) {
              let begin = i === 0 ? height / 2 : height - (i + 1) * subplotHeight;
              let end = begin + subplotHeight;
              chart.layout[existingAxes[i]]["domain"] = [begin, end]
            }

            Plotly.relayout(symbol, chart.layout);
          }

          Object.keys(item.data[0]).forEach(function (key) {
            traces.push(
              Object.assign({},
                {
                  x: chart.OHLCV.map(d=>d.Date),
                  y: item.data.map(d=>d[key]),
                  xaxis: xAxis.replace("axis", ""),
                  yaxis: yAxis.replace("axis", ""),
                  meta: {kwargs: item.kwargs, id: item.id, axis: rows},
                  name: `${indicator}(${Object.values(item.kwargs).join(',')})`
                },
                traceStyles[`${indicator}_${key}`]
                )
              )
          })

          Plotly.addTraces(symbol, traces)
        }
      });
    })
  }
}


showCompaniesButton.on('click', function () {
    d3.json(`https://api.philippstuerner.com/sinverguenza/assets`, {
      method:"POST",
      body: JSON.stringify(window.filters),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(function (r) {
      window.charts = [];
      d3.select("#charts-container").selectAll("div").remove();
  
      assets = r;
      symbols = assets.map(d=>d.symbol);
      lineChartsLoaded = 0;
  
      if (symbols.length > 0) {
        loadMoreDiv.style("display", "block")
      } else {
        loadMoreDiv.style("display", null)
      }
      
      d3.json(`https://api.philippstuerner.com/sinverguenza/timeseries`, {
        method:"POST",
        body: JSON.stringify({"symbols":symbols.slice(0,5)}),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(function (timeseries) {
        timeseries.forEach(function (t) {
            var info = assets.filter(d=>d.symbol == t.symbol)[0];
            var ohlcv = t.data;

            createChart(info, ohlcv);
        })
        
        createIndicators(window.indicators)
        lineChartsLoaded += 5
    });
  })})

loadMoreButton.on("click", function () {
  d3.json(`https://api.philippstuerner.com/sinverguenza/timeseries`, {
      method:"POST",
      body: JSON.stringify({"symbols":symbols.slice(lineChartsLoaded,lineChartsLoaded + 5)}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(function (timeseries) {
      timeseries.forEach(function (t) {
          var info = assets.filter(d=>d.symbol == t.symbol)[0];
          var ohlcv = t.data;

          createChart(info, ohlcv);
      })
      
      createIndicators(window.indicators, lineChartsLoaded-1)
      lineChartsLoaded += 5
  });
})

applyIndicatorsButton.on("click", function () {
  createIndicators(window.indicators)
})