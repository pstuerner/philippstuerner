<template>
    <div v-if="loading" class="spinner-overlay">
        <div class="spinner"></div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0;">
        <DatePickerComponent class="responsive-datepicker" @date-changed="fetchData" style="margin-left: auto; margin-right: auto" />
        <div v-if="!date" style="display: flex; justify-content: center;">
            <p style="text-align: center;">🫨 Nothing to see 🫨<br>Pick a date</p>
        </div>
        <div v-else-if="date && !loading">
            <div class="row" style="text-align: center;">
                <h3>Market Sentiment</h3>
            </div>
            <div class="row" style="width: 40%; text-align: center; margin-left: auto; margin-right: auto;">
                <table>
                    <tbody>
                        <tr>
                            <th>🐂</th>
                            <th>🦀</th>
                            <th>🐻</th>
                        </tr>
                        <tr>
                            <td>{{ marketSentiment.longsRel }}%</td>
                            <td>{{ marketSentiment.sidesRel }}%</td>
                            <td>{{ marketSentiment.shortsRel }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="Object.keys(symbolsSideToLong).length > 0">
            <DataTable heading="SIDE ➡️ LONG" :symbols="symbolsSideToLong" />
            <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
                <div class="col-12" style="margin-left: auto; margin-right: auto;">
                    <SymbolOverview unique-id="symbolOverviewSideToLong" :key="symbolsSideToLong" :options="optionsSideToLong" />
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="Object.keys(symbolsLongToLong).length > 0">
            <DataTable heading="LONG ➡️ LONG" :symbols="symbolsLongToLong" />
            <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
                <div class="col-12" style="margin-left: auto; margin-right: auto;">
                    <SymbolOverview unique-id="symbolOverviewLongToLong" :key="symbolsLongToLong" :options="optionsLongToLong" />
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="Object.keys(symbolsShortToSide).length > 0">
            <DataTable heading="SHORT ➡️ SIDE" :symbols="symbolsShortToSide" />
            <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
                <div class="col-12" style="margin-left: auto; margin-right: auto;">
                    <SymbolOverview unique-id="symbolOverviewShortToSide" :key="symbolsShortToSide" :options="optionsShortToSide" />
                </div>
            </div>
        </div>
    </div>

    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="symbolsSideToShort.length">
            <DataTable heading="SIDE ➡️ SHORT" :symbols="symbolsSideToShort" />
            <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
                <div class="col-12" style="margin-left: auto; margin-right: auto;">
                    <SymbolOverview unique-id="symbolOverviewSideToShort" :key="symbolsSideToShort" :options="optionsSideToShort" />
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="symbolsShortToShort.length">
            <DataTable heading="SHORT ➡️ SHORT" :symbols="symbolsShortToShort" />
            <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
                <div class="col-12" style="margin-left: auto; margin-right: auto;">
                    <SymbolOverview unique-id="symbolOverviewShortToShort" :key="symbolsShortToShort" :options="optionsShortToShort" />
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="symbolsLongToSide.length">
            <DataTable heading="LONG ➡️ SIDE" :symbols="symbolsLongToSide" />
            <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
                <div class="col-12" style="margin-left: auto; margin-right: auto;">
                    <SymbolOverview unique-id="symbolOverviewLongToSide" :key="symbolsLongToSide" :options="optionsLongToSide" />
                </div>
            </div>
        </div>
    </div>

    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="symbolsSideToSide.length">
            <DataTable heading="SIDE ➡️ SIDE" :symbols="symbolsSideToSide" />
            <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
                <div class="col-12" style="margin-left: auto; margin-right: auto;">
                    <SymbolOverview unique-id="symbolOverviewSideToSide" :key="symbolsSideToSide" :options="optionsSideToSide" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DatePickerComponent from '@/components/posts/lookielookie/DatePickerComponent.vue';
import DataTable from '@/components/posts/lookielookie/DataTable.vue';
import { SymbolOverview } from '@/assets/js/tradingview-vue.js';
import axios from 'axios';

export default {
    data() {
        return {
            symbolsSideToLong: [],
            symbolsLongToLong: [],
            symbolsSideToShort: [],
            symbolsShortToSide: [],
            symbolsShortToShort: [],
            symbolsLongToSide: [],
            symbolsSideToSide: [],
            date: null,
            loading: false
        };
    },
    computed: {
        marketSentiment() {
            let longs = this.symbolsLongToLong.length + this.symbolsSideToLong.length;
            let shorts = this.symbolsShortToShort.length + this.symbolsSideToShort.length;
            let sides = this.symbolsLongToSide.length + this.symbolsShortToSide.length + this.symbolsSideToSide.length;

            return {
                "longsCnt": longs,
                "shortsCnt": shorts,
                "sidesCnt": sides,
                "longsRel": (longs / (longs + shorts + sides) * 100).toFixed(1),
                "shortsRel": (shorts / (longs + shorts + sides) * 100).toFixed(1),
                "sidesRel": (sides / (longs + shorts + sides) * 100).toFixed(1),
            }
        },
        optionsSideToLong() {
            return {
                symbols: this.symbolsSideToLong,
                colorTheme: "dark",
                width: "100%",
                height: "100%"
            };
        },
        optionsSideToShort() {
            return {
                symbols: this.symbolsSideToShort,
                colorTheme: "dark",
                width: "100%",
                height: "100%"
            };
        },
        optionsLongToLong() {
            return {
                symbols: this.symbolsLongToLong,
                colorTheme: "dark",
                width: "100%",
                height: "100%"
            };
        },
        optionsShortToSide() {
            return {
                symbols: this.symbolsShortToSide,
                colorTheme: "dark",
                width: "100%",
                height: "100%"
            };
        },
        optionsShortToShort() {
            return {
                symbols: this.symbolsShortToShort,
                colorTheme: "dark",
                width: "100%",
                height: "100%"
            };
        },
        optionsLongToSide() {
            return {
                symbols: this.symbolsLongToSide,
                colorTheme: "dark",
                width: "100%",
                height: "100%"
            };
        },
        optionsSideToSide() {
            return {
                symbols: this.symbolsSideToSide,
                colorTheme: "dark",
                width: "100%",
                height: "100%"
            };
        },
    },
    methods: {
        async fetchData(date) {
            if (date == null) {return}
            this.loading = true;
            this.date = date;
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            try {
                const response = await axios.get(`https://api.philippstuerner.com/lookielookie/changes?year=${year}&month=${month}&day=${day}`);
                this.updateSymbolOverviews(response.data)
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                this.loading = false;
            }
        },
        updateSymbolOverviews(signals) {
            this.symbolsSideToLong = signals.SIDE_TO_LONG.map(ticker => ["NASDAQ:" + ticker, ticker]);
            this.symbolsLongToLong = signals.LONG_TO_LONG.map(ticker => ["NASDAQ:" + ticker, ticker]);
            this.symbolsSideToShort = signals.SIDE_TO_SHORT.map(ticker => ["NASDAQ:" + ticker, ticker]);
            this.symbolsShortToSide = signals.SHORT_TO_SIDE.map(ticker => ["NASDAQ:" + ticker, ticker]);
            this.symbolsShortToShort = signals.SHORT_TO_SHORT.map(ticker => ["NASDAQ:" + ticker, ticker]);
            this.symbolsLongToSide = signals.LONG_TO_SIDE.map(ticker => ["NASDAQ:" + ticker, ticker]);
            this.symbolsSideToSide = signals.SIDE_TO_SIDE.map(ticker => ["NASDAQ:" + ticker, ticker]);
        },
    },
    components: {
        DatePickerComponent,
        SymbolOverview,
        DataTable
    }
}
</script>

<style scoped>
.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.spinner {
    border: 6px solid rgba(0,0,0,0.1);
    border-radius: 50%;
    border-top: 6px solid #3498db;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.responsive-datepicker {
    width: 25vw; /* Default width for desktop */
}

@media (max-width: 768px) { /* This breakpoint targets tablets and mobile phones */
    .responsive-datepicker {
        width: 80vw; /* Adjusted width for smaller devices */
    }
}
</style>
