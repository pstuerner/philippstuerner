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
  <div class="row" style="text-align: justify;">
    <p style="margin-top: 2rem;">
      <b>tl;dr:</b> I’ve developed a Telegram bot to help me practice Spanish vocabulary. You can use the bot as well, simply download the Telegram app, search for <a href="https://t.me/donquijote_ps_bot" target="_blank">@donquijote_ps_bot</a>, send <code>/start</code> and begin learning. Or simply scan the following QR code 🤗
    </p>
    <p style="text-align: center;">
      <img src="@/assets/img/bot_qr.png" alt="QR code for chatbot" style="width: 20vh;">
    </p>
    <p>
    Continue reading if you’re interested in how I got the vocabulary data and how I’ve set up the bot itself. You can find the source code on <a href="https://github.com/pstuerner/donquijote" target="_blank">GitHub <i class="fab fa-github"></i></a>!
    </p>
    <hr>
  </div>
  <h3>Introduction</h3>
  <p>
    So why would I bother coding my own vocabulary trainer? I mean the world is full of learning applications and definitely there are plenty of ways to improve your Spanish. However, most vocabulary trainers have one or more flaws that always bothered me, which is why I wanted to come up with my own solution.
  </p>
  <p>
    A vocabulary trainer should be simple, like a WhatsApp chat. Fancy features like entertaining games or global ranking lists are nice to have but not really necessary for the learning experience itself. Furthermore, it’s either expensive to buy already existing lists of vocabularies or a lot of work to embed your own lists word by word.
  </p>
  <p>
    With DonQuijote I tried to solve these issues. I probably would have developed the bot with WhatsApp, however Telegram’s bot management is a lot better. The vocabulary list comes from a frequency dictionary and contains the 5000 most used words in the Spanish corpus. I’ll explain in more detail how I retrieved the words and how I’ve deployed the bot itself. 
  </p>
  <h3>The Vocabulary</h3>
  <p>
    As always, high quality raw data turned out to be one of the toughest parts of this project. There are plenty of “most important Spanish words” lists online, however, most of the time they lack quality and it’s not guaranteed that the included words are significant at all. In fact, the significance of words turns out to be really important since it’s not really about how many words you know, but rather which words you know.
  </p>
  <p>
    Apparently, complete fluency is in the 10,000 word range, however, you're not required to know all of these words to have a conversation. This is where so called frequency dictionaries come in handy, since they provide a list of words according to how frequently they appear in the respective language. Hence, I bought the frequency dictionary composed by Mark Davies, who is a professor of linguistics at the Brigham Young University. You can find the book on <a href="https://www.amazon.de/Frequency-Dictionary-Spanish-Routledge-Dictionaries/dp/1138686549" target="_blank">Amazon</a>, including a free reading sample where you can find more information about how he defines “frequency”. In the end, the book contains a list of 5000 Spanish words, ordered from most to least frequent. Here are some of the most frequently used Spanish words.
  </p>
  <div class="row">
    <div class="row p-0">
      <div id="vocabs-sp" class="justify-content-center" style="display: flex; width: 100%; height: 10vh;"></div>
    </div>
    <div class="row p-0">
      <div id="vocabs-en" class="justify-content-center" style="display: flex; width: 100%; height: 10vh;"></div>
    </div>
  </div>
  <p>
    I bought and downloaded the book as a PDF and wrote a small Python script to extract all words from the text body. Afterwards I  applied some simple string and regex formatting to split the raw data into its respective English and Spanish parts. Finally, I’ve ingested all the preprocessed vocabularies into a MongoDB so I can query and consume them later on.
  </p>
  <h3>The Bot <span>&#8211;</span> Functionalities</h3>
  <p>
    DonQuijote is built with Python-telegram-bot, which is a framework that makes it easy to build your own chatbot using the Telegram Bot API. Its asynchronous interface allows you to perform multiple tasks concurrently and access common endpoints and events. This makes it an ideal choice for building chatbots that can listen for events and respond to messages in real-time.
  </p>
  <p>
    One of the great features of python-telegram-bot is that it offers an asynchronous interface, which means that you can perform multiple tasks concurrently. This is especially useful when working with the Telegram Bot API, which allows you to listen for events and respond to messages in real-time.
  </p>
  <p>
    In addition to its asynchronous interface and easy access to common endpoints and events, python-telegram-bot is also well-documented and comes with plenty of examples and resources to help you get started. If you're interested in learning more about python-telegram-bot and building your own chatbot, be sure to check out the project on <a href="https://github.com/python-telegram-bot/python-telegram-bot" target="_blank">GitHub</a>. 
  </p>
  <p>
    DonQuijote covers a variety of different functionalities, which I'll briefly cover in the following.
  </p>
  <h5>User setup</h5>
  <p>
    One of the first things that DonQuijote does is to check if a user is registered or not. If a user is not registered yet, the bot will ask for some initial setup information such as name, words per day, and learning schedule. This information is used to tailor the learning experience to the user's specific needs and goals.
  </p>
  <div class="row mb-5 mt-5">
    <div class="justify-content-center" style="display: flex;">
      <figure class="gif">
        <img src="@/assets/img/dq_intro.png" style="max-width: auto; height: 60vh;" alt="Static Image" data-alt="/videos/dq_intro.gif">
      </figure>
    </div>
  </div>
  <h5>Settings</h5>
  <p>
    In addition to the initial setup, DonQuijote also allows users to change their existing settings at any time. For example, if you want to change your name or adjust your learning schedule, you can do so using the settings function. This flexibility makes it easy to customize the learning experience to fit your changing needs and preferences.
  </p>
  <div class="row mb-5 mt-5">
    <div class="justify-content-center" style="display: flex;">
      <figure class="gif">
        <img src="@/assets/img/dq_settings.png" style="max-width: auto; height: 60vh;" alt="Static Image" data-alt="/videos/dq_settings.gif">
      </figure>
    </div>
  </div>
  <h5>Reminders</h5>
  <p>
    One of the key features of DonQuijote is the ability to set up daily reminders to help users stay on track with their learning. Users can set up to three reminders per day, and the bot will send a message at the specified time to remind you to review your vocabulary. This can be a helpful way to ensure that you don't forget to practice and make progress with your learning.
  </p>
  <div class="row mb-5 mt-5">
    <div class="justify-content-center" style="display: flex;">
      <figure>
        <img src="@/assets/img/dq_reminder.png" style="max-width: auto; height: 70vh;">
      </figure>
    </div>
  </div>
  <h5>Learn</h5>
  <p>
    The core of DonQuijote's functionality is its ability to help users learn new vocabulary words. To do this, the bot uses a spaced repetition system (SRS) to present users with words that they need to review. Depending on how well a user remembers a word, the bot will ask again in different time intervals to help the user memorize the word for good. This process is an effective way to help users learn and retain new vocabulary over the long term.
  </p>
  <div id="accordion">
    <div class="card">
        <div class="card-header" id="headingOne" style="background-color: transparent;">
            <h5 class="mb-0">
                <button class="accordion-button collapsed" data-toggle="collapse" data-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    What is Spaced Repetition System (SRS)?
                </button>
            </h5>
        </div>

        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              Spaced repetition system (SRS) is a learning technique that involves reviewing information at increasing intervals of time. The goal of SRS is to help users retain new information over the long term by presenting it to them at optimal intervals for review. This can be an effective way to improve learning and retention, especially when combined with other effective learning strategies.
            </div>
        </div>
    </div>
  </div>
  <div class="row mb-5 mt-5">
    <div class="justify-content-center" style="display: flex;">
      <figure class="gif">
        <img src="@/assets/img/dq_play.png" style="max-width: auto; height: 60vh;" alt="Static Image" data-alt="/videos/dq_play.gif">
      </figure>
    </div>
  </div>
  <p>
    If you're not interested in the technical details, you can simply sign up for the bot and start studying right away. However, if you're interested in what the bot looks like under the hood, read on to learn more about its functionalities and how they are implemented.
  </p>
  <h3>The Bot <span>&#8211;</span> Under the Hood</h3>
  <p>
    The source code for DonQuijote is available on GitHub, and I'll explain the different components by walking you through the project's file tree: 
  </p>
  <pre class="file-tree">├── donquijote
