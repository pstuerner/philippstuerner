const options = [
    '52WeekChange',
    'SandP52WeekChange',
    'address1',
    'address2',
    'algorithm',
    'annualHoldingsTurnover',
    'annualReportExpenseRatio',
    'ask',
    'askSize',
    'averageDailyVolume10Day',
    'averageVolume',
    'averageVolume10days',
    'beta',
    'beta3Year',
    'bid',
    'bidSize',
    'bookValue',
    'category',
    'circulatingSupply',
    'city',
    'companyOfficers',
    'country',
    'currency',
    'currentPrice',
    'currentRatio',
    'dateShortInterest',
    'dayHigh',
    'dayLow',
    'debtToEquity',
    'dividendRate',
    'dividendYield',
    'earningsGrowth',
    'earningsQuarterlyGrowth',
    'ebitda',
    'ebitdaMargins',
    'enterpriseToEbitda',
    'enterpriseToRevenue',
    'enterpriseValue',
    'exDividendDate',
    'exchange',
    'exchangeTimezoneName',
    'exchangeTimezoneShortName',
    'expireDate',
    'fiftyDayAverage',
    'fiftyTwoWeekHigh',
    'fiftyTwoWeekLow',
    'financialCurrency',
    'fiveYearAverageReturn',
    'fiveYearAvgDividendYield',
    'floatShares',
    'forwardEps',
    'forwardPE',
    'freeCashflow',
    'fromCurrency',
    'fullTimeEmployees',
    'fundFamily',
    'fundInceptionDate',
    'gmtOffSetMilliseconds',
    'grossMargins',
    'grossProfits',
    'headSymbol',
    'heldPercentInsiders',
    'heldPercentInstitutions',
    'industry',
    'isEsgPopulated',
    'lastCapGain',
    'lastDividendValue',
    'lastFiscalYearEnd',
    'lastMarket',
    'lastSplitDate',
    'lastSplitFactor',
    'legalType',
    'logo_url',
    'longBusinessSummary',
    'longName',
    'market',
    'marketCap',
    'maxAge',
    'maxSupply',
    'messageBoardId',
    'morningStarOverallRating',
    'morningStarRiskRating',
    'mostRecentQuarter',
    'navPrice',
    'netIncomeToCommon',
    'nextFiscalYearEnd',
    'numberOfAnalystOpinions',
    'open',
    'openInterest',
    'operatingCashflow',
    'operatingMargins',
    'payoutRatio',
    'pegRatio',
    'phone',
    'preMarketPrice',
    'previousClose',
    'priceHint',
    'priceToBook',
    'priceToSalesTrailing12Months',
    'profitMargins',
    'quickRatio',
    'quoteType',
    'recommendationKey',
    'recommendationMean',
    'regularMarketDayHigh',
    'regularMarketDayLow',
    'regularMarketOpen',
    'regularMarketPreviousClose',
    'regularMarketPrice',
    'regularMarketVolume',
    'returnOnAssets',
    'returnOnEquity',
    'revenueGrowth',
    'revenuePerShare',
    'revenueQuarterlyGrowth',
    'russelName',
    'russelPct',
    'sector',
    'sharesOutstanding',
    'sharesPercentSharesOut',
    'sharesShort',
    'sharesShortPreviousMonthDate',
    'sharesShortPriorMonth',
    'shortName',
    'shortPercentOfFloat',
    'shortRatio',
    'startDate',
    'state',
    'strikePrice',
    'symbol',
    'targetHighPrice',
    'targetLowPrice',
    'targetMeanPrice',
    'targetMedianPrice',
    'threeYearAverageReturn',
    'totalAssets',
    'totalCash',
    'totalCashPerShare',
    'totalDebt',
    'totalRevenue',
    'tradeable',
    'trailingAnnualDividendRate',
    'trailingAnnualDividendYield',
    'trailingEps',
    'trailingPegRatio',
    'twoHundredDayAverage',
    'underlyingExchangeSymbol',
    'underlyingSymbol',
    'uuid',
    'volume',
    'volume24Hr',
    'volumeAllCurrencies',
    'website',
    'yield',
    'ytdReturn',
    'zip'
];

window.filters = {};
window.indicators = {};

d3.select('#options-parent').selectAll("option").data(options).enter().append("option").text(d=>d);

