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
  <p><b>tl;dr:</b> I'm improving my Spanish so I've developed a small web application to help me practice conjugating verbs in different modes and tenses. You can find the app <b><router-link :to="`/apps/don_conjugator`" target="_blank">here</router-link></b> and skip the entire explanation below, it should be fairly self-explanatory. However, feel free to continue reading if you're interested in how it works and what the technical implementation looks like 😉. You can find the source code on <a href="https://github.com/pstuerner/philippstuerner/tree/master/services/frontend/src/components/posts/don_conjugator" target="_blank">GitHub <i class="fab fa-github"></i></a>!</p>
  <hr>
  <p>
    Let's be honest: learning a new language can be a pain in the a**. No, really, all the vocabulary, conjugations, irregularities, and then you're required to study while having a fulltime job and a social life. But it's worth it and it's always fun to talk to foreigners in their language.
  </p>
  <p>
    One of the hardest parts of probably most languages are verbs and how to conjugate them. Present, past, future, I mean, it's already difficult to learn all of this in English but Spanish gets even more complicated since it comes with different modes like “indicativo” or “subjuntivo”. Okay, it's probably a joke compared to if you're willing to study German, but I think you get my point: conjugating verbs is tough and there's plenty to study.
  </p>
  <p>
    There are some existing websites like <a href="https://www.scholingua.com/de/es/konjugationstrainer" target="_blank">scholingua.com</a> or <a href="https://www.spaleon.com/pres.php" target="_blank">spaleon.com</a> that already offer applications to help you to learn how to conjugate but most of them require you to make an account, purchase some kind of package or only allow you to study ten verbs at a time. Hence, I wanted to come up with my own solution. Probably also because it's a fun end-to-end project including data gathering, ingestion, frontend, and deployment 😊.
  </p>
  <p style="text-align: center;">
    ✨&ensp;🇪🇸&ensp;🇪🇸&emsp;You can find the web app <b><router-link :to="`/apps/don_conjugator`" target="_blank">here</router-link></b>&emsp;🇪🇸&ensp;🇪🇸&ensp;✨
  </p>
  <p>
    First, let's find out how I've collected the raw data. The magical Google query is “1000 spanish verbs” and the first result brought me to <a href="https://spanishwithtati.com/regular-and-irregular-spanish-verbs/" target="_blank">spanishwithtati.com</a>. The website includes a list with 1000 Spanish verbs and its corresponding English translation. I'm kind of trusting this Tati person since I haven't fact-checked the English translations, but the list looked good to me. The actual data gathering and ingestion happens in a Jupyter Notebook and, well, it's quick and dirty. But it does the job and since I only have to do it once I'm fine with it. What happens is that I basically just copy paste the entire list from the website into the notebook and apply some string manipulation and splitting in order to receive a list of Spanish verbs with their corresponding English translation.
  </p>
  <pre class="p-0">
    <code class="language-python">verbs = []

# Just a selection of words
# The entire string contains all 1000 verbs
s = """ir (go)
  adherir (adhere, attach)
  advertir (warn)
  adquirir (acquire, buy)
  diferir (differ, defer)
  digerir (digest, absorb)
  herir (hurt, injure)
  inferir (infer, conclude)
  ingerir (eat, ingest) 
  interferir (interfere)
  preferir (prefer)"""

ss = [x.split('(') for x in [x.strip() for x in s.split('\n')]]

for x,y in ss:
    sp = x.strip()
    en = y.split(')')[0].strip()
    verbs.append(
        {
            'sp': sp,
            'en': en
        }
    )
    </code>
</pre>
<p>
  Cool, that's how easy it was to retrieve the raw data of 1000 verbs. The final list of dictionaries looks like this:
</p>
<pre class="p-0">
  <code class="language-python">>>> print(verbs)
[
  {'sp': 'ir', 'en': 'go'},
  {'sp': 'adherir', 'en': 'adhere, attach'},
  {'sp': 'advertir', 'en': 'warn'},
  {'sp': 'adquirir', 'en': 'acquire, buy'},
  {'sp': 'diferir', 'en': 'differ, defer'},
  {'sp': 'digerir', 'en': 'digest, absorb'},
  {'sp': 'herir', 'en': 'hurt, injure'},
  {'sp': 'inferir', 'en': 'infer, conclude'},
  {'sp': 'ingerir', 'en': 'eat, ingest'},
  {'sp': 'interferir', 'en': 'interfere'},
  {'sp': 'preferir', 'en': 'prefer'}
]
  </code>
</pre>
  <p>
    However, this is not really useful to practice conjugating since we didn't collect any data on the different tenses. For that purpose, I rely on <a href="https://www.the-conjugation.com/" target="_blank">the-conjugation.com</a> and the only thing required is some BeautifulSoup and RegEx.
  </p>
  <pre class="p-0">
    <code class="language-python">import re
import requests
from bs4 import BeautifulSoup
from itertools import groupby
from urllib.parse import quote

def get_soup(verb):
    page = requests.get(f"https://www.the-conjugation.com/spanish/verb/{quote(verb)}.php")    
    
    if page.status_code != 200:
        return None
    
    content = page.content
    
    return BeautifulSoup(content, 'html.parser')

def get_temps(verb):
    soup = get_soup(verb)

    if soup == None:
        return None
    
    elements = soup.find_all(['h2','div'], class_=re.compile(r'(mode|tempstab)'))[:-2]
    elements = elements[1:] if 'Translation' in elements[0].text else elements
    
    i = (list(g) for _, g in groupby(elements, key=lambda f: f.name=='h2'))
    l = [(a, b) for a, b in zip(i, i)]
    
    d = {}
    for mode, temps in l:
        mode_name = mode[0].text 
        d[mode_name] = {}
        for temp in temps:
            temp_name = temp.find('h3').text
            conjugations = str(temp.find('div')).replace('&lt;div class="tempscorps"&gt;','').replace('&lt;/div&gt;','').replace('&lt;b&gt;','').replace('&lt;/b&gt;','').split('&lt;br/&gt;')[:-1]
            d[mode_name][temp_name] = conjugations
    
    return d
    </code>
  </pre>
  <p>
    You can see that if I run <code>get_temps(“ser”)</code> I will receive all modes and tenses of the verb:
  </p>
  <pre class="p-0">
    <code class="language-python">>>> get_temps("ser")
{
  'Indicativo (Indicative)': {'Presente (Present)': ['yo soy',
  'tú eres',
  'él es',
  'nosotros somos',
  'vosotros sois',
  'ellos son'],
  'Pretérito perfecto compuesto (Present perfect)': ['yo he  sido',
  'tú has  sido',
  'él ha  sido',
  'nosotros hemos  sido',
  'vosotros habéis  sido',
  'ellos han  sido'],
  'Pretérito imperfecto (Imperfect)': ['yo era',
  'tú eras',
  'él era',
  'nosotros éramos',
  'vosotros erais',
  'ellos eran'],
  ...
}
    </code>
  </pre>
  <p>
    The last step is to write all the data we've gathered into a database so that we can access it from our web application at a later point in time. I decided to move forward with a MongoDB since I'm already used to the structure of the database and since it works smoothly with Python-like objects such as dictionaries or datetimes. Additionally, I'm lazy and there's already a running MongoDB container on my Raspberry Pi 😛.
  </p>
  <pre class="p-0">
    <code class="language-python">from pymongo import MongoClient

client = MongoClient('mongodb://USER:PWD@IP:PORT/DATABASE')

db = client["conjugator"]
verbs_col = db.verbs
missing = []

for verb in verbs:
  d = get_temps(verb['sp'])
  
  if d is None:
      missing.append(verb)
      continue
  
  verbs_col.insert_one({**verb, **d})
    </code>
  </pre>
  <p>
    Data gathering and ingestion done ✅ Let's take care of the front- and backend so we can visualize the application and make it retrieve data from the MongoDB. The frontend consists of multiple parts. Some really simple HTML and CSS to get the basic layout of the page. A bit of Jinja so it fits the structure of my website. A bunch of vanilla JavaScript code to make the user experience more enjoyable, e.g. jump to the next text field when hitting enter. Finally, of course, lots of D3.js to update the layout, make API calls, and keep track of the conjugation game.

  </p>
  <p>
    In total there are three main Vue files: <a href="https://github.com/pstuerner/philippstuerner/blob/master/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue" target="_blank">don_conjugator_app.vue</a>,  <a href="https://github.com/pstuerner/philippstuerner/blob/master/services/frontend/src/components/posts/don_conjugator/don_conjugator_practice.vue" target="_blank">don_conjugator_practice.vue</a>, and <a href="https://github.com/pstuerner/philippstuerner/blob/master/services/frontend/src/components/posts/don_conjugator/don_conjugator.vue" target="_blank">don_conjugator.vue</a>. Let's start with the most basic one, don_conjugator.vue, which only includes the HTML source code and does some basic higlight.js highlighting. The former simply includes the functionality that the cursor will jump to the following text field as soon as the user hits enter. Util.js contains a bunch of lists and dictionaries to map strings and define lists of verbs.
  </p>
  <p>
    Don_conjugator_app.vue includes the main logic of the conjugation trainer and in its most basic form consists of utility functions (<a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L324" target="_blank">play</a>, <a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L363" target="_blank">check</a>, <a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L380" target="_blank">summarize</a>) and event listeners for certain DOM objects (<a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L396" target="_blank">#mode-select</a>, <a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L401" target="_blank">#go-button</a>, <a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L466" target="_blank">#next-button</a>, <a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L513" target="_blank">#sp-h3</a>, <a href="https://github.com/pstuerner/philippstuerner/blob/e997f44656fe110c4144b5928e3b56470915c5a5/services/frontend/src/components/posts/don_conjugator/don_conjugator_app.vue#L518" target="_blank">#type-select</a>). The utility functions include everything that's required to play the game, hence, pick new verbs, check if the supplied answer is correct, and summarize the results as soon as the training finished. The event listeners set up the game, grab data from the MongoDB, and make use of the utility functionalities to lead the user through the training process. For example, I'm attaching an event listener to the “Go” button, which, when clicked, contains all the functionalities to get verbs from the database and set up the game. The code looks like this:
  </p>
  <pre class="p-0">
    <code class="language-javascript">d3.select('#go-button').on('click', function () {
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
      url = `https://mongodb.philippstuerner.com/api/conjugator/verbs/random?items=${items}&mode=${mode}&temps=${temps}`
  } else if (type=="frequency") {
      let items = +d3.select('#items').property('value');
      url = `https://mongodb.philippstuerner.com/api/conjugator/verbs/frequency?items=${items}&mode=${mode}&temps=${temps}`
  } else {
      let start = +d3.select('#range-start').property('value');
      let end = +d3.select('#range-end').property('value');
      if (start >= end) {
          alert(`Make sure that your start value (${start}) is smaller than your end value (${end}).`)
          return
      } else if (start &lt; 0) {
          alert(`Make sure that your start value (${start}) is greater than 0.`)
          return
      }
      url = `https://mongodb.philippstuerner.com/api/conjugator/verbs/range?start=${start}&end=${end}&mode=${mode}&temps=${temps}`
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
    </code>
  </pre>
  <p>
    Pay special attention to the <code>d3.json()</code> command and the <code>url</code> variable, since this is where I tell D3 to grab data from the MongoDB. This brings us to the backend, which basically consists of a FastAPI app that connects to my local MongoDB and queries the required data. The source code for the FastAPI backend can be found <a href="https://github.com/pstuerner/philippstuerner/blob/master/services/api/app/routers/don_conjugator.py" target="_blank">here</a>.
  </p>
  <p>
    From a technical perspective I guess there's nothing more to say. The actual deployment includes some more advanced topics like how to host the website, how to get all the required certificates or what the FastAPI backend looks like in its entirety. However, the main framework of the conjugation trainer is not too hard to develop. The entire code is on the website's <a href="https://github.com/pstuerner/philippstuerner/tree/master/services/frontend/src/components/posts/don_conjugator" target="_blank">GitHub <i class="fab fa-github"></i></a> so feel free to skip through it if you want to know more or simply get in touch with me if you have a question.<br><br>    
    Best<br>
    Philipp
  </p>
</div>
</div>
        </div>
    </article>
</template>

<script>
import { useMeta } from 'vue-meta'
import { onMounted, getCurrentInstance } from "vue";
import hljs from 'highlight.js';
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
    mounted() {
      hljs.highlightAll();
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
    components: {
        ToTopButton
    }
}
</script>

<style scoped>
</style>
