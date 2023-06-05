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
        <div id="master-container" class="col-12">
                <div class="container-fluid d-flex justify-content-center align-items-center" style="height: 100vh; position: relative;">
                    <svg id="map" style="position: absolute; top: 0; left: 0;"></svg>
                    <div class="tooltip"></div>
                    <div class="row" style="height: 80%;">
                    <div class="col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto popup" style="max-height: 100%; display: none; z-index: 998;">
                        <div class="card text-center popup" style="overflow-y: scroll"> 
                            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #F5F5F5; border-bottom: 1px solid #D3D3D3;">
                            <h3 class="text-center mb-0 flex-grow-1">{{ selectedCountryFlag }} {{ selectedCountryName }} {{ selectedCountryFlag }}</h3>
                            <button type="button" class="close" aria-label="Close" style="font-size: 1.5rem; font-weight: bold; line-height: 1; color: black;" @click="hidePopup">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>                
                            <div class="card-body">
                            <div id="carouselExampleIndicators" class="carousel slide pt-3 pb-3" data-ride="carousel">
                                <ol class="carousel-indicators">
                                <li v-for="(image, index) in images" :key="index" :data-target="'#carouselExampleIndicators'" :data-slide-to="index" :class="index === 0 ? 'active' : ''"></li>
                                </ol>
                                <div class="carousel-inner" style="height: 100%;">
                                <div v-for="(image, index) in images" :key="index" :class="index === 0 ? 'carousel-item active' : 'carousel-item'" style="object-fit: cover;">
                                    <img class="d-block" :src="image" :alt="'Slide ' + (index + 1)">
                                </div>
                                </div>
                                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                                </a>
                            </div>
                            <h3 class="card-title">{{ selectedCountryAnimal }}</h3>
                            <p class="card-text" v-for="paragraph in paragraphs" :class="['text-justify']" :key="paragraph">{{ paragraph }}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
    </article>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { useMeta } from 'vue-meta'
import ToTopButton from '../../ToTopButton.vue';
import { onMounted, getCurrentInstance } from 'vue';