$("#options-parent").select2().on("select2:select", function (event) {
    var itemName = d3.select(event.params.data.element).property("text");
    var selectedOptions = d3.select('#options-table');
    
    if (selectedOptions.select(`#${itemName}`).empty()) {
        d3.json(`https://api.philippstuerner.com/sinverguenza/option/${itemName}`).then(
            function (data) {
                if (data.type == "str") {
                    selectedOptions
                    .append('tr')
                    .attr('id', itemName)
                    .html(`
                    <td class="col-1" style="height: 4em;">
                        <div style="display: flex; justify-content: space-between; height: 100%;">
                            <button type="button" class="btn btn-primary btn-block">S</button>
                            <button type="button" class="btn btn-primary btn-block m-0 remove-options-child">D</button>
                        </div>
                    </td>
                    <td class="col-3" style="display: table-cell; vertical-align: middle;">${itemName}</td>
                    <td class="col-8" colspan="3" style="display: table-cell; vertical-align: middle;"><select class="options-child" multiple="multiple""></select></td>
                    `
                    )
                    d3.select(`#${itemName} select`).selectAll('option').data(data.values).enter().append("option").text(d=>d);

                    $(`#${itemName} select`).select2({width: '100%'}).on("select2:select select2:unselect", function (event) {
                        if (event.type == "select2:select") {
                            if (itemName in filters) {
                                filters[itemName].push(d3.select(event.params.data.element).property("text"))
                            } else {
                                filters[itemName] = [d3.select(event.params.data.element).property("text")]
                            }
                        } else if (event.type == "select2:unselect") {
                            if (filters[itemName].length == 1) {
                                delete filters[itemName]
                            } else {
                                filters[itemName] = filters[itemName].filter(ele => ele !== d3.select(event.params.data.element).property("text"));
                            }
                        }
                    });

                    d3.select(`#${itemName} .remove-options-child`).on('click', function() {
                        d3.select(this.parentNode.parentNode.parentNode).remove();
                        delete filters[itemName]
                    });
                } else if (["float", "int"].includes(data.type)) {
                    if (typeof data.values !== "undefined") {
                        selectedOptions
                        .append('tr')
                        .attr('id', itemName)
                        .html(`
                        <td class="col-1" style="height: 4em;">
                            <div style="display: flex; justify-content: space-between; height: 100%;">
                                <button type="button" class="btn btn-primary btn-block">S</button>
                                <button type="button" class="btn btn-primary btn-block m-0 remove-options-child">D</button>
                            </div>
                        </td>
                        <td class="col-3" style="display: table-cell; vertical-align: middle;">${itemName}</td>
                        <td class="col-1" style="display: table-cell; vertical-align: middle;"><select class="options-filter"><option>></option><option>>=</option><option><</option><option><=</option></select></td>
                        <td class="col-3" style="display: table-cell; vertical-align: middle;"><input class="options-filter"/></td>
                        <td class="col-4 slider" style="display: table-cell; vertical-align: middle;"></td>
                        `
                        )
                        
                        let extent = d3.extent(data.values);
                        let marginSliders = { top: 0, right: 20, bottom: 0, left: 20 },
                            widthSliders =
                                d3.select(`#${itemName} .slider`).node().getBoundingClientRect()
                                    .width -
                                marginSliders.left -
                                marginSliders.right,
                            heightSliders =
                                d3.select(`#${itemName} .slider`).node().getBoundingClientRect()
                                    .height -
                                marginSliders.top -
                                marginSliders.bottom;

                        var svgSlider = d3.select(`#${itemName} .slider`)
                            .append("svg")
                            .attr(
                                "width",
                                widthSliders + marginSliders.left + marginSliders.right
                            )
                            .attr(
                                "height",
                                heightSliders + marginSliders.top + marginSliders.bottom
                            )
                            .append("g")
                            .attr(
                                "transform",
                                `translate(${marginSliders.left},${heightSliders / 2})`
                            );

                        var slider = d3
                            .sliderBottom()
                            .width(widthSliders)
                            .tickFormat(d3.format(".2"))
                            .ticks(5)
                            .handle(d3.symbol().type(d3.symbolCircle).size(200)())
                            .on("onchange", (val) => {
                                d3.select(`#${itemName} input`).property("value", d3.format(",.2f")(val))
                                filters[itemName] = [d3.select(`#${itemName} select`).property("value"),val]
                            });

                        svgSlider
                        .transition()
                        .duration(500)
                        .call(
                            slider
                                .min(extent[0])
                                .max(extent[1])
                                .value(extent[0])
                        )

                        d3.select(`#${itemName} .remove-options-child`).on('click', function() {
                            d3.select(this.parentNode.parentNode.parentNode).remove();
                            delete filters[itemName]
                        });

                        d3.selectAll(`#${itemName} .options-filter`).on('change', function() {
                            filters[itemName] = [d3.select(`#${itemName} select`).property("value"),d3.select(`#${itemName} input`).property("value")]
                        })
                    }
                } else {
                    selectedOptions
                    .append('tr')
                    .attr('id', itemName)
                    .html(`
                    <td>${itemName}</td>
                    <td>A</td>
                    <td><button class="remove-options-child"></button></td>
                    `
                    )
                }    
            }
        );
    }
});

