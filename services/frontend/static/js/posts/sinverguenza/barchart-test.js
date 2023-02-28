import { barChart } from './barchart.js';

function createRandomList() {
  // generate a random length for the list between 10 and 20 elements
  var listLength = Math.floor(Math.random() * 91) + 10;

  // create an empty array to store the list elements
  var list = [];

  // generate a random integer between 20 and 100 for each element in the list
  for (var i = 0; i < listLength; i++) {
    list.push(Math.floor(Math.random() * 81) + 20);
  }

  return list;
}

var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'pink', 'brown', 'black'];
var highTemperatures = [77, 71, 82, 87, 84, 78, 80, 84, 86, 72, 71, 68, 75, 73, 80, 85, 86, 80];
var randomList, randomColor;

var weatherChart = barChart().data(highTemperatures);
d3.select('#weatherHistory').call(weatherChart);
weatherChart.data(createRandomList()).fillColor("green")

setInterval(function() {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
    randomList = createRandomList();
    weatherChart.data(randomList).fillColor(randomColor)
}, 5000);