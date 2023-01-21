import { lineChart } from './linechart.js';

function sum(numbers) {
  return _.reduce(numbers, (a, b) => a + b, 0);
}

function average(numbers) {
  return sum(numbers) / (numbers.length || 1);
}

function make_window(before, after) {
  return function (_number, index, array) {
    const start = Math.max(0, index - before);
    const end   = Math.min(array.length, index + after + 1);
    return _.slice(array, start, end);
  }
}

function moving_average(before, after, numbers) {
  return _.chain(numbers)
          .map(make_window(before, after))
          .map(average)
          .value();
}

var lineCharts = [];
var assets, symbols;
var lineChartsLoaded = 0;
var loadMoreDiv = d3.select("#load-more-div");
var loadMoreButton = d3.select("#load-more");
var applyIndicatorsButton = d3.select("#apply-indicators");

function createCharts (timeseries) {
  lineCharts = lineCharts.concat(
      timeseries.map(function (d,i) {
        var asset = assets.find(x=>x.symbol==d.symbol);

        return {
        info: asset,
        chart: lineChart()
        .title(`${asset.shortName} (${asset.symbol})`)
        .width(d3.select(`#charts-container`).node().getBoundingClientRect().width)
        .height(250)
        .data(d.data)
        .X("Date")
        .Y([{id:"Close",timeseries:"Adj Close",color:"steelblue"}])
      }
  }))
  
  d3
  .select("#charts-container")
  .selectAll("div")
  .data(lineCharts, d=>d.info.symbol)
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
  for (let j = offset; j < lineCharts.length; j++) {
    var timeseries = lineCharts[j].chart.data().map(d=>({"Adj Close": d["Adj Close"]}));
    d3.json("https://api.philippstuerner.com/sinverguenza/indicators", {
      method:"POST",
      body: JSON.stringify({
        symbol: lineCharts[j].info.symbol,
        timeseries: timeseries,
        indicators: indicators,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (r) {
      var d = JSON.parse(r)
      lineCharts[j]
      .chart
      .data(d)
      .Y(
        Object.entries(d[0]).map(([key, value,], i) => ({id:key,timeseries:key,color:"red"}))
      )
    })
  }
}

d3.select('#show-companies').on('click', function () {
  d3.json(`https://api.philippstuerner.com/sinverguenza/assets`, {
    method:"POST",
    body: JSON.stringify(filters),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(function (r) {
    lineCharts = [];
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
      createCharts(timeseries, lineChartsLoaded)
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
      createCharts(timeseries, lineChartsLoaded)
      createIndicators(window.indicators,lineChartsLoaded-1)
      lineChartsLoaded += 5
  });
})

applyIndicatorsButton.on("click", function () {
  createIndicators(window.indicators)
})

// d3.json("http://localhost:8002/api/sinverguenza/timeseries").then(
//     function (d) {
      
//   }
// );

      // d3.select('#lineChart').call(chart);
      // setInterval(function() {
      //     var i = d[Math.floor(Math.random() * d.length)];
          // var data_0 = [
          //   {
          //     id: `${i["symbol"]}-PX`,
          //     name: "Test",
          //     fillColor: "steelblue",
          //     values: i["timeseries"],
          //   }
          // ]
      //     var data_1 = {
      //       id: `${i["symbol"]}-MAVG`,
      //       name: "Test-1",
      //       fillColor: "red",
      //       values: i["timeseries"].map(d => ({ ...d, Close: d.Close * 0.9 }))
      //     }
          
          
      //     chart.data(data_0)
      //     setTimeout(function () {
      //       chart.addPath(data_1)
      //       setTimeout(function () {
      //         chart.removePath(`${i["symbol"]}-MAVG`)
      //       }, 2000)
      //     }, 1000)
      //     // var mavg = moving_average(30,0,i["timeseries"].map(d=>d.Close))
      //     // chart.data(i["timeseries"]).data(i["timeseries"].map(function (d,i) {return ({"Date":d.Date, "Close": mavg[i]})}))
      // }, 5000);

// d3.select("#times-checkbox")
//   .on("change", function() {
//     var spinnerValue = Number(d3.select('#times-spinner').property("value"));

//     for (let i = 0; i < lineCharts.length; i++) {
//       if (this.checked) {
//         lineCharts[i].addPath(
//           {
//             name: "MAVG",
//             fillColor: "red",
//             values: lineCharts[i].data()[0]["values"].map(d => ({ ...d, Close: d.Close * spinnerValue }))
//           }
//         )
//       } else {
//         lineCharts[i].removePath("MAVG")
//       }
//     }
//   });

//   d3.select("#times-spinner")
//   .on("change", function() {
//     var spinnerValue = Number(d3.select(this).property("value"));
//     var spinnerChecked = d3.select("#times-checkbox").property("checked");
//     if (spinnerChecked) {
//       for (let i = 0; i < lineCharts.length; i++) {
//         lineCharts[i].updatePath(
//           "MAVG",
//           lineCharts[i].data()[0]["values"].map(d=>{return {...d, Close: d.Close * spinnerValue}})
//         )}
//       }
//     }
//   )
