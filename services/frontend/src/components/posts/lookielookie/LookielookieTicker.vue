<template>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0;">
        <div class="col-12" style="margin-left: auto; margin-right: auto; display: flex; justify-content: center;">
            <SymbolInfo unique-id="symbolInfo1" key="symbolInfo1" :options="optionsSymbolInfo" style="width: 100%;"/>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 75vh;">
        <div class="col-12" style="margin-left: auto; margin-right: auto;">
            <Chart unique-id="chart2" key="chart2" :options="optionsChart" />
        </div>
    </div>
    <div class="row"  style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; height: 35vh;">
        <div class="col-12" style="margin-left: auto; margin-right: auto;">
            <CompanyProfile unique-id="cprofile1" key="cprofile1" :options="optionsCompanyProfile" style="height: 100%"/>
        </div>
    </div>
    <div class="row" style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0;">
        <div class="col-12 text-center" style="margin-left: auto; margin-right: auto; margin-top: 2em">
            <h3>Position Sizing</h3>
            <div class="table-responsive">
                <table>
                    <tbody>
                        <tr>
                        <td class="table-header">Capital</td>
                        <td class="table-input"><input v-model.number="inputs.capital" type="number" placeholder="Enter your capital"></td>
                        </tr>
                        <tr>
                        <td class="table-header">Max Loss (0-1):</td>
                        <td class="table-input"><input v-model.number="inputs.maxLoss" type="number" placeholder="Enter max loss (e.g., 0.02 for 2%)"></td>
                        </tr>
                        <tr>
                        <td class="table-header">ATR Multiple:</td>
                        <td class="table-input"><input v-model.number="inputs.atrMultiple" type="number" placeholder="Enter ATR multiple"></td>
                        </tr>
                        <tr>
                        <td class="table-header">ATR:</td>
                        <td class="table-input"><input v-model="atr" type="number" disabled></td>
                        </tr>
                        <tr>
                        <td class="table-header">Price:</td>
                        <td class="table-input"><input v-model="price" type="number" disabled></td>
                        </tr>
                        <tr>
                        <td class="table-header">Capital at Loss</td>
                        <td class="table-input">${{ capitalAtLoss.toFixed(2) }}</td>
                        </tr>
                        <tr>
                        <td class="table-header">Number of Shares</td>
                        <td class="table-input">{{ numberOfShares.toFixed(2) }}</td>
                        </tr>
                        <tr>
                        <td class="table-header">Position Size</td>
                        <td class="table-input">${{ positionSize.toFixed(2) }}</td>
                        </tr>
                        <tr>
                        <td class="table-header">Stop Loss</td>
                        <td class="table-input">Long: ${{ stopLoss.long.toFixed(2) }}<br>Short: ${{ stopLoss.short.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { Chart, CompanyProfile, SymbolInfo } from '@/assets/js/tradingview-vue.js';
import { ref, computed } from 'vue';
import axios from 'axios';

export default {
    data() {
        return {
            params: this.$route.params,
            inputs: {
                capital: 10000,
                maxLoss: 0.02,
                atrMultiple: 2
            },
            atr: 0,
            price: 0,
        };
    },
    computed: {
        optionsCompanyProfile() {
            return {
                colorTheme: "dark",
                width: "100%",
                height: "100%",
                symbol: this.params.ticker
            };
        },
        optionsChart() {
            return {
                width: "100%",
                height: "100%",
                symbol: this.params.ticker,
                interval: "W",
                timezone: "Europe/Berlin",
                theme: "dark",
                style: "1",
                locale: "en",
                enable_publishing: false,
                save_image: false,
                calendar: false,
                studies: [
                    "STD;Supertrend"
                ],
            }
        },
        optionsSymbolInfo() {
            return {
                symbol: this.params.ticker,
                locale: "en",
                colorTheme: "dark",
                isTransparent: false,
                width: "100%"
            }
        },
        capitalAtLoss() {
            return this.inputs.capital * this.inputs.maxLoss;
        },
        numberOfShares() {
            return this.capitalAtLoss / (this.inputs.atrMultiple * this.atr);
        },
        positionSize() {
            return this.numberOfShares * this.price;
        },
        stopLoss() {
            return {
                "long": this.price - (this.inputs.atrMultiple * this.atr),
                "short": this.price + (this.inputs.atrMultiple * this.atr)
            }
        }
    },
    methods: {
        fetchData() {
            console.log(`https://api.philippstuerner.com/lookielookie/atr?ticker=${this.params.ticker}`)
            axios.get(`https://api.philippstuerner.com/lookielookie/atr?ticker=${this.params.ticker}`)
                .then(response => {
                    this.atr = response.data["indicators"]["atr"];
                    this.price = response.data.adjclose;
                })
                .catch(error => {
                    console.error('Failed to fetch data:', error);
                });
        }
    },
    mounted() {
        this.fetchData();
    },
    components: {
        CompanyProfile,
        Chart,
        SymbolInfo
    }
}
</script>


<style scoped>
    .table-responsive {
        width: 100%;
        overflow-x: auto;
        display: flex; /* Use flexbox to center the table */
        justify-content: center; /* Center the table horizontally */
    }

    .table-responsive table {
        margin-top: 20px; /* Or any value for vertical spacing */
        margin-bottom: 20px; /* Or any value for vertical spacing */
        /* Remove the width: 100%; if you want to shrink-wrap the table to its content */
    }

    @media (min-width: 769px) {
        /* Styles for desktop */
        .table-responsive table {
            display: block;
        }
        .table-header,
        .table-input {
            display: table-cell;
            text-align: left;
        }
        .table-header {
            font-weight: bold;
        }
    }

    @media (max-width: 768px) {
        /* Styles for mobile */
        .table-responsive table {
            display: block;
        }
        .table-header,
        .table-input {
            display: block;
            width: 100%;
        }
        .table-header {
            font-weight: bold;
            padding-top: 0.5rem;
        }
        .table-input input {
            width: 100%;
            margin-bottom: 0.5rem;
        }
    }
</style>
