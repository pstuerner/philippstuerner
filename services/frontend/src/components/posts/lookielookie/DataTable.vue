<template>
    <div class="section">
        <h2>{{ heading }}</h2>
        <div class="table-container">
            <table class="sticky-table">
                <thead>
                    <tr>
                        <th v-for="(header, index) in headers" :key="index" @click="updateSort(header.value)">
                            <div class="header-content">{{ header.text }}</div>
                            <input
                                type="text"
                                v-model="multiSearch[header.value]"
                                :placeholder="'Filter ' + header.text"
                                @click.stop=""
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredData" :key="index">
                        <td v-for="header in headers" :key="header.value">
                            <component :is="header.value==='symbol'?'a':'span'" :class="header.value==='symbol'?'ticker-url':''" :href="header.value==='symbol' ? `${this.websiteRedirect}/posts/lookielookie/ticker/${item[header.value]}` : ''" target="_blank">
                                <div v-if="header.format" class="formatted-value">
                                    {{ header.format(item[header.value]) }}
                                    <br>
                                    <span class="small-text">
                                        ({{ header.format(this.avgs["sector"][item["sector"]][header.value]) }}/{{ header.format(this.avgs["industry"][item["industry"]][header.value]) }})
                                    </span>
                                </div>
                                <div v-else>
                                    {{ item[header.value] }}
                                </div>
                            </component>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </template>
  
