<template>
    <ToTopButton />
    
    <header class="masthead" :style="mastheadStyle">
        <div class="center" style="z-index: 1;">
            <div class="site-heading">
                <h1>{{ title }}</h1>
                <span class="subheading">{{ subheading }}</span>
            </div>
        </div>
    </header>

    <article data-toc data-toc-id="main-toc" data-toc-class="toc-custom" data-toc-parent-id="toc-parent" class="mb-4">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-md-10 col-lg-10 col-xl-8">
                    <h4>Get started</h4>
    <p>
    <ol>
      <li>Pick a mode (e.g. indicativo).</li>
      <li>Pick one or more tenses (e.g. present, futuro, etc...).</li>
      <li>Choose a training mode and a range/number of words.</li>
      <ol>
        <li>Random: A random number of verbs.</li>
        <li>Frequency: Select only the most frequent Spanish verbs (e.g. ser, haber, ...).</li>
        <li>Range: Select a range of words. This is useful if you want to study, e.g., ten words a day. Start is inclusive, end exclusive and lower numbers stand for words that are more frequent.</li>
      </ol>
      <li>Study 😊 Read the English verb and try if you can come up with the Spanish translation on your own. Click/tap inside the black frame on the left of the English verb to display the Spanish translation. Enter your conjugations and press "Next". The cursor will automatically jump to the next field when you hit enter. If your answer was wrong you will see the correct conjugation. Click the "Next" button again to continue.</li>
      <li>As soon as you're done a new tab will open with all the conjugations you didn't answer correctly on the first try. Cards that show up on top were answered incorrectly most often, so try to memorize these as good as you can.</li>
    </ol>
  </p>
  <hr class="mt-5 mb-5">
  <div class="container">
    <div class="row">
      <div class="col" style="display: flex; align-items: center;">
        <select id="mode-select" class="form-select">
          <option value="indicativo" selected>Indicativo (Indicative)</option>
          <option value="subjuntivo">Subjuntivo (Subjunctive)</option>
          <option value="imperativo">Imperativo (Imperative)</option>
          <option value="infinitivo">Infinitivo (Infinitive)</option>
          <option value="gerundio">Gerundio (Gerund)</option>
          <option value="participio">Participio (Participle)</option>
        </select>
      </div>
      <div class="col">
        <div id="temps-select" class="vertical-input-group mb-3"></div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <select id="type-select" class="form-select">
          <option value="random" selected>Random</option>
          <option value="frequency">Frequency</option>
          <option value="range">Range</option>
        </select>
      </div>
      <div class="col">
        <div class="form-outline">
          <input type="number" id="items" value="10" class="form-control" />
        </div>
        <div class="input-group">
          <input type="number" id="range-start" value="0" class="form-control" />
          <input type="number" id="range-end" value="10" class="form-control" />
        </div>
      </div>
    </div>
    <div class="row pt-3">
      <div class="col">
        <button id="go-button" type="button" class="btn btn-primary btn-lg btn-block mx-auto">GO</button>
      </div>
    </div>
  </div>
</div>

<div id="conjugator-div" class="col-md-10 col-lg-10 col-xl-8 mt-4 mb-4" style="opacity: 0;">
  <div class="container">
    <div class="row">
      <div class="col">
        <h3 id="words-left"></h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h3 id="percentage-correct">0.00%</h3>
      </div>
    </div>
    <div class="row">
      <div class="col" style="background-color: rgb(144,238,144,0.75);"><h3 id="correct-count">0</h3></div>
      <div class="col" style="background-color: rgb(255,204,203,0.75);"><h3 id="wrong-count">0</h3></div>
    </div>
    <div class="row">
      <div class="col">
        <h3 id="temp-h3"></h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h3 id="sp-h3"></h3>
      </div>
      <div class="col">
        <h3 id="en-h3"></h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table">
          <tbody id="verb-table"></tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button id="next-button" type="button" class="btn btn-primary btn-lg btn-block mx-auto">NEXT</button>
      </div>
    </div>
  </div>