│   ├── __init__.py
│   ├── __main__.py
│   ├── bot
│   │   ├── __init__.py
│   │   ├── conversationbot.py
│   │   └── remindbot.py
│   ├── conversations
│   │   ├── cancel.py
│   │   ├── helpers.py
│   │   ├── init.py
│   │   ├── learn.py
│   │   ├── play.py
│   │   └── settings.py
│   ├── db
│   │   ├── __init__.py
│   │   └── mongodb.py
│   ├── tests
│   │   └── test_progress.py
│   └── util
│       ├── const.py
│       └── util.py
├── Dockerfile.bot
├── Dockerfile.reminder
├── docker-compose.yaml
├── pyproject.toml
├── requirements.txt
└── setup.py</pre>
  <p>
    The top-level directories in the project include <code>donquijote</code>, <code>tests</code>, and <code>util</code>. The top-level directory, <code>donquijote</code>, contains the main code for the project, as well as several subdirectories that hold related code and resources.
  </p>
  <p>
    The <code>__init__.py</code> and <code>__main__.py</code> files in the top-level directory are both special files in Python. The <code>__init__.py</code> file is used to mark the <code>donquijote</code> directory as a Python package, which allows it to be imported and used as a module in other parts of the project. The <code>__main__.py</code> file is the entry point for the project, meaning that it will be executed when the project is run as a script.
  </p>
  <p>
    The <code>bot</code> directory in the DonQuijote project contains code related to the chatbot functionality of the project. It includes the <code>conversationbot.py</code> and <code>remindbot.py</code> files, which are key components of the chatbot functionality as they work together to provide a seamless and effective learning experience for users.
  </p>
  <p>
    The <code>conversationbot.py</code> file includes the conversation handlers for the initial set up, settings, and learning capabilities of the bot. It defines the logic for how the bot responds to user input and manages the flow of conversation. For example, the following <code>play_handler</code> object represents a conversation flow that starts with the <code>/play</code> command, and then allows the user to enter vocabulary words.
  </p>
  <pre class="p-0"><code class="language-python">play_handler = ConversationHandler(
    entry_points=[CommandHandler("play", play)],
    states={
        0: [
            MessageHandler(filters.TEXT & (~filters.COMMAND), vocab),
            CommandHandler("counts", counts),
        ]
    },
    fallbacks=[CommandHandler("cancel", cancel)],
    conversation_timeout=300,
)</code></pre>
  <div id="accordionTwo">
    <div class="card">
        <div class="card-header" id="accordionTwoheadingOne" style="background-color: transparent;">
            <h5 class="mb-0">
                <button class="accordion-button collapsed" data-toggle="collapse" data-target="#accordionTwocollapseOne"
                    aria-expanded="true" aria-controls="accordionTwocollapseOne">
                    More information
                </button>
            </h5>
        </div>
        <div id="accordionTwocollapseOne" class="collapse" aria-labelledby="accordionTwoheadingOne" data-parent="#accordionTwo">
            <div class="card-body">
              <p>
                The <code>ConversationHandler</code> is a class in the <code>telegram.ext</code> module of the <code>python-telegram-bot</code> library that allows you to define a conversation flow with multiple states. It takes several arguments:
              </p>
              <ul>
                <li><code>entry_points</code>: This is a list of Handler objects that specify the ways a conversation with this handler can be initiated. In this case, the conversation can be initiated by the <code>/play</code> command.</li>
                <li><code>states</code>: This is a dictionary of states, where each key is an integer representing a state and each value is a list of Handler objects that specify the actions that can be taken in that state. In this case, there is only one state, state <code>0</code>, and it has two possible actions: a <code>MessageHandler</code> that listens for any text message that is not a command, and a <code>CommandHandler</code> that listens for the <code>/counts</code> command.</li>
                <li><code>fallbacks</code>: This is a list of Handler objects that specify the actions that should be taken if the user's input does not match any of the handlers in the current state. In this case, the <code>/cancel</code> command can be used to cancel the conversation at any time.</li>
                <li><code>conversation_timeout</code>: This is an optional argument that specifies the number of seconds the bot should wait for input from the user before the conversation times out. In this case, the timeout is set to <code>300</code> seconds (5 minutes).</li>
              </ul>
            </div>
        </div>
    </div>
  </div>
  <p>
    The <code>remindbot.py</code> file includes all of the functionalities for sending reminders to users based on their learning schedule. It defines the logic for scheduling and sending reminders at the appropriate times.
  </p>
  <p>
    The <code>conversations</code> directory in the file tree contains code that handles specific types of conversations in the chatbot. Each of the Python files in this directory defines a set of functions and variables that are used to handle different types of conversations.
  </p>
  <p>
    The <code>cancel.py</code> file, for example, contains functions for cancelling actions or processes that the chatbot is in the middle of. The <code>init.py</code> file contains functions for handling the initial set up of a new user, including asking for their name and learning schedule. The <code>settings.py</code> file contains functions for handling user requests to change their settings, such as their name or learning schedule.
  </p>
  <p>
    The <code>learn.py</code> and <code>play.py</code> files include the code to send the user English words, wait for a response, and check if the vocabulary was guessed correctly. This is a key part of the chatbot's learning functionality, as it allows users to practice and test their knowledge of new vocabulary words.
  </p>
  <p>
    By separating the code for different types of conversations into different files, the project is able to keep its code organized and easier to maintain. This can make it easier for developers to understand and work with the code, and it can also help to prevent conflicts and errors when working with the chatbot.
  </p>
  <p>
    The <code>db</code> directory contains code related to the database that the project uses to store data. In this case, the <code>mongodb.py</code> file implements a connection to a MongoDB database. The <code>tests</code> directory contains test code for the project. The <code>test_progress.py</code> file in this directory includes unit tests that are used to verify the correctness of the project's code. The <code>util</code> directory contains utility functions and constants that are used throughout the project. The <code>const.py</code> file in this directory defines a set of constants that are used in various parts of the project, and the <code>util.py</code> file contains utility functions that perform common tasks such as parsing dates and times.
  </p>
  <p>
    The remaining files in the top-level directory of the project include <code>Dockerfile.bot</code>, <code>Dockerfile.reminder</code>, <code>docker-compose.yaml</code>, <code>pyproject.toml</code>, <code>requirements.txt</code>, and <code>setup.py</code>. These files are used to package and deploy the project, either locally or in a production environment.
  </p>
  <h3>Closing</h3>
  <p>
    DonQuijote was a fun and interesting project to work on, even if it did have a bit of a challenging deployment process. I encountered a few issues along the way, like timeouts and expired HTTPS sessions due to connection issues with the Telegram servers, however, not something that a try/except phrases couldn't solve. Not too pretty, but it works. The chatbot is still under development and may include some new features in the future. In the meantime, I've been using it to improve my Spanish and I must say, it's been a very helpful experience so far. Overall, the chatbot has proven to be a useful tool for language learning and I'm excited to see what the future holds for it.
  </p>