<script>
    import axios from 'axios';
    
    export default {
        name: 'DataTable',

        props: {
            heading: String,
            symbols: {
                type: Array,
                default: () => [],
            },
            headersIgnore: {
                type: Array,
                default: () => [],
            },
            apiRedirect: String,
            websiteRedirect: String
        },
        data() {
            return {
                headers: [
                    { text: "Symbol", value: "symbol" },
                    { text: "Sector", value: "sector" },
                    { text: "Industry", value: "industry" },
                    { text: "Days Current", value: "daysCurrent" },
                    { text: "Days Past", value: "daysPast" },

                    { text: "Market Cap", value: "marketCap", format: this.toHumanReadable },
                    { text: "EValue", value: "enterpriseValue", format: this.toHumanReadable },
                    { text: "Trailing P/E", value: "trailingPE", format: this.toFixedDigits },
                    { text: "Forward P/E", value: "forwardPE", format: this.toFixedDigits },

                    {text: "PEG Ratio", value: "pegRatio", format: this.toFixedDigits},
                    {text: "Price/Sales", value: "priceToSalesTrailing12Months", format: this.toFixedDigits},
                    {text: "Price/Book", value: "priceToBook", format: this.toFixedDigits},
                    {text: "EValue/Revenue", value: "enterpriseToRevenue", format: this.toFixedDigits},
                    {text: "EValue/EBITDA", value: "enterpriseToEbitda", format: this.toFixedDigits},

                    { text: "Profit Margin", value: "profitMargins", format: this.toPercent},
                    { text: "Oper. Margin", value: "operatingmargins", format: this.toPercent},

                    { text: "RoA", value: "returnOnAssets", format: this.toPercent},
                    { text: "RoE", value: "returnOnEquity", format: this.toPercent},

                    { text: "Revenue", value: "totalRevenue", format: this.toHumanReadable },
                    { text: "Revenue/Share", value: "revenuePerShare", format: this.toFixedDigits },
                    { text: "Qtr Rev. Growth", value: "revenueGrowth", format: this.toPercent },
                    { text: "EBITDA", value: "ebitda", format: this.toHumanReadable },
                    { text: "Net Income/Common", value: "netIncomeToCommon", format: this.toHumanReadable },
                    { text: "EPS", value: "trailingEps", format: this.toFixedDigits },
                    { text: "Qtr Earn. Growth", value: "earningsQuarterlyGrowth", format: this.toPercent },

                    { text: "Total Cash", value: "totalCash", format: this.toHumanReadable },
                    { text: "Total Cash/Share", value: "totalCashPerShare", format: this.toFixedDigits },
                    { text: "Total Debt", value: "totalDebt", format: this.toHumanReadable },
                    { text: "Total Debt/Equity", value: "debtToEquity", format: this.toPercent },
                    { text: "Current Ratio", value: "currentRatio", format: this.toFixedDigits },
                    { text: "Quick Ratio", value: "quickRatio", format: this.toFixedDigits },

                    { text: "Op. Cash Flow", value: "operatingCashflow", format: this.toHumanReadable },
                    { text: "Lev. Free Cash Flow", value: "freeCashflow", format: this.toHumanReadable },

                    {text: "Beta", value: "beta", format: this.toFixedDigits},
                    {text: "52W High", value: "fiftyTwoWeekHigh", format: this.toFixedDigits},
                    {text: "52W Low", value: "fiftyTwoWeekLow", format: this.toFixedDigits},

                    {text: "Last FscYear End", value: "lastFiscalYearEnd"},
                    {text: "Next FscYear End", value: "nextFiscalYearEnd"},
                    {text: "Recent Quarter", value: "mostRecentQuarter"},
                ],
                rowItems: [],
                avgs: [],
                multiSearch: {},
                sort: { column: null, direction: 'asc' },
            }
        },
        watch: {
            symbols: {
            immediate: true, 
            handler (tickers, _) {
                if (Object.keys(this.avgs).length === 0) {
                    this.fetchAvgs()
                }
                this.fetchData(tickers)
            }
            }
        },
        mounted () {
            this.headers = this.headers.filter(item => !this.headersIgnore.includes(item.value));
        },
        methods: {
            async fetchData(tickers) {
                try {
                    if (Array.isArray(tickers) && tickers.length > 1) {
                        let ts = tickers.map(function (x) {return x.ticker.toUpperCase()}).join(",")
                        const keysToInclude = this.headers.map((d) => {return d.value});
                        const response = await axios.get(`${this.apiRedirect}/lookielookie/fundamentals?tickers=${ts}`);
                        this.rowItems = response.data.map(dictionary => {
                            let fundamentals = keysToInclude.reduce((acc, key) => {
                                if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
                                    acc[key] = dictionary[key];
                                }
                                return acc;
                            }, {});
                            let tickerData = this.symbols.find(obj => obj.ticker === fundamentals.symbol);
                            fundamentals["daysCurrent"] = tickerData["cnt_t0"];
                            fundamentals["daysPast"] = tickerData["cnt_t1"];
                            return fundamentals
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            },
            async fetchAvgs() {
                try {
                    const response = await axios.get(`${this.apiRedirect}/lookielookie/avgs`);
                    this.avgs = response.data;
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            },
            toHumanReadable(number) {
                // Capture the sign of the number
                const sign = number < 0 ? "-" : "";
                // Work with the absolute value of the number for formatting
                const absNumber = Math.abs(number);

                if (absNumber < 1000) {
                    return sign + absNumber.toString();
                } else if (absNumber < 1000000) {
                    return sign + (absNumber / 1000).toFixed(2) + 'K';
                } else if (absNumber < 1000000000) {
                    return sign + (absNumber / 1000000).toFixed(2) + 'M';
                } else {
                    return sign + (absNumber / 1000000000).toFixed(2) + 'B';
                }
            },
            toFixedDigits(number) {
                if (isNaN(number)) {
                    return "nan";
                } else {
                    return number.toFixed(2);
                }
            },
            toPercent(number) {
                if (isNaN(number)) {
                    return "nan";
                } else {
                    return `${(number*100).toFixed(2)}%`;
                }
            },
            updateSort(column) {
                if (this.sort.column === column) {
                    // If already sorting by this column, toggle direction
                    this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    // New sort column, default to ascending
                    this.sort.column = column;
                    this.sort.direction = 'asc';
                }
            },
        },
        computed: {
            filteredData() {
                let data = [...this.rowItems]; // Create a shallow copy to sort

                // Sorting
                if (this.sort.column) {
                    data.sort((a, b) => {
                        const valA = a[this.sort.column];
                        const valB = b[this.sort.column];

                        let comparison = 0;
                        if (valA > valB) {
                            comparison = 1;
                        } else if (valA < valB) {
                            comparison = -1;
                        }

                        return this.sort.direction === 'asc' ? comparison : -comparison;
                    });
                }

                if (this.multiSearch) {
                    return data.filter((item) => {
                        return Object.entries(this.multiSearch).every(([key, value]) => {
                            if (value.includes("|") && !value.includes("!")) {
                                let el = value.split("|");
                                return el.some((elem) =>
                                    (item[key] || "").toString().toUpperCase().startsWith(elem.toString().toUpperCase())
                                );
                            }
                            if (value.substring(0, 1) === "!" && !value.includes("|")) {
                                let el = value.split("!");
                                return el.some((elem) =>
                                    !(item[key] || "").toString().toUpperCase().startsWith(elem.toString().toUpperCase())
                                );
                            }
                            if (value.includes("|") && value.substring(0, 1) === "!") {
                                let el = value.split("!")[1].split("|");
                                return !el.some((elem) =>
                                    (item[key] || "").toString().toUpperCase().startsWith(elem.toString().toUpperCase())
                                );
                            }
                            if (value.substring(0, 1) === ">") {
                                let el = value.split(">");
                                if (item[key] !== " ") {
                                return Number(item[key] || "") > el[1];
                                }
                            }
                            if (value.substring(0, 1) === "<") {
                                let el = value.split("<");
                                if (item[key] !== " ") {
                                return Number(item[key] || "") < el[1];
                                }
                            }
                            if (value.substring(0, 1) === "=") {
                                let el = value.split("=");
                                return (item[key] || "").toString().toUpperCase() === el[1].toString().toUpperCase();
                            }
                            return (item[key] || "").toString().toUpperCase().includes(value.toString().toUpperCase());
                        });
                    });
                } else {
                return data;
                }
            },
        }
    };
  </script>
  
  <style>
  input {
    margin-top: 8px;
    display: block;
  }

  .section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.table-container {
    width: 90%;
    height: 50vh;
    overflow: scroll;
    position: relative;
}

.sticky-table {
    width: 90%;
    height: 50vh;
    overflow: scroll;
    border-collapse: separate;
    border-spacing: 0;
}

.sticky-table th, .sticky-table td {
    background: white;
    min-width: 100px;
    max-width: 150px;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sticky-table th:first-child, .sticky-table td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    border-right: 2px solid #000;
    width: 80px;
}

@media (max-width: 768px) {
    .sticky-table th:first-child, .sticky-table td:first-child {
        width: 80px;
        min-width: 80px;
        max-width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.sticky-table thead th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  border-bottom: 2px solid #000; 
}

.sticky-table tbody th {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
}

.sticky-table thead th:first-child {
  left: 0;
  z-index: 2;
}

.header-content {
    text-align: center;
    display: block;
}

.formatted-value {
    text-align: center;
}

.small-text {
    font-size: 0.75em;
}

.ticker-url {
    outline-color: transparent;
    text-decoration: none;
    padding: 2px 1px 0;
}

.ticker-url:focus,
.ticker-url:hover {
    border-bottom: 1px solid;
}

.ticker-url[href^="http"] {
    display: inline-block;
    background: url("../../../assets/img/external-link.png") no-repeat 100% 0;
    background-size: 16px 16px;
    padding-right: 19px;
}
  </style>
  