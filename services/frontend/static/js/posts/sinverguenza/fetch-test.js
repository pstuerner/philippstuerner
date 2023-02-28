
import * as d3 from "d3";
import _ from "lodash";

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

d3.json("http://localhost:8002/api/sinverguenza/timeseries").then(
    function (d) {
        var mavg = moving_average(5,0,d[0]["timeseries"].map(d=>d.Close))
        d[0]["timeseries"].map(function (d,i) {return ({"Date":d.Date, "Close": mavg[i]})})

        var i = d[Math.floor(Math.random() * d.length)];
        var data = [
          {
            id: `${i["symbol"]}-PX`,
            name: "Test",
            fillColor: "steelblue",
            values: i["timeseries"],
          },
          {
            id: `${i["symbol"]}-MAVG`,
            name: "Test-1",
            fillColor: "red",
            values: i["timeseries"].map(d => ({ ...d, Close: d.Close * 0.9 })),
          }
        ]
        var data = d;
    }
);


