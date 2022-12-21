const vocabs = [
    {'sp': 'el, la', 'en': 'the (+m, f)'},
    {'sp': 'de', 'en': 'of, from'},
    {'sp': 'que', 'en': 'that, which'},
    {'sp': 'y', 'en': 'and'},
    {'sp': 'en', 'en': 'in, on'},
    {'sp': 'un', 'en': 'a, an'},
    {'sp': 'ser', 'en': 'to be (norm)'},
    {'sp': 'a', 'en': 'to, at'},
    {'sp': 'él', 'en': 'he, [ellos] them (m)'},
    {'sp': 'lo', 'en': 'the (+neut)'},
    {'sp': 'no', 'en': 'no'},
    {'sp': 'su', 'en': 'his/her/their/your (–fam)'},
    {'sp': 'haber', 'en': 'to have (+Ved)'},
    {'sp': 'con', 'en': 'with'},
    {'sp': 'por', 'en': 'by, for, through'},
    {'sp': 'para', 'en': 'for, to, in order to'},
    {'sp': 'mí', 'en': 'me (obj prep)'},
    {'sp': 'lo', 'en': '[3rd person] (dir obj-m)'},
    {'sp': 'tener', 'en': 'to have'},
    {'sp': 'como', 'en': 'like, as'},
    {'sp': 'estar', 'en': 'to be (location, change from norm)'},
    {'sp': 'me', 'en': 'me (obj)'},
    {'sp': 'más', 'en': 'more'},
    {'sp': 'este', 'en': 'this (m) [esta (f)]'},
    {'sp': 'le', 'en': '[3rd person] (indir obj)'},
    {'sp': 'hacer', 'en': 'to do, make'},
    {'sp': 'se', 'en': '[“reflexive” marker]'},
    {'sp': 'yo', 'en': 'I (subj)'},
    {'sp': 'o', 'en': 'or'},
    {'sp': 'pero', 'en': 'but, yet, except'},
    {'sp': 'decir', 'en': 'to tell, say'},
    {'sp': 'poder', 'en': 'to be able to, can'},
    {'sp': 'ir', 'en': 'to go'},
    {'sp': 'ese', 'en': 'that (m) [esa (f)]'},
    {'sp': 'otro', 'en': 'other, another'},
    {'sp': 'si', 'en': 'if, whether'},
    {'sp': 'mi', 'en': 'my'},
    {'sp': 'ver', 'en': 'to see'},
    {'sp': 'ya', 'en': 'already, still'},
    {'sp': 'porque', 'en': 'because'},
    {'sp': 'mucho', 'en': 'much, many, a lot (ADV)'},
    {'sp': 'dar', 'en': 'to give'},
    {'sp': 'muy', 'en': 'very, really'},
    {'sp': 'saber', 'en': 'to know (a fact), find out'},
    {'sp': 'sí', 'en': 'yes'},
    {'sp': 'año', 'en': 'year'},
    {'sp': 'ti', 'en': 'you (obj prep-sg/+fam)'},
    {'sp': 'te', 'en': 'you (obj/+fam)'},
    {'sp': 'también', 'en': 'also'},
    {'sp': 'qué', 'en': 'what?, which?, how (+ADJ)!'},
    {'sp': 'alguno', 'en': 'some, a few'},
    {'sp': 'nos', 'en': 'us (obj)'},
    {'sp': 'tu', 'en': 'your (+fam)'},
    {'sp': 'sin', 'en': 'without'},
    {'sp': 'mismo', 'en': 'same'},
    {'sp': 'eso', 'en': 'that (n)'},
    {'sp': 'cuando', 'en': 'when'},
    {'sp': 'querer', 'en': 'to want, love'},
    {'sp': 'vez', 'en': 'time (specific occurrence); en v. de:'},
    {'sp': 'hasta', 'en': 'until, up to, even (ADV)'},
    {'sp': 'la', 'en': '[3rd person] (dir obj-f)'},
    {'sp': 'sobre', 'en': 'on top of, over, about'},
    {'sp': 'entre', 'en': 'between, among'},
    {'sp': 'dos', 'en': 'two'},
    {'sp': 'día', 'en': 'day'},
    {'sp': 'grande', 'en': 'large, great, big'},
    {'sp': 'así', 'en': 'like that'},
    {'sp': 'pasar', 'en': 'to pass, spend (time)'},
    {'sp': 'cosa', 'en': 'thing'},
    {'sp': 'desde', 'en': 'from, since'},
    {'sp': 'deber', 'en': 'should, ought to; to owe'},
    {'sp': 'ella', 'en': 'she, [ellas] them (f)'},
    {'sp': 'pues', 'en': 'then, well then'},
    {'sp': 'entonces', 'en': 'so, then'},
    {'sp': 'llegar', 'en': 'to arrive'},
    {'sp': 'poco', 'en': 'little, few, a little bit (adv)'},
    {'sp': 'nuestro', 'en': 'our'},
    {'sp': 'bien', 'en': 'well'},
    {'sp': 'ni', 'en': 'not even, neither, nor'},
    {'sp': 'tiempo', 'en': 'time (general)'},
    {'sp': 'ahora', 'en': 'now'},
    {'sp': 'primero', 'en': 'first'},
    {'sp': 'creer', 'en': 'to believe, think'},
    {'sp': 'donde', 'en': 'where'},
    {'sp': 'vida', 'en': 'life'},
    {'sp': 'dejar', 'en': 'to let, leave'},
    {'sp': 'nada', 'en': 'nothing, (not) at all'},
    {'sp': 'tanto', 'en': 'so much, so many'},
    {'sp': 'parecer', 'en': 'to seem, look like'},
    {'sp': 'hablar', 'en': 'to speak, talk'},
    {'sp': 'poner', 'en': 'to put (on), get (+ADJ)'},
    {'sp': 'parte', 'en': 'part, portion'},
    {'sp': 'eh', 'en': 'eh'},
    {'sp': 'nuevo', 'en': 'new'},
    {'sp': 'sólo', 'en': 'only, just'},
    {'sp': 'siempre', 'en': 'always, forever'},
    {'sp': 'hombre', 'en': 'man, mankind, husband'},
    {'sp': 'bueno', 'en': 'well . . .'},
    {'sp': 'seguir', 'en': 'to follow, keep on'},
    {'sp': 'quedar', 'en': 'to remain, stay'}
];
const margin = { top: 40, bottom: 40, left: 40, right: 40 };
const chartWidthEn = d3.select("#vocabs-en").node().getBoundingClientRect().width - margin.left - margin.right;
const chartHeightEn = d3.select("#vocabs-en").node().getBoundingClientRect().height - margin.top - margin.bottom;
const chartWidthSp = d3.select("#vocabs-sp").node().getBoundingClientRect().width - margin.left - margin.right;
const chartHeightSp = d3.select("#vocabs-sp").node().getBoundingClientRect().height - margin.top - margin.bottom;