</div>

<div class="col-md-10 col-lg-10 col-xl-8">
  <div id="errors-container" class="container"></div>
</div>
</div>
        </div>
    </article>
</template>

<script>
import { useMeta } from 'vue-meta'
import { onMounted, getCurrentInstance } from "vue";
import * as d3 from 'd3';
import ToTopButton from '../../ToTopButton.vue';

export default {
    data () {
        return {
            title: "Don Conjugator",
            title_meta: "Don Conjugator",
            subheading: "Cervantes approved conjugation trainer to improve your Spanish",
            img: "donconjugator_header.jpg"
        }
    },
    mounted () {
      this.init()
    },
    setup () {
        onMounted(() => {
            useMeta({
                title: getCurrentInstance().data.title,
            })
        })
    },
    computed: {
        mastheadStyle() {
            return {
                'background-image': 'url(' + require(`@/assets/img/${this.img}`) + ')',
                'height': 'calc(20rem + 57px)',
                'width': '100%'
            }
        }
    },
    methods: {
      init () {
        // register jQuery extension
        jQuery.extend(jQuery.expr[':'], {
            focusable: function (el, index, selector) {
                // return $(el).is('a, button, :input, [tabindex]');
                return $(el).is('.answer, #next-button');
            }
        });

        $(document).on('keypress', 'input,select,button', function (e) {
            
            if (e.which == 13) {
                if (e.target.tagName == "INPUT") {
                    e.preventDefault();
                }
                // Get all focusable elements on the page
                var $canfocus = $(':focusable');
                var index = $canfocus.index(document.activeElement) + 1;
                
                if (index >= $canfocus.length) index = 0;
                $canfocus.eq(index).focus();
            }
        });

        const TOP100 = ["ser", "haber", "estar", "tener", "hacer", "poder", "decir", "ir", "ver", "dar", "saber", "querer", "llegar", "pasar", "deber", "poner", "parecer", "quedar", "creer", "hablar", "llevar", "dejar", "seguir", "encontrar", "llamar", "venir", "pensar", "salir", "volver", "tomar", "conocer", "vivir", "sentir", "tratar", "mirar", "contar", "empezar", "esperar", "buscar", "existir", "entrar", "trabajar", "escribir", "perder", "producir", "ocurrir", "entender", "pedir", "recibir", "recordar", "terminar", "permitir", "aparecer", "conseguir", "comenzar", "servir", "sacar", "necesitar", "mantener", "resultar", "leer", "caer", "cambiar", "presentar", "crear", "abrir", "considerar", "oír", "acabar", "convertir", "ganar", "formar", "traer", "partir", "morir", "aceptar", "realizar", "suponer", "comprender", "lograr", "explicar", "preguntar", "tocar", "reconocer", "estudiar", "alcanzar", "nacer", "dirigir", "correr", "utilizar", "pagar", "ayudar", "gustar", "jugar", "escuchar", "cumplir", "ofrecer", "descubrir", "levantar", "intentar"];

        const TEMPS_IN_MODE = {
            "indicativo": ["presente", "preterito perfecto compuesto", "preterito imperfect", "preterito pluscuamperfecto", "preterito perfecto simple", "preterito anterior", "futuro", "futuro perfecto", "condicional", "condicional perfecto"],
            "subjuntivo": ["presente", "preterito perfecto", "preterito imperfecto 1", "preterito pluscuamperfecto 1", "preterito imperfecto 2", "preterito pluscuamperfecto 2", "futuro", "futuro perfecto"],
            "imperativo": ["imperativo", "imperativo negativo"],
            "infinitivo": ["simple", "compuesto"],
            "gerundio": ["simple", "compuesto"],
            "participio": ["pasado"]
        };

        const MODES_MAPPING = {
            "indicativo": "Indicativo (Indicative)",
            "subjuntivo": "Subjuntivo (Subjunctive)",
            "imperativo": "Imperativo (Imperative)",
            "infinitivo": "Infinitivo (Infinitive)",
            "gerundio": "Gerundio (Gerund)",
            "participio": "Participio (Participle)"
          };

        const TEMPS_MAPPING = {
            "presente": "Presente (Present)",
            "preterito perfecto compuesto": "Pretérito perfecto compuesto (Present perfect)",
            "preterito imperfect": "Pretérito imperfecto (Imperfect)",
            "preterito pluscuamperfecto": "Pretérito pluscuamperfecto (Past perfect)",
            "preterito perfecto simple": "Pretérito perfecto simple (Preterite)",
            "preterito anterior": "Pretérito anterior (Preterite perfect)",
            "futuro": "Futuro (Future)",
            "futuro perfecto": "Futuro perfecto (Future perfect)",
            "condicional": "Condicional (Conditional)",
            "condicional perfecto": "Condicional perfecto (Conditional perfect)",
          
            "preterito perfecto": "Pretérito perfecto (Present perfect)",
            "preterito imperfecto 1": "Pretérito imperfecto 1 (Imperfect 1)",
            "preterito pluscuamperfecto 1": "Pretérito pluscuamperfecto 1 (Past perfect 1)",
            "preterito imperfecto 2": "Pretérito imperfecto 2 (Imperfect 2)",
            "preterito pluscuamperfecto 2": "Pretérito pluscuamperfecto 2 (Past perfect 2)",
            
            "imperativo": "Imperativo (Imperative)",
            "imperativo negativo": "Imperativo negativo (Imperative negative)",
            
            "simple": "Simple (Présent)",
            "compuesto": "Compuesto (Perfect)",
            
            "pasado": "Pasado (Perfect)"
          };

        const CORPUS = {
          "top100": TOP100.join(","),
          "all": "all"
        }
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
        let mode = d3.select("#mode-select").property('value');

        function shuffle(array) {
            let currentIndex = array.length,  randomIndex;
          
            while (currentIndex != 0) {
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex--;
          
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
            d3.select("#temp-h3").text(TEMPS_MAPPING[card["temp"]]);
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
                                    return `<td>${split[0]}</td><td><input class="form-control answer" type="text"></td>`
                                } else {
                                    return `<td><input class="form-control answer" type="text"></td>`
                                }
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
                                }
                            }
                        ),
                    exit => exit.call(fadeOut, 500)
                );
            $(".answer")[0].focus();
        }

        function check (card) {
            let answers = d3.selectAll('.answer').nodes().map(d=>d.value.trim());
            let truth = card['conjugation'].map(function (d) {
                if (['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'].includes(d.split(' ')[0])) {
                    return d.split(' ').splice(1).join(' ')
                } else {
                    return d
                }
            });
            
            if (answers.toString().toLowerCase()  == truth.toString().toLowerCase()) {
                return {correct: true, answers: null, truth: null}
            } else {
                return {correct: false, answers: answers, truth: truth}
            }
        }

        function summarize (errors) {
            let uniqueErrors = _.uniq(errors);
            let counterErrors = _.countBy(errors, d => d["sp"]);
            let verbs = [];
            console.log(counterErrors);
            uniqueErrors.map(d=>d["errorCount"]=counterErrors[d["sp"]]);
            uniqueErrors.sort(function(first, second) {
                return second.errorCount - first.errorCount;
              });
            uniqueErrors.forEach(d=>verbs.push(`${d["temp"]};${d["sp"]}`));
            
            let url = `localhost:8080/posts/don_conjugator/practice/${mode}/${verbs.join(",")}`;
            
            window.open(url, '_blank').focus();
        }

        d3.select('#mode-select').on('change', function () {
            mode = d3.select("#mode-select").property('value');
            updateMode()
        })

        d3.select('#go-button').on('click', function () {
            d3.select("#conjugator-div").style('opacity', 1);

            let url;
            let mode = d3.select('#mode-select').property('value');
            let type = d3.select('#type-select').property('value');
            let temps = d3.selectAll("input[type='checkbox']:checked").nodes().map(d=>d.value).join(',');

            if (temps == "") {
                alert(`Make sure to select one or more tenses (e.g. presente, futuro, ...).`)
                return
            }
            
            cards = [];
            errors = [];
            correctCount = 0;
            wrongCount = 0;

            d3.select("#correct-count").text(correctCount);
            d3.select("#wrong-count").text(wrongCount);
            
            if (type=="random") {
                let items = +d3.select('#items').property('value');
                url = `https://api.philippstuerner.com/don_conjugator/random?items=${items}&mode=${mode}&temps=${temps}`
            } else if (type=="frequency") {
                let items = +d3.select('#items').property('value');
                url = `https://api.philippstuerner.com/don_conjugator/frequency?items=${items}&mode=${mode}&temps=${temps}`
            } else {
                let start = +d3.select('#range-start').property('value');
                let end = +d3.select('#range-end').property('value');
                if (start >= end) {
                    alert(`Make sure that your start value (${start}) is smaller than your end value (${end}).`)
                    return
                } else if (start < 0) {
                    alert(`Make sure that your start value (${start}) is greater than 0.`)
                    return
                }
                url = `https://api.philippstuerner.com/don_conjugator/range?start=${start}&end=${end}&mode=${mode}&temps=${temps}`
            }

            d3.json(url).then(function (dataRaw) {
                    dataRaw.forEach(function (verb) {
                        temps.split(',').forEach(function (temp) {
                            cards.push({
                                "temp": temp,
                                "sp": verb["sp"],
                                "en": verb["en"],
                                "conjugation": verb[MODES_MAPPING[mode]][TEMPS_MAPPING[temp]].map(d => d.trim().replace('  ', ' '))
                            })
                        })
                    });

                    
                    if (type == "random") {
                        cards = shuffle(cards)
                    }
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

            if (!cardCheck.correct) {
                wrongCount = wrongCount +1;
                d3.select("#wrong-count").text(wrongCount);
                revisit = true;
                cards.push(card);
                errors.push(card);
                
                d3.select('#verb-table').selectAll('.answer').nodes().forEach(function (d,i) {
                    if (d.value.toLowerCase().includes(cardCheck.truth[i])) {
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
                if (cards.length > 0) {
                    setTimeout(function () { card = cards[0]; play(card); }, 1000);       
                }
            }

            d3.select("#words-left").text(`${cards.length} out of ${wordCountStart} verbs left`);
            d3.select("#percentage-correct").text(`${(correctCount/(correctCount+wrongCount)*100).toFixed(2)}%`);

            if (cards.length == 0) {
                summarize(errors);
            }

            document.getElementById("sp-h3").focus();
        })

        d3.select('#sp-h3').on('click', function () {
            d3.select(this).style('border', null).style('color', 'black');
            $(".answer")[0].focus();
        })

        d3.select('#type-select').on('change', function () {
            let type = d3.select("#type-select").property('value');
            
            if (type == "range") {
                d3.select("#items").style('display', 'none');
                d3.select("#range-start").style('display', 'block');
                d3.select("#range-end").style('display', 'block');
            } else {
                d3.select("#items").style('display', 'block');
                d3.select("#range-start").style('display', 'none');
                d3.select("#range-end").style('display', 'none');
            }
        })

        d3.select("#items").style('display', 'block');
        d3.select("#range-start").style('display', 'none');
        d3.select("#range-end").style('display', 'none');

        $('input').bind('input', function(){
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        updateMode();
      }
    },
    components: {
        ToTopButton
    }
}
</script>

<style scoped>
</style>
