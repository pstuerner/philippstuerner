import { lineChart } from './linechart.js';

window.lineCharts = [];
var assets, symbols;
var lineChartsLoaded = 0;
var loadMoreDiv = d3.select("#load-more-div");
var loadMoreButton = d3.select("#load-more");
var applyIndicatorsButton = d3.select("#apply-indicators");

function createCharts (timeseries) {
  window.lineCharts = window.lineCharts.concat(
      timeseries.map(function (d,i) {
        var asset = assets.find(x=>x.symbol==d.symbol);

        return {
        info: asset,
        chart: lineChart()
        .title(`${asset.shortName} (${asset.symbol})`)
        .width(d3.select(`#charts-container`).node().getBoundingClientRect().width)
        .height(350)
        .data([{id: "OHLCV", data: d.data, kwargs: {}}])
        .X({data: "OHLCV", key: "Date"})
        .addY([{id:"Close", data: "OHLCV", keys: ["Adj Close"]}])
      }
  }))
  
  d3
  .select("#charts-container")
  .selectAll("div")
  .data(window.lineCharts, d=>d.info.symbol)
  .join(
    enter => enter
    .append("div")
    .attr("class", "pt-5 pb-5")
    .each(function (d) {
      d3.select(this).call(d.chart)
    }),
    update => update,
    exit => exit.remove()
  )
}

function createIndicators (indicators, offset = 0) {
  for (let j = offset; j < window.lineCharts.length; j++) {
    if ((Object.keys(indicators).length === 0)) {return}
    var timeseries = window.lineCharts[j].chart.data()[0].data;
    d3.json("http://localhost:8001/sinverguenza/indicators", {
      method:"POST",
      body: JSON.stringify({
        timeseries: timeseries,
        indicators: indicators,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (r) {
      r.forEach(item => {item.data = JSON.parse(item.data)});
      
      window.lineCharts[j]
      .chart
      .data(r)
      .addY(
        r.map(d=>({id:d.id,data:d.id,keys:["all"]}))
      )
    })
  }
}

d3.select('#show-companies').on('click', function () {
  d3.json(`http://localhost:8001/sinverguenza/assets`, {
    method:"POST",
    body: JSON.stringify(filters),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(function (r) {
    window.lineCharts = [];
    d3.select("#charts-container").selectAll("div").remove();

    assets = r;
    symbols = assets.map(d=>d.symbol);
    lineChartsLoaded = 0;

    if (symbols.length > 0) {
      loadMoreDiv.style("display", "block")
    } else {
      loadMoreDiv.style("display", null)
    }
    
    d3.json(`http://localhost:8001/sinverguenza/timeseries`, {
      method:"POST",
      body: JSON.stringify({"symbols":symbols.slice(0,5)}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(function (timeseries) {
      createCharts(timeseries, lineChartsLoaded)
      createIndicators(window.indicators)
      lineChartsLoaded += 5
  });
})})


loadMoreButton.on("click", function () {
  d3.json(`http://localhost:8001/sinverguenza/timeseries`, {
      method:"POST",
      body: JSON.stringify({"symbols":symbols.slice(lineChartsLoaded,lineChartsLoaded + 5)}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(function (timeseries) {
      createCharts(timeseries, lineChartsLoaded)
      createIndicators(window.indicators,lineChartsLoaded-1)
      lineChartsLoaded += 5
  });
})

applyIndicatorsButton.on("click", function () {
  createIndicators(window.indicators)
})