export default {
    data () {
        return {
            title: "Animals",
            title_meta: "Animals",
            subheading: "An interactive world map built with D3.js & Vue.js full of Generative AI using Stable Diffusion and ChatGPT.",
            img: "gai_animals_header.png",
            selectedCountryName: null,
            selectedCountryFlag: null,
            selectedCountryAnimal: null,
            selectedCountryText: null,
            selectedCountry: null,
            popupActive: false,
            images: []
        }
    },
    setup () {
        onMounted(() => {
            useMeta({
                title: getCurrentInstance().data.title_meta,
            })
        })
    },
    computed: {
        paragraphs() {
            if (!this.selectedCountryText) {
                return "";
            }

            return this.selectedCountryText.replace(/\r/g, "").replace(/\n\n/g, "\n").split('\n')
        },
        mastheadStyle() {
            return {
                'background-image': 'url(' + require(`@/assets/img/${this.img}`) + ')',
                'height': 'calc(20rem + 57px)',
                'width': '100%'
            }
        }
    },
    methods: {
        showPopup: function () {
            if (this.selectedCountry) {
                this.popupActive = false;
                this.images = [];
                var popup = d3.select(".popup");
                popup.style("display", "flex");
                document.addEventListener("click", this.hidePopupOutside);
            }
        },
        hidePopup: function () {
            var popup = d3.select(".popup");
            this.images = [];
            popup.style("display", "none");
            document.removeEventListener("click", this.hidePopupOutside);
        },
        hidePopupOutside: function (event) {
            var popup = d3.select(".popup");
            if (!popup.node().contains(event.target) && this.popupActive) {
                this.hidePopup();
            }
            this.popupActive = true;
        },
        fetchURLs: function (country) {
            d3.json(`https://pi.philippstuerner.com/image/find/?filepath=animals_of_the_world&prefix=${country}`).then(function (d) {
                let filenames = Object.values(d);
                let url_prefix = "https://pi.philippstuerner.com/image/serve/?filepath=animals_of_the_world&filename="
                let urls = filenames.map(str => url_prefix + str);
                this.images = urls;
            }.bind(this))
        }
    },
    mounted: function () {
        var self = this;
        var margin = { top: 10, right: 10, bottom: 10, left: 10 };
        var width = window.innerWidth - margin.left - margin.right;
        var height = window.innerHeight - margin.top - margin.bottom;
        var projection = d3.geoNaturalEarth1()
            .rotate([-9, 0])
            .scale([1500 / (2 * Math.PI)])
            .translate([width / 2, height / 2]);
        var path = d3.geoPath(projection);
        var svg = d3.select("#map")
            .attr("viewBox", [0, 0, width, height])
            .call(d3.zoom()
                .extent([[0, 0], [width, height]])
                .scaleExtent([1, 8])
                .on("zoom", zoomed))
            .append("g");
        var tooltip = d3.select("div.tooltip");
        var top = svg.node().getBoundingClientRect().top + window.pageYOffset;
        var left = svg.node().getBoundingClientRect().left + window.pageXOffset;

        const loadData = async () => {
            const world = await d3.json("/data/world-110m.json");
            const data = await d3.csv("/data/data.csv");
            ready(null, world, data);
        }

        loadData();

        function ready(error, world, data) {
            if (error) throw error;
            const countries1 = topojson.feature(world, world.objects.countries).features;
            self.countries = countries1.filter(function (d) {
                return data.some(function (n) {
                    if (d.id == n.id) return d.name = n.name;
                })
            });

            svg.selectAll("path")
                .data(self.countries)
                .join("path")
                .attr("class", "country")
                .attr("stroke", "black")
                .attr("stroke-width", 0.5)
                .attr("fill", "#F5F5F5")
                .attr("data-code", d => data.filter(n => n.name == d.name)[0].code)
                .attr("data-flag", d => data.filter(n => n.name == d.name)[0].flag)
                .attr("data-name", d => data.filter(n => n.name == d.name)[0].name)
                .attr("d", path)
                .on("mouseover", (event, d) => {
                    d3.select(event.currentTarget)
                        .attr("fill", "#D3D3D3")
                        .attr("stroke-width", 1);
                    tooltip.style("hidden", false).html(d.name);
                })
                .on("mousemove", (event, d) => {
                    tooltip.classed("hidden", false)
                        .style("top", (event.pageY - top + 20) + "px")
                        .style("left", (event.pageX - left + 10) + "px")
                        .html(d.name);
                })
                .on("mouseout", (event, d) => {
                    d3.select(event.currentTarget)
                        .attr("fill", "#F5F5F5")
                        .attr("stroke-width", 0.5);
                    tooltip.classed("hidden", true);
                })
                .on("click", (event, d) => {
                    self.selectedCountry = d3.select(event.currentTarget).attr("data-code");
                    self.selectedCountryName = d3.select(event.currentTarget).attr("data-name");
                    self.selectedCountryFlag = d3.select(event.currentTarget).attr("data-flag");
                    self.selectedCountryAnimal = data.filter(n => n.name == self.selectedCountryName)[0].animal;
                    self.selectedCountryText = data.filter(n => n.name == self.selectedCountryName)[0].text;
                    self.showPopup();
                    self.fetchURLs(self.selectedCountry);
                    tooltip.classed("hidden", true);
                });
        }

        function zoomed(event) {
            const { transform } = event;
            svg.attr("transform", transform);
            svg.attr("stroke-width", 1 / transform.k);
        }
    },
    components: {
        ToTopButton
    }
}
</script>

<style scoped>
    #map {
      width: 100%;
      height: 100%;
      position: center;
      background-color: #b5ddfc;
    }
    .hidden {
      display: none;
    }
    div.tooltip {
      color: #222; 
      background: #fff; 
      border-radius: 3px; 
      box-shadow: 0px 0px 2px 0px #a6a6a6; 
      padding: .2em; 
      text-shadow: #f5f5f5 0 1px 0;
      opacity: 0.9; 
      position: absolute;
    }
    .carousel {
      height: 75%;
    }
    .carousel-item {
      height: 100%;
    }
    .carousel-item img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .carousel-control-next,
    .carousel-control-prev {
      filter: invert(100%);
    }
    body {
      margin: 0;
      padding: 0;
    }
</style>