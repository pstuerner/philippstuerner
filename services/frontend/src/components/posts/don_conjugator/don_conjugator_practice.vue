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
          <h2 id="mode" style="text-align: center; margin-top: 2em;">{{ mode }}</h2>
          <div v-for="verb in verbs" :key="verb" class="card bg-dark text-white mx-auto">
            <div class="card-inner" style="display: flex; align-items: center; justify-content: center;">
              <div>
                <h4 id="card-temp" class="card-title">{{ verb.split(";")[0] }}</h4>
                <h5 id="card-en" class="card-title"></h5>
              </div>
              <div class="card-img-overlay">
                <h5 id="card-sp" class="card-title">{{ verb.split(";")[1] }}</h5>
                <div id="card-conjugation"></div>
              </div>
            </div>
          </div>
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
  data() {
    let params = this.$route.params;
    return {
      title: "Practice Sheet",
      title_meta: "Practice Sheet",
      subheading: `Good job! Bookmark this page to practice the ${params["verbs"].split(",").length} verbs you didn't know by heart.`,
      img: "donconjugator_header.jpg",
      mode: params.mode,
      verbs: params["verbs"].split(",")
    }
  },
  mounted () {
    this.init()
  },
  setup() {
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

      // Get card element
      const card = document.querySelectorAll('.card');

      // Loop through cards. 
      // This is so you can have multiple cards on a page.
      for (let i = 0; i < card.length; i++) {
        // Add a click event listener to each card.
        card[i].addEventListener("click", function() {
          // Toggle active class on card
          card[i].classList.toggle("active");
        });
      }

      let mode = d3.select('#mode').text();
      d3.select('#mode').text(MODES_MAPPING[mode]);

      d3.selectAll('.card').nodes().forEach(function (d) {
          let card = d3.select(d);
          let temp = card.select('#card-temp').text();
          let sp = card.select('#card-sp').text();
          
        d3.json(`https://api.philippstuerner.com/don_conjugator/select?mode=${mode}&temp=${temp}&verb=${sp}`).then(function (dataRaw) {
              let conjugation = dataRaw[0][MODES_MAPPING[mode]][TEMPS_MAPPING[temp]];
              let en = dataRaw[0]["en"];
              
              card.select('#card-en').text(en);
              card.select('#card-temp').text(TEMPS_MAPPING[temp]);
              card.select('#card-conjugation').selectAll("p").data(conjugation).join(enter => enter.append("p").attr("class", "card-text").text(d=>d));
          })
      });
    }
  },
  components: {
    ToTopButton
  }
}
</script>

<style scoped>
.card {
  background-color: transparent;
  width: 300px;
  height: 300px;
  perspective: 1000px;
  margin-top: 2em;
  margin-bottom: 2em;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.active .card-inner {
  transform: rotateY(180deg);
}

.card img, .card-img-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  top:0;left:0;right:0;
}

.card-img-overlay {
  transform: rotateY(180deg);
  background:white;
  color:black;
}
</style>

<style>
#card-conjugation .card-text {
  padding: 0;
  margin: 0;
}
</style>
