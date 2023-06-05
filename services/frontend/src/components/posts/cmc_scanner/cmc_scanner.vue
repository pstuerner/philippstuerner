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
  <p><b>tl;dr:</b> I developed a <a href="#cmc-table">small application</a> using Python, Cron, MongoDB, Node.js, and D3.js to query and analyze historical CoinMarketCap snapshots. You can find the source code on <a href="https://github.com/pstuerner/philippstuerner/tree/master/services/frontend/src/components/posts/cmc_scanner" target="_blank">GitHub <i class="fab fa-github"></i></a>!</p>
  <hr>
  <p>
    I don't think I need to introduce CoinMarketCap, as it's probably the go-to website for most people when it comes to all things related to crypto. Coins, tokens, defi, exchange stats, really.... there's a lot to discover. CoinMarketCap has been around for a while, but I have a feeling the site started offering even more services since it was acquired by Binance in early 2020. This includes a nicely documented and maintained <a href="https://coinmarketcap.com/api/" target="_blank">API</a> that is divided into different pricing tiers (Basic, Hobbyist, Startup, Standard, Professional, Enterprise) that vary in terms of available endpoints, quote limits, access to historical data, and whether commercial use is allowed. The basic tier is free and offers enough endpoints with a reasonable rate limit. Even better, someone has already worked on a <a href="https://github.com/rsz44/python-coinmarketcap" target="_blank">Python wrapper</a>, so getting started is literally not an effort 💪.
  </p>
  <p>
    The following table is the result of a small web application I developed over the last few nights. Every day at 8am UTC, I send a request to the <a href="https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest" target="_blank">latest listings</a> API endpoint to retrieve the latest statistics for the top 2000 cryptocurrencies by market cap. I store everything in a MongoDB on a local Raspberry Pi 4 and make it accessible to my website. Add some Node.js, D3, and vanilla JavaScript, and that's all you need to build a simple application like this. Interested in the source code? You can find the Vue.js component <a href="https://github.com/pstuerner/philippstuerner/blob/master/services/frontend/src/components/posts/cmc_scanner/cmc_scanner.vue" target="_blank">here <i class="fab fa-github"></i></a>.
  </p>
  <p>
    So what is it good for? It allows you to travel back in time, compare daily snapshots, and examine historical market capitalization and volume statistics. Simply select a start and end date to set a fixed time period, and define the number of coins and tokens you want to view. You can sort the table by clicking on the headings to get a better overview of the most extreme movements. If you want more information about a specific coin or token, click on its name to go to the corresponding CoinMarketCap page. Have fun playing around 🤗.
  </p>
</div>