const svgEn = d3
    .select("#vocabs-en")
    .append("svg")
    .attr("width", chartWidthEn + margin.left + margin.right)
    .attr("height", chartHeightEn + margin.top + margin.bottom),
    svgSp = d3
    .select("#vocabs-sp")
    .append("svg")
    .attr("width", chartWidthSp + margin.left + margin.right)
    .attr("height", chartHeightSp + margin.top + margin.bottom);

var widthEn = +svgEn.attr("width"),
    heightEn = +svgEn.attr("height"),
    gEn = svgEn.append("g").attr("transform", "translate(32," + (heightEn / 2) + ")"),
    widthSp = +svgSp.attr("width"),
    heightSp = +svgSp.attr("height"),
    gSp = svgSp.append("g").attr("transform", "translate(32," + (heightSp / 2) + ")");

function update(obj, data) {
var t = d3.transition()
    .duration(750);

// JOIN new data with old elements.
var text = obj.selectAll("text")
    .data(data, function(d) { return d; });

// EXIT old elements not present in new data.
text.exit()
    .attr("class", "exit")
    .transition(t)
    .attr("y", 60)
    .style("fill-opacity", 1e-6)
    .remove();

// UPDATE old elements present in new data.
text.attr("class", "update")
    .attr("y", 0)
    .style("fill-opacity", 1)
    .transition(t)
    .attr("x", function(d, i) { return i * 32; });

// ENTER new elements present in new data.
text.enter().append("text")
    .attr("class", "enter")
    .attr("dy", ".35em")
    .attr("y", -60)
    .attr("x", function(d, i) { return i * 32; })
    .style("fill-opacity", 1e-6)
    .text(function(d) { return d; })
    .transition(t)
    .attr("y", 0)
    .style("fill-opacity", 1);
}

// The initial display.
var i = _.random(0, vocabs.length);
update(gEn, vocabs[i]["en"]);
update(gSp, vocabs[i]["sp"]);

// Grab a random sample of letters from the alphabet, in alphabetical order.
d3.interval(function() {
    i = _.random(0, vocabs.length);
    update(gEn, vocabs[i]["en"]);
    update(gSp, vocabs[i]["sp"]);
}, 1000);