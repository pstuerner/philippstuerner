var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        selectedCountryName: null,
        selectedCountryFlag: null,
        selectedCountryAnimal: null,
        selectedCountryText: null,
        selectedCountry: null,
        popupActive: false,
        images: []
    },
    computed: {
        paragraphs() {
            if (!this.selectedCountryText) {
                return "";
            }

            return this.selectedCountryText.replace(/\r/g, "").replace(/\n\n/g, "\n").split('\n')
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
        var svg = d3.select("svg")
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
            const world = await d3.json("/static/js/posts/gai_animals/world-110m.json");
            const data = await d3.csv("/static/js/posts/gai_animals/data.csv");
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
    }
});