</div>
</div>
        </div>
    </article>
</template>

<script>
import { useMeta } from 'vue-meta'
import { onMounted, getCurrentInstance } from "vue";
import * as d3 from 'd3';
import _ from 'lodash';
import hljs from 'highlight.js';
import ToTopButton from '../../ToTopButton.vue';

export default {
    data () {
        return {
            title: "Don Quijote",
            title_meta: "Don Quijote",
            subheading: "Cervantes approved vocabulary trainer to improve your Spanish",
            img: "donquijote_header.png"
        }
    },
    mounted () {
        hljs.highlightAll();
        this.init();
    },
    unmounted () {
      this.interval.stop()
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
          d3.select("#vocabs-en").selectAll("svg").remove();
          d3.select("#vocabs-sp").selectAll("svg").remove();
            var getGif = function() {
                var gif = [];
                $('img').each(function() {
                    if ($(this).attr('data-alt') != undefined) {
                        var data = $(this).data('alt');
                        gif.push(data);
                    }
                });
                return gif;
            }
            var gif = getGif();

            // Preload all the GIF.
            var image = [];
            
            $.each(gif, function(index) {
                image[index]     = new Image();
                image[index].src = gif[index];
            });

            $('figure').on('click', function() {
                var $this   = $(this),
                    $index  = $this.index(),
                    $img    = $this.children('img'),
                    $imgSrc = $img.attr('src'),
                    $imgAlt = $img.attr('data-alt');
                
                try {
                  var $imgExt = $imgAlt.split('.');
                  if($imgExt[1] === 'gif') {
                      $img.attr('src', $img.data('alt')).attr('data-alt', $imgSrc);
                  } else {
                      $img.attr('src', $imgAlt).attr('data-alt', $img.data('alt'));
                  }

                  $this.toggleClass('play');
                } catch {
                  return null
                }
            })

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
            this.interval = d3.interval(function () {
                i = _.random(0, vocabs.length);
                update(gEn, vocabs[i]["en"]);
                update(gSp, vocabs[i]["sp"]);
            }, 2500);
    }},
    components: {
        ToTopButton
    }
}
</script>

