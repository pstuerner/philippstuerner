<template>
  <ToTopButton />
  
  <header class="masthead" style="height: calc(20rem + 57px); width: 100%;">
    <div id="about-header" style="background-color: black; position: absolute; left: 0; top: 0; width: 100%; height: 100%;"></div>
    <div class="center" style="z-index: 1;">
      <div class="site-heading">
          <h1>{{ title }}</h1>
          <span class="subheading">{{ subheading }}</span>
      </div>
  </div>
  </header>

  <article data-toc data-toc-id="main-toc" data-toc-class="toc-custom" data-toc-parent-id="toc-parent" class="mb-4">
    <div class="container px-4 px-lg-5" style="text-align: justify;">
        <div class="row gx-4 gx-lg-5 justify-content-center">
          <div id="master-container" class="col-md-10 col-lg-10 col-xl-8">
            <p>
              I'm a data scientist at ING Germany. This website is my personal playground on which I develop side projects, try out new technologies and talk about ideas worth sharing. I am interested in everything related to machine learning and data visualization. That's probably why most of my content is either related to one or both of these topics. My main tools are Python, D3.js, Vue.js, and Docker. Feel free to skip through my existing content. I really hope that you find it useful 🙂 I'm always happy to catch up, so don't hesitate to get in touch with me by mail or LinkedIn.<br><br>Best,<br>Philipp
            </p>
          </div>
        </div>
    </div>
  </article>
</template>

<script>
import * as d3 from 'd3';
import { useMeta } from 'vue-meta'
import { onMounted, getCurrentInstance } from "vue";
import ToTopButton from './ToTopButton.vue';

export default {
  data () {
      return {
          title: "Hello 🤗",
          title_meta: "About",
          subheading: "I'm Philipp 👋"
      }
  },
  setup () {
      onMounted(() => {
          useMeta({
              title: getCurrentInstance().data.title,
          })
      })
  },
  mounted () {
    this.init()
  },
  computed: {
      mastheadStyle() {
          return {
              'height': 'calc(20rem + 57px)',
              'width': '100%'
          }
      }
  },
  methods: {
    init () {
        var n = 40,
            random = d3.randomNormal(0, 0.4),
            data = d3.range(n).map(random);

        var svg = d3
                .select("#about-header")
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%"),
            margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width =
                d3.select("#about-header").node().getBoundingClientRect().width -
                margin.left -
                margin.right,
            height =
                d3.select("#about-header").node().getBoundingClientRect().height -
                margin.top -
                margin.bottom,
            g = svg
                .append("g")
                .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                );

        var x = d3
            .scaleLinear()
            .domain([1, n - 2])
            .range([0, width]);

        var y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

        var line = d3
            .line()
            .curve(d3.curveBasis)
            .x(function (d, i) {
                return x(i);
            })
            .y(function (d, i) {
                return y(d);
            });

        g.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        g.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .on("start", tick);

        /**
         * @name tick
         * @description A function to add new datapoints to the line graph.
         */
        function tick() {
            // Push a new data point onto the back.
            data.push(random());

            // Redraw the line.
            d3.select(this)
                .attr("d", line)
                .attr("transform", null)
                .style("stroke", "white")
                .style("opacity", 0.8);

            // Slide it to the left.
            d3.active(this)
                .attr("transform", "translate(" + x(0) + ",0)")
                .transition()
                .on("start", tick);

            // Pop the old data point off the front.
            data.shift();
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
