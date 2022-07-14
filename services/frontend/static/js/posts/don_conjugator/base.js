import { TOP100, TEMPS_IN_MODE, TEMPS_MAPPING, MODES_MAPPING, CORPUS } from "./util.js";

/**
     * @name fadeIn
     * @description Transition for incoming documents.
     * @param {func} doc
     * @param {Number} duration
     */
 function fadeIn(doc, duration) {
    doc.style("opacity", 0)
        .transition("fadeIn")
        .duration(duration)
        .style("opacity", 1);
}

/**
 * @name fadeOut
 * @description Transition for outgoing documents.
 * @param {func} doc
 * @param {Number} duration
 */
function fadeOut(doc, duration) {
    doc.style("opacity", 1)
        .transition("fadeOut")
        .duration(duration)
        .style("opacity", 0)
        .remove();
}

let cards = [];
let card = null;
let revisit = false;
let wordCountStart = null;
let correctCount = 0;
let wrongCount = 0;
let errors = [];

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function Counter(array) {
    var count = {};
    array.forEach(val => count[val] = (count[val] || 0) + 1);
    return count;
  }

function updateMode () {
    let mode = d3.select("#mode-select").property('value');

    d3.select('#temps-select')
        .selectAll(".form-check")
        .data(TEMPS_IN_MODE[mode])
        .join(
            (enter) =>
                enter
                    .append("div")
                    .attr("class", "form-check")
                    .call(fadeIn, 1500)
                    .html(
                        (d) => `
                    <input class="form-check-input" type="checkbox" value="${d}">
                    <label class="form-check-label">
                        ${TEMPS_MAPPING[d].split('(')[0].trim()}
                    </label>
                `
                    ),
            (update) =>
                update.html(
                    (d) => `
                <input class="form-check-input" type="checkbox" value="${d}">
                <label class="form-check-label">
                    ${TEMPS_MAPPING[d].split('(')[0].trim()}
                </label>
            `
                ),
            (exit) => exit.call(fadeOut, 1500)
        );
}

 function play (card) {
    d3.select("#sp-h3").style('color', 'white').style("border", "3px solid black");
    d3.select("#temp-h3").text(card["temp"]);
    d3.select("#sp-h3").text(card["sp"]);
    d3.select("#en-h3").text(card["en"]);
    
    d3.select("#verb-table").selectAll('tr')
        .data(card["conjugation"])
        .join(
            enter => enter
                .append('tr')
                .call(fadeIn, 500)
                .html(
                    function (d) {
                        let split = d.split(' ');
                        if (['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'].includes(split[0])) {
                            // return `<td>${split[0]}</td><td>${split.slice(1).join(' ')}</td>`
                            return `<td>${split[0]}</td><td><input class="form-control answer" type="text"></td>`
                        } else {
                            return `<td><input class="form-control answer" type="text"></td>`
                        };
                    }
                ),
            update => update
                .call(fadeIn, 500)
                .html(
                    function (d) {
                        let split = d.split(' ');
                        if (['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'].includes(split[0])) {
                            return `<td>${split[0]}</td><td><input class="form-control answer" type="text"></td>`
                        } else {
                            return `<td><input class="form-control answer" type="text"></td>`
                        };
                    }
                ),
            exit => exit.call(fadeOut, 500)
        );
    $(".answer")[0].focus();
}

function check (card) {
    let answers = d3.selectAll('.answer').nodes().map(d=>d.value);
    let truth = card['conjugation'].map(function (d) {
        if (['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'].includes(d.split(' ')[0])) {
            return d.split(' ').splice(1).join(' ')
        } else {
            return d
        }
    });

    if (answers.toString()  == truth.toString()) {
        return {correct: true, answers: null, truth: null}
    } else {
        return {correct: false, answers: answers, truth: truth}
    }
}