<style scoped>
  figure.gif {
    width: auto;
    max-height: 80vh;
    margin: 0 auto;
    float: left;
    /* padding: 10px; */
    position: relative;
    cursor: pointer;
  }
  figure.gif:before,
  figure.gif:after {
    position: absolute;
  }
  figure.gif:before {
    /* top: 103.5px; */
    top: 50%;
    left: 50%;
    margin-left: -25px;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.7);
    border-radius: 25px;
    background-color: rgba(204, 209, 217, 0.3);
    font-family: 'Ionicons';
    content: '\f215';
    text-align: center;
    line-height: 45px;
    font-size: 19px;
    color: #F5F7FA;
  }
  figure.gif:after {
    content: 'gif';
    position: absolute;
    display: inline-block;
    width: 40px;
    text-align: center;
    top: 20px;
    right: 20px;
    font-size: 11px;
    font-weight: 600;
    padding: 5px;
    border-radius: 3px;
    color: #656D78;
    background-color: white;
    text-transform: uppercase;
  }
  figure.gif.play:before {
    display: none;
  }
  figure.gif.play:after {
    color: #fff;
    background-color: #8CC152;
  }
  .enter {
    /* fill: green; */
    fill: #333;
  }

  .update {
    fill: #333;
  }

  .exit {
    /* fill: brown; */
    fill: #333;
  }
</style>