<div class="col-md-10 col-lg-10 col-xl-10">
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4 mb-3">
      <span class="input-group-text">Top</span>
      <input id="top-selection" type="number" min=1 max=2000 value=200 class="form-control" />
    </div>
    <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4 mb-3">
      <span class="input-group-text">Start date</span>
      <select id="start-date-selection" class="form-select start"></select>
    </div>
    <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4 mb-3">
      <span class="input-group-text">End date</span>
      <select id="end-date-selection" class="form-select end"></select>
    </div>
  </div>
  <div class="row" style="min-height: 200px;">
    <div style="position: relative; overflow-x: scroll; overflow-y: hidden;">
      <div class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #2a2a2a55; opacity: 0; z-index: -1;">
        <div id="spinner" class="overlay" style="position: absolute; top: 100px; width: 100%; opacity: 0;">
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status"></div>
          </div>
        </div>
      </div>
      <table class="table table-striped table-fixed">
        <thead class="thead-dark">
          <tr>
            <!-- <th id="th_img" class="sort-none"></th> -->
            <th id="th_number" class="sort-none">#</th>
            <th id="th_number_change" class="sort-none">+/-</th>
            <th id="th_name" class="sort-none">Name</th>
            <th id="th_market_cap" class="sort-none">Market Cap</th>
            <th id="th_market_cap_diluted" class="sort-none">Diluted</th>
            <th id="th_market_cap_change" class="sort-none">+/-</th>
            <th id="th_volume" class="sort-none">Volume (24h)</th>
            <th id="th_volume_change" class="sort-none">+/-</th>
          </tr>
        </thead>
        <tbody id='cmc-table'></tbody>
      </table>
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
    data () {
        return {
            title: "CMC Scanner",
            title_meta: "CMC Scanner",
            subheading: "Historical CoinMarketCap stats",
            img: "cmcscanner_header.jpg"
        }
    },
    mounted() {
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
        $(document).ready(function(){
          $('input[type="number"]').on('input',function(){
              this.value = this.value.replace(/[^0-9]/g, '');
              var v = parseInt($(this).val());
              var min = parseInt($(this).attr('min'));
              var max = parseInt($(this).attr('max'));

              if (v < min){
                  $(this).val(min);
              } else if (v > max){
                  $(this).val(max);
              }
          })
        });

        d3.selectAll(".overlay").transition().duration(1000).style("opacity", 1);

        /**
         * @name main
         * @description Main function that runs the d3 visualization.
         * @param {Array} dataRaw
         */
        function main(dataRaw) {
            /**
             * @name fadeIn
             * @description Transition for incoming table rows.
             * @param {func} tr
             * @param {Number} duration
             */
            function fadeIn(tr, duration) {
                tr.style("opacity", 0)
                    .transition("fadeIn")
                    .duration(duration)
                    .style("opacity", 1);
            }

            /**
             * @name fadeOut
             * @description Transition for outgoing table rows.
             * @param {func} tr
             * @param {Number} duration
             */
            function fadeOut(tr, duration) {
                tr.style("opacity", 1)
                    .transition("fadeOut")
                    .duration(duration)
                    .style("opacity", 0)
                    .remove();
            }

            /**
             * @name main
             * @description Function to compute changes in start and end listings.
             * @param {Array} startListings
             * @param {Array} endListings
             */
            function listingsChange(startListings, endListings) {
                let change = [];
                endListings.forEach((el) => {
                    let sl = startListings.filter((o) => o["id"] == el["id"])[0],
                        changeEl = { listing: el };
                    if (sl) {
                        let slq = sl["quote"]["USD"],
                            elq = el["quote"]["USD"];
                        changeEl["change"] = {
                            circulating_supply:
                                el["circulating_supply"] / sl["circulating_supply"],
                            cmc_rank: sl["cmc_rank"] - el["cmc_rank"],
                            num_market_pairs:
                                el["num_market_pairs"] - sl["num_market_pairs"],
                            quote: {
                                USD: {
                                    fully_diluted_market_cap:
                                        elq["fully_diluted_market_cap"] /
                                        slq["fully_diluted_market_cap"],
                                    market_cap: elq["market_cap"] / slq["market_cap"],
                                    market_cap_color:
                                        elq["market_cap"] <= slq["market_cap"]
                                            ? "firebrick"
                                            : "forestgreen",
                                    market_cap_dominance:
                                        elq["market_cap_dominance"] -
                                        slq["market_cap_dominance"],
                                    price: elq["price"] / slq["price"],
                                    volume_24h: elq["volume_24h"] / slq["volume_24h"],
                                    volume_24h_color:
                                        elq["volume_24h"] <= slq["volume_24h"]
                                            ? "firebrick"
                                            : "forestgreen",
                                },
                            },
                        };
                    } else {
                        changeEl["change"] = {
                            circulating_supply: Infinity,
                            cmc_rank: Infinity,
                            num_market_pairs: Infinity,
                            quote: {
                                USD: {
                                    fully_diluted_market_cap: Infinity,
                                    market_cap: Infinity,
                                    market_cap_dominance: Infinity,
                                    price: Infinity,
                                    volume_24h: Infinity,
                                },
                            },
                        };
                    }

                    change.push(changeEl);
                });
                
                return change;
            }

            /**
             * @name truncate
             * @description Function to truncate long strings.
             * @param {String} str
             * @param {Number} n
             * @returns {str} Truncated string.
             */
            function truncate(str, n) {
                return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
            }

            /**
             * @name updateTable
             * @description Function to update table contents based on input settings.
             */
            function updateTable() {
                // Td for images, keep in case I want to include
                // <td><img src="${cmcImgUrl(d['listing']['id'])}" width="24" height="24"></td>
                table
                    .selectAll("tr")
                    .data(data, (d) => d.listing.cmc_rank)
                    .join(
                        (enter) =>
                            enter
                                .append("tr")
                                .call(fadeIn, 500)
                                .html(
                                    (d) => `
                                <td>${intFormatter.format(
                                    d["listing"]["cmc_rank"]
                                )}</td>
                                <td>${intFormatter.format(d["change"]["cmc_rank"])}</td>
                                <td><a href="${cmcCurrencyUrl(
                                    d["listing"]["slug"]
                                )}" target="_blank">${truncate(
                                        d["listing"]["name"],
                                        25
                                    )}</a></td>
                                <td>${currencyFormatter.format(
                                    d["listing"]["quote"]["USD"]["market_cap"]
                                )}</td>
                                <td>${currencyFormatter.format(
                                    d["listing"]["quote"]["USD"][
                                        "fully_diluted_market_cap"
                                    ]
                                )}</td>
                                <td style="color: ${
                                    d["change"]["quote"]["USD"]["market_cap_color"]
                                }">${percentFormatter.format(
                                        d["change"]["quote"]["USD"]["market_cap"] - 1
                                    )}</td>
                                <td>${currencyFormatter.format(
                                    d["listing"]["quote"]["USD"]["volume_24h"]
                                )}</td>
                                <td style="color: ${
                                    d["change"]["quote"]["USD"]["volume_24h_color"]
                                }">${percentFormatter.format(
                                        d["change"]["quote"]["USD"]["volume_24h"] - 1
                                    )}</td>
                            `
                                ),
                        (update) =>
                            update.html(
                                (d) => `
                                <td>${intFormatter.format(
                                    d["listing"]["cmc_rank"]
                                )}</td>
                                <td>${intFormatter.format(d["change"]["cmc_rank"])}</td>
                                <td><a href="${cmcCurrencyUrl(
                                    d["listing"]["slug"]
                                )}" target="_blank">${truncate(
                                    d["listing"]["name"],
                                    25
                                )}</a></td>
                                <td>${currencyFormatter.format(
                                    d["listing"]["quote"]["USD"]["market_cap"]
                                )}</td>
                                <td>${currencyFormatter.format(
                                    d["listing"]["quote"]["USD"][
                                        "fully_diluted_market_cap"
                                    ]
                                )}</td>
                                <td style="color: ${
                                    d["change"]["quote"]["USD"]["market_cap_color"]
                                }">${percentFormatter.format(
                                    d["change"]["quote"]["USD"]["market_cap"] - 1
                                )}</td>
                                <td>${currencyFormatter.format(
                                    d["listing"]["quote"]["USD"]["volume_24h"]
                                )}</td>
                                <td style="color: ${
                                    d["change"]["quote"]["USD"]["volume_24h_color"]
                                }">${percentFormatter.format(
                                    d["change"]["quote"]["USD"]["volume_24h"] - 1
                                )}</td>
                            `
                            ),
                        (exit) => exit.call(fadeOut, 500)
                    );
            }

            let startListings = dataRaw[1].listings,
                endListings = dataRaw[0].listings,
                changeListings = listingsChange(startListings, endListings),
                topN = 200,
                data = listingsChange(startListings, endListings),
                stringFormat = {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                },
                currencyFormatter = new Intl.NumberFormat("en-EN", {
                    notation: "compact",
                    style: "currency",
                    currency: "USD",
                }),
                percentFormatter = new Intl.NumberFormat("en-EN", {
                    minimumFractionDigits: 2,
                    style: "percent",
                }),
                intFormatter = new Intl.NumberFormat("en-EN", {
                    maximumFractionDigits: 0,
                    style: "decimal",
                }),
                cmcCurrencyUrl = (slug) =>
                    `https://coinmarketcap.com/currencies/${slug}/`,
                cmcImgUrl = (coinId) =>
                    `https://s2.coinmarketcap.com/static/img/coins/64x64/${coinId}.png`;

            let timestamps, startDate, endDate;

            // Set date options
            d3.json(
                "https://api.philippstuerner.com/cmcscanner/timestamps"
            ).then(function (dataRaw) {
                timestamps = dataRaw;
                let dateSelection = d3.selectAll(".form-select");

                dateSelection
                    .selectAll("option")
                    .data(timestamps)
                    .join((enter) =>
                        enter
                            .append("option")
                            .attr("value", (d) => new Date(d.timestamp).getTime())
                            .text((d) =>
                                new Date(d.timestamp).toLocaleString([], stringFormat)
                            )
                    );

                d3.select("#start-date-selection")
                    .select("option:nth-child(2)")
                    .attr("selected", true);
                d3.select("#end-date-selection")
                    .select("option:nth-child(1)")
                    .attr("selected", true);
                startDate = new Date(timestamps[1].timestamp).getTime();
                endDate = new Date(timestamps[0].timestamp).getTime();
            });

            let table = d3.select("#cmc-table");
            
            updateTable();

            // Event handlers
            d3.select("#start-date-selection").on("change", function (d) {
                if (+d.target.value >= endDate) {
                    d.target.value = startDate;
                    window.alert(
                        "Oops, that didn't work 💀\nMake sure that your start date is before the end date."
                    );
                } else {
                    startDate = +d.target.value;
                    d3.selectAll(".overlay")
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                    d3.json(
                        `https://api.philippstuerner.com/cmcscanner/listings?unixTimestamp=${startDate}`
                    ).then(function (dataRaw) {
                        startListings = dataRaw.listings;
                        changeListings = listingsChange(startListings, endListings);
                        data = changeListings.slice(0, topN);
                        updateTable();
                        d3.selectAll(".overlay")
                            .transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
                }
            });

            d3.select("#end-date-selection").on("change", function (d) {
                if (+d.target.value <= startDate) {
                    d.target.value = endDate;
                    window.alert(
                        "Oops, that didn't work 💀\nMake sure that your start date is before the end date."
                    );
                } else {
                    endDate = +d.target.value;
                    d3.selectAll(".overlay")
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                    d3.json(
                        `https://api.philippstuerner.com/cmcscanner/listings?unixTimestamp=${endDate}`
                    ).then(function (dataRaw) {
                        endListings = dataRaw.listings;
                        changeListings = listingsChange(startListings, endListings);
                        data = changeListings.slice(0, topN);
                        updateTable();
                        d3.selectAll(".overlay")
                            .transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
                }
            });

            d3.select("#top-selection").on("change", function (d) {
                topN = +d.target.value;

                data = changeListings.slice(0, topN);
                updateTable();
            });

            d3.selectAll("th").on("click", function (d) {
                const getProp = (obj, prop) => {
                    return prop.split(".").reduce((r, e) => {
                        return r[e];
                    }, obj);
                };

                let sortKeys = {
                    th_number: "listing.cmc_rank",
                    th_number_change: "change.cmc_rank",
                    th_name: "listing.name",
                    th_market_cap: "listing.quote.USD.market_cap",
                    th_market_cap_diluted: "listing.quote.USD.fully_diluted_market_cap",
                    th_market_cap_change: "change.quote.USD.market_cap",
                    th_volume: "listing.quote.USD.volume_24h",
                    th_volume_change: "change.quote.USD.volume_24h",
                };

                if (!Object.keys(sortKeys).includes(d3.select(this).attr("id"))) {
                    return;
                }

                let key = sortKeys[d3.select(this).attr("id")],
                    desc = d3.select(this).attr("class") == "sort-desc" ? true : false;

                if (desc) {
                    data.sort(function (a, b) {
                        return d3.ascending(getProp(a, key), getProp(b, key));
                    });
                    d3.select(this).attr("class", "sort-asc");
                } else {
                    data.sort(function (a, b) {
                        return d3.descending(getProp(a, key), getProp(b, key));
                    });
                    d3.select(this).attr("class", "sort-desc");
                }

                updateTable();
            });
        }

        d3.json("https://api.philippstuerner.com/cmcscanner/listings?last=2").then(function (
            dataRaw
        ) {
            main(dataRaw);
            d3.selectAll(".overlay").transition().duration(500).style("opacity", 0);
        });
      }
    },
    components: {
        ToTopButton
    }
}
</script>

<style scoped>
</style>