function summarize (errors) {
    let uniqueErrors = _.uniq(errors);
    let counterErrors = _.countBy(errors, d => d["sp"]);

    d3.select("#errors-container").selectAll(".errors-div")
        .data(uniqueErrors)
        .join(
            enter => enter
                .append("div")
                .attr("class", "errors-div")
                .html(
                    (d) => `
                    <div class="row">
                        <div class="col">${counterErrors[d["sp"]]}x, ${d["temp"]}, ${d["sp"]} -> ${d["en"]}</div>
                    </div>
                    <div class="row">
                        <div class="col">${d["conjugation"].join(", ")}</div>
                    </div>
                `
                )

        )
}

d3.select('#mode-select').on('change', function () {
    updateMode()
})

d3.select('#go-button').on('click', function () {
    d3.select("#conjugator-div").style('opacity', 1);

   let mode = d3.select('#mode-select').property('value');
   let corpus = d3.select('#corpus-select').property('value');
   let temps = d3.selectAll("input[type='checkbox']:checked").nodes().map(d=>d.value).join(',');
   let items = null ? d3.select('#items').property('value') == "all" : +d3.select('#items').property('value');
//    let select = corpus == "top100" ? TOP100.join(",") : null
   
   cards = [];
   correctCount = 0;
   wrongCount = 0;

   d3.select("#correct-count").text(correctCount);
   d3.select("#wrong-count").text(wrongCount);
   
   d3.json(`https://mongodb.philippstuerner.com/api/conjugator/verbs?items=${items}&mode=${mode}&temps=${temps}&select=${CORPUS[corpus]}`).then(function (dataRaw) {
        dataRaw.forEach(function (verb) {
            temps.split(',').forEach(function (temp) {
                cards.push({
                    "temp": TEMPS_MAPPING[temp],
                    "sp": verb["sp"],
                    "en": verb["en"],
                    "conjugation": verb[MODES_MAPPING[mode]][TEMPS_MAPPING[temp]].map(d => d.trim().replace('  ', ' '))
                })
            })
        });

        
        cards = shuffle(cards)
        card = cards[0];

        wordCountStart = cards.length;
        d3.select("#words-left").text(`${wordCountStart} out of ${wordCountStart} verbs left`);

        play(card);
    });
    
})

d3.select("#next-button").on('click', function () {
    if (revisit) {
        revisit = false;
        card = cards[0];
        play(card);
        
        return
    }

    cards.shift(0);
    
    let cardCheck = check(card);
    // let correctCount = +d3.select('#correct-count').text();
    // let wrongCount = +d3.select('#wrong-count').text();

    if (!cardCheck.correct) {
        wrongCount = wrongCount +1;
        d3.select("#wrong-count").text(wrongCount);
        revisit = true;
        cards.push(card);
        errors.push(card);
        
        d3.select('#verb-table').selectAll('.answer').nodes().forEach(function (d,i) {
            if (d.value.includes(cardCheck.truth[i])) {
                d3.select(d).call(fadeIn, 500).style('background-color', 'rgb(144,238,144,0.75)');
            } else {
                d3.select(d).call(fadeIn, 500).style('background-color', 'rgb(255,204,203,0.75)');
                d.value = `${d.value} -> ${cardCheck.truth[i]}`
            }
        })
    } else {
        correctCount = correctCount + 1;
        d3.select("#correct-count").text(correctCount);
        d3.selectAll('.answer').call(fadeIn, 500).style('background-color', 'rgb(144,238,144,0.75)');
        setTimeout(function () {card = cards[0];play(card);}, 1000);        
    };

    d3.select("#words-left").text(`${cards.length} out of ${wordCountStart} verbs left`);
    d3.select("#percentage-correct").text(`${(correctCount/(correctCount+wrongCount)*100).toFixed(2)}%`);

    if (cards.length == 0) {
        summarize(errors);
    }
})

d3.select('#sp-h3').on('click', function () {
    d3.select(this).style('border', null).style('color', 'black')
})

updateMode();