const vocabs = [
    {'sp': 'tener', 'en': 'to have'},
    {'sp': 'porque', 'en': 'because'},
    {'sp': 'llegar', 'en': 'to arrive'},
    {'sp': 'primero', 'en': 'first'},
    {'sp': 'donde', 'en': 'where'},
    {'sp': 'bueno', 'en': 'well . . .'},
    {'sp': 'encontrar', 'en': 'to find'},
    {'sp': 'pensar', 'en': 'to think'},
    {'sp': 'persona', 'en': 'person'},
    {'sp': 'después', 'en': 'after'},
    {'sp': 'venir', 'en': 'to come'},
    {'sp': 'mundo', 'en': 'world'},
    {'sp': 'claro', 'en': 'clear'},
    {'sp': 'gente', 'en': 'people'},
    {'sp': 'cuándo', 'en': 'when?'},
    {'sp': 'durante', 'en': 'during'},
    {'sp': 'vivir', 'en': 'to live'},
    {'sp': 'problema', 'en': 'problem'},
    {'sp': 'presidente', 'en': 'president'},
    {'sp': 'junto', 'en': 'together'},
    {'sp': 'dónde', 'en': 'where?'},
    {'sp': 'padre', 'en': 'father'},
    {'sp': 'nosotros', 'en': 'we (subj)'},
    {'sp': 'importante', 'en': 'important'},
    {'sp': 'trabajar', 'en': 'to work'},
    {'sp': 'verdad', 'en': 'truth'},
    {'sp': 'gobierno', 'en': 'government'},
    {'sp': 'ejemplo', 'en': 'example'},
    {'sp': 'antes', 'en': 'before'},
    {'sp': 'existir', 'en': 'to exist'},
    {'sp': 'escribir', 'en': 'to write'},
    {'sp': 'grupo', 'en': 'group'},
    {'sp': 'entrar', 'en': 'to enter'},
    {'sp': 'amigo', 'en': 'friend'},
    {'sp': 'morir', 'en': 'to die'},
    {'sp': 'recibir', 'en': 'to receive'},
    {'sp': 'social', 'en': 'social'},
    {'sp': 'sistema', 'en': 'system'},
    {'sp': 'segundo', 'en': 'second'},
    {'sp': 'madre', 'en': 'mother'},
    {'sp': 'nacional', 'en': 'national'},
    {'sp': 'familia', 'en': 'family'},
    {'sp': 'frente', 'en': 'front'},
    {'sp': 'crear', 'en': 'to create'},
    {'sp': 'humano', 'en': 'human'},
    {'sp': 'abrir', 'en': 'to open'},
    {'sp': 'cambiar', 'en': 'to change'},
    {'sp': 'político', 'en': 'political'},
    {'sp': 'español', 'en': 'Spanish'},
    {'sp': 'calle', 'en': 'street'},
    {'sp': 'necesitar', 'en': 'to need'},
    {'sp': 'general', 'en': 'general'},
    {'sp': 'situación', 'en': 'situation'},
    {'sp': 'aparecer', 'en': 'to appear'},
    {'sp': 'muerte', 'en': 'death'},
    {'sp': 'nivel', 'en': 'level'},
    {'sp': 'explicar', 'en': 'to explain'},
    {'sp': 'negro', 'en': 'black'},
    {'sp': 'efecto', 'en': 'effect'},
    {'sp': 'formar', 'en': 'to form'},
    {'sp': 'económico', 'en': 'economic'},
    {'sp': 'servir', 'en': 'to serve'},
    {'sp': 'animal', 'en': 'animal'},
    {'sp': 'número', 'en': 'number'},
    {'sp': 'ayudar', 'en': 'to help'},
    {'sp': 'público', 'en': 'public'},
    {'sp': 'mostrar', 'en': 'to show'},
    {'sp': 'estudiar', 'en': 'to study'},
    {'sp': 'música', 'en': 'music'},
    {'sp': 'correr', 'en': 'to run'},
    {'sp': 'comer', 'en': 'to eat'},
    {'sp': 'poder', 'en': 'power'},
    {'sp': 'sociedad', 'en': 'society'},
    {'sp': 'color', 'en': 'color'},
    {'sp': 'comprar', 'en': 'to buy'},
    {'sp': 'necesario', 'en': 'necessary'},
    {'sp': 'dinero', 'en': 'money'},
    {'sp': 'decidir', 'en': 'to decide'},
    {'sp': 'movimiento', 'en': 'movement'},
    {'sp': 'blanco', 'en': 'white'},
    {'sp': 'pagar', 'en': 'to pay'},
    {'sp': 'cumplir', 'en': 'to fulfill'},
    {'sp': 'interés', 'en': 'interest'},
    {'sp': 'mayoría', 'en': 'majority'},
    {'sp': 'producto', 'en': 'product'},
    {'sp': 'ojalá', 'en': 'hopefully'},
    {'sp': 'dormir', 'en': 'to sleep'},
    {'sp': 'subir', 'en': 'to go up'},
    {'sp': 'personal', 'en': 'personal'},
    {'sp': 'olvidar', 'en': 'to forget'},
    {'sp': 'incluir', 'en': 'to include'},
    {'sp': 'condición', 'en': 'condition'},
    {'sp': 'escuela', 'en': 'school'},
    {'sp': 'nacer', 'en': 'to be born'},
    {'sp': 'posible', 'en': 'possible'},
    {'sp': 'aprender', 'en': 'to learn'},
    {'sp': 'serie', 'en': 'series'},
    {'sp': 'aceptar', 'en': 'to accept'},
    {'sp': 'fuerte', 'en': 'strong'},
    {'sp': 'especial', 'en': 'special'}
]

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
    .attr("x", function(d, i) { return i * 20; });

// ENTER new elements present in new data.
text.enter().append("text")
    .attr("class", "enter")
    .attr("dy", ".35em")
    .attr("y", -60)
    .attr("x", function(d, i) { return i * 20; })
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
}, 2500);