const indicatorsTr = {
    SMAIndicator: `
        <tr>
            <td class="col-2">window</d>
            <td class="col-10"><input data-kwarg="window" class="indicator-spinner" type="number" value="50" data-decimals="0" min="1" max="300" step="1"/></td>
        </tr>
    `,
    EMAIndicator: `
        <tr>
            <td class="col-2">window</d>
            <td class="col-10"><input data-kwarg="window" class="indicator-spinner" type="number" value="50" data-decimals="0" min="1" max="300" step="1"/></td>
        </tr>
    `,
    WMAIndicator: `
        <tr>
            <td class="col-2">window</d>
            <td class="col-10"><input data-kwarg="window" class="indicator-spinner" type="number" value="10" data-decimals="0" min="1" max="300" step="1"/></td>
        </tr>
    `,
    BollingerBands: `
        <tr>
            <td class="col-2">window</d>
            <td class="col-10"><input data-kwarg="window" class="indicator-spinner" type="number" value="20" data-decimals="0" min="1" max="300" step="1"/></td>
        </tr>
        <tr>
            <td class="col-2">window_dev</d>
            <td class="col-10"><input data-kwarg="window_dev" class="indicator-spinner" type="number" value="2" data-decimals="0" min="1" max="5" step="1"/></td>
        </tr>
    `
}
var indicatorCount = 0;
$("#indicators-select").select2().on("select2:select", function (event) {
    var indicator = d3.select(event.params.data.element).property("value");
    var selectedIndicators = d3.select('#indicators-table');
    indicatorCount++;
    window.indicators[`${indicator}_${indicatorCount}`] = {};
    
    selectedIndicators
    .append('tr')
    .attr('id', `${indicator}_${indicatorCount}`)
    .html(`
    <td class="col-1" style="height: 4em;">
        <div style="display: flex; justify-content: space-between; height: 100%;">
            <button type="button" class="btn btn-primary btn-block m-0 remove-indicators-child">D</button>
        </div>
    </td>
    <td class="col-3" style="display: table-cell; vertical-align: middle;">${indicator}</td>
    <td class="col-8" colspan="3" style="display: table-cell; vertical-align: middle;">
    <table class="table table-auto" >${indicatorsTr[indicator]}</table>
    </td>
    `
    )

    d3.selectAll(`#${indicator}_${indicatorCount} input`).each(function() {
        var kwarg = d3.select(this).attr("data-kwarg");
        var val = +d3.select(this).property("value");
        window.indicators[`${indicator}_${indicatorCount}`][kwarg] = val
    })

    d3.selectAll(`#${indicator}_${indicatorCount} input`).on('change', function() {
        var kwarg = d3.select(this).attr("data-kwarg");
        var val = +d3.select(this).property("value");
        var id = d3.select(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode).attr("id");

        window.indicators[id][kwarg] = val
        console.log(window.indicators)
    });

    d3.select(`#${indicator}_${indicatorCount} .remove-indicators-child`).on('click', function() {
        var id = d3.select(this.parentNode.parentNode.parentNode).attr("id");

        d3.select(this.parentNode.parentNode.parentNode).remove();
        delete window.indicators[id]
    });

    $('#indicators-select').val(null).trigger('change');
})