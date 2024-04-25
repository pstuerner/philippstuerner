<template>
    <div v-if="loading" class="spinner-overlay">
        <div class="spinner"></div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0;">
        <DatePickerComponent :apiRedirect="apiRedirect" class="responsive-datepicker" @date-changed="fetchData" style="margin-left: auto; margin-right: auto" />
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
                            <th>🐻</th>
                        </tr>
                        <tr>
                            <td>{{ marketSentiment.longsRel }}%</td>
                            <td>{{ marketSentiment.shortsRel }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="Object.keys(shortToLong).length > 0">
            <DataTable :websiteRedirect="websiteRedirect" :apiRedirect="apiRedirect" heading="SHORT ➡️ LONG" :symbols="shortToLong" :headersIgnore="['daysCurrent']" />
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="Object.keys(longToLong).length > 0">
            <DataTable :websiteRedirect="websiteRedirect" :apiRedirect="apiRedirect" heading="LONG ➡️ LONG" :symbols="longToLong" :headersIgnore="['daysPast']"/>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="Object.keys(longToShort).length > 0">
            <DataTable :websiteRedirect="websiteRedirect" :apiRedirect="apiRedirect" heading="LONG ➡️ SHORT" :symbols="longToShort" :headersIgnore="['daysCurrent']" />
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; margin-top: 2em">
        <div v-if="Object.keys(shortToShort).length > 0">
            <DataTable :websiteRedirect="websiteRedirect" :apiRedirect="apiRedirect" heading="Short ➡️ Short" :symbols="shortToShort" :headersIgnore="['daysPast']" />
        </div>
    </div>
</template>

<script>
import DatePickerComponent from '@/components/posts/lookielookie/DatePickerComponent.vue';
import DataTable from '@/components/posts/lookielookie/DataTable.vue';
import axios from 'axios';

export default {
    props: ["apiRedirect", "websiteRedirect"],
    data() {
        return {
            shortToLong: [],
            longToLong: [],
            longToShort: [],
            shortToShort: [],
            date: null,
            loading: false,
        };
    },
    computed: {
        marketSentiment() {
            let longs = this.longToLong.length + this.shortToLong.length;
            let shorts = this.longToShort.length + this.shortToShort.length;

            return {
                "longsCnt": longs,
                "shortsCnt": shorts,
                "longsRel": (longs / (longs + shorts) * 100).toFixed(1),
                "shortsRel": (shorts / (longs + shorts) * 100).toFixed(1),
            }
        },
        // optionsShortToLong() {
        //     return {
        //         symbols: this.shortToLong.map(d => ["NASDAQ:" + d.ticker, d.ticker]),
        //         colorTheme: "dark",
        //         width: "100%",
        //         height: "100%"
        //     };
        // },
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
                const response = await axios.get(`${this.apiRedirect}/lookielookie/changes?year=${year}&month=${month}&day=${day}`);
                this.shortToLong = response.data.SHORT_TO_LONG;
                this.longToLong = response.data.LONG_TO_LONG;
                this.longToShort = response.data.LONG_TO_SHORT;
                this.shortToShort = response.data.SHORT_TO_SHORT;
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                this.loading = false;
            }
        },
    },
    components: {
        DatePickerComponent,
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

<!-- <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 50vh;">
    <div class="col-12" style="margin-left: auto; margin-right: auto;">
        <SymbolOverview unique-id="symbolOverviewSideToLong" :key="symbolsSideToLong" :options="optionsSideToLong" />
    </div>
</div> -->