
function listingsChange(startListings, endListings) {
    let change = [];
    endListings.forEach(el => {
        let sl = startListings.filter(o => o['id']==el['id'])[0],
            changeEl = {listing: el};
        if (sl) {
            let slq = sl['quote']['USD'],
                elq = el['quote']['USD'];
            changeEl['change'] = {
                circulating_supply: el['circulating_supply'] / sl['circulating_supply'],
                cmc_rank: sl['cmc_rank'] - el['cmc_rank'],
                num_market_pairs: el['num_market_pairs'] - sl['num_market_pairs'],
                quote: {
                    USD: {
                        fully_diluted_market_cap: elq['fully_diluted_market_cap'] / slq['fully_diluted_market_cap'],
                        market_cap: elq['market_cap'] / slq['market_cap'],
                        market_cap_color: elq['market_cap'] <= slq['market_cap'] ? 'firebrick' : 'forestgreen',
                        market_cap_dominance: elq['market_cap_dominance'] - slq['market_cap_dominance'],
                        price: elq['price'] / slq['price'],
                        volume_24h: elq['volume_24h'] / slq['volume_24h'],
                        volume_24h_color: elq['volume_24h'] <= slq['volume_24h'] ? 'firebrick' : 'forestgreen',
                    }
                }
            }
        } else {
            changeEl['change'] = {
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
                    }
                }
            }
        }

        change.push(changeEl)
    })

    return change
}

function main(dataRaw) {
    function fadeIn(tr, duration) {
		tr
		.style('opacity', 0)
		.transition('fadeIn')
		.duration(duration)
		.style('opacity', 1)
	}

    function fadeOut(tr, duration) {
		tr
		.style('opacity', 1)
		.transition('fadeOut')
		.duration(duration)
		.style('opacity', 0)
        .remove()
	}

    function truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
      };

    function updateTable() {
        // <td><img src="${cmcImgUrl(d['listing']['id'])}" width="24" height="24"></td>
        table
        .selectAll('tr')
        .data(data, d=>d.listing.cmc_rank)
        .join(
            enter => enter
                    .append('tr')
                    .call(fadeIn, 500)
                    .html(d=>`
                        <td>${intFormatter.format(d["listing"]["cmc_rank"])}</td>
                        <td>${intFormatter.format(d["change"]["cmc_rank"])}</td>
                        <td><a href="${cmcCurrencyUrl(d['listing']['slug'])}" target="_blank">${truncate(d["listing"]["name"], 25)}</a></td>
                        <td>${currencyFormatter.format(d["listing"]["quote"]["USD"]["market_cap"])}</td>
                        <td>${currencyFormatter.format(d["listing"]["quote"]["USD"]["fully_diluted_market_cap"])}</td>
                        <td style="color: ${d["change"]["quote"]["USD"]["market_cap_color"]}">${percentFormatter.format(d["change"]["quote"]["USD"]["market_cap"]-1)}</td>
                        <td>${currencyFormatter.format(d["listing"]["quote"]["USD"]["volume_24h"])}</td>
                        <td style="color: ${d["change"]["quote"]["USD"]["volume_24h_color"]}">${percentFormatter.format(d["change"]["quote"]["USD"]["volume_24h"]-1)}</td>
                    `),
            update => update
                    .html(d=>`
                        <td>${intFormatter.format(d["listing"]["cmc_rank"])}</td>
                        <td>${intFormatter.format(d["change"]["cmc_rank"])}</td>
                        <td><a href="${cmcCurrencyUrl(d['listing']['slug'])}" target="_blank">${truncate(d["listing"]["name"], 25)}</a></td>
                        <td>${currencyFormatter.format(d["listing"]["quote"]["USD"]["market_cap"])}</td>
                        <td>${currencyFormatter.format(d["listing"]["quote"]["USD"]["fully_diluted_market_cap"])}</td>
                        <td style="color: ${d["change"]["quote"]["USD"]["market_cap_color"]}">${percentFormatter.format(d["change"]["quote"]["USD"]["market_cap"]-1)}</td>
                        <td>${currencyFormatter.format(d["listing"]["quote"]["USD"]["volume_24h"])}</td>
                        <td style="color: ${d["change"]["quote"]["USD"]["volume_24h_color"]}">${percentFormatter.format(d["change"]["quote"]["USD"]["volume_24h"]-1)}</td>
                    `),
            exit => exit.call(fadeOut, 500)
        )
    }

    let startListings = dataRaw[1].listings,
        endListings = dataRaw[0].listings,
        changeListings = listingsChange(startListings, endListings),
        topN = +d3.select('#top-selection').attr('value'),
        data = changeListings.slice(0, topN),
        stringFormat = {year:'numeric', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'},
        currencyFormatter = new Intl.NumberFormat('en-EN', { notation: 'compact', style: 'currency', currency: 'USD' }),
        percentFormatter = new Intl.NumberFormat('en-EN', {minimumFractionDigits: 2, style: 'percent'}),
        intFormatter = new Intl.NumberFormat('en-EN', {maximumFractionDigits: 0, style: 'decimal'}),
        cmcCurrencyUrl = slug => `https://coinmarketcap.com/currencies/${slug}/`,
        cmcImgUrl = coinId => `https://s2.coinmarketcap.com/static/img/coins/64x64/${coinId}.png`;

    let timestamps, startDate, endDate;

    // Set date options
    d3.json('https://mongodb.philippstuerner.com/listings?allTimestamps=true').then(function(dataRaw) {
        timestamps = dataRaw;
        let dateSelection = d3.selectAll('.form-select');

        dateSelection
        .selectAll('option')
        .data(timestamps)
        .join(
            enter=> enter
                    .append('option')
                    .attr('value', d => (new Date(d.timestamp)).getTime())
                    .text(d=>(new Date(d.timestamp)).toLocaleString([], stringFormat))
        );

        d3.select('#start-date-selection').select('option:nth-child(2)').attr('selected',true);
        d3.select('#end-date-selection').select('option:nth-child(1)').attr('selected',true);

        startDate = (new Date(timestamps[1].timestamp)).getTime();
        endDate = (new Date(timestamps[0].timestamp)).getTime();
    })


    let table = d3.select('#cmc-table');
    updateTable()

    // Event handlers
    d3.select('#start-date-selection').on('change', function(d) {
        if (+d.target.value>=endDate) {
            d.target.value = startDate;
            window.alert("Oops, that didn't work 💀\nMake sure that your start date is before the end date.")
        } else {
            startDate = +d.target.value;
            d3.selectAll('.overlay').transition().duration(1000).style('opacity',1);
            d3.json(`https://mongodb.philippstuerner.com/listings?unixTimestamp=${startDate}`).then(function(dataRaw) {
                startListings = dataRaw.listings;
                changeListings = listingsChange(startListings, endListings);
                data = changeListings.slice(0, topN);
                updateTable();
                d3.selectAll('.overlay').transition().duration(500).style('opacity',0);
            });
        }
    })

    d3.select('#end-date-selection').on('change', function(d) {
        if (+d.target.value<=startDate) {
            d.target.value = endDate
            window.alert("Oops, that didn't work 💀\nMake sure that your start date is before the end date.")
        } else {
            endDate = +d.target.value;
            d3.selectAll('.overlay').transition().duration(1000).style('opacity',1);
            d3.json(`https://mongodb.philippstuerner.com/listings?unixTimestamp=${endDate}`).then(function(dataRaw) {
                endListings = dataRaw.listings;
                changeListings = listingsChange(startListings, endListings);
                data = changeListings.slice(0, topN);
                updateTable();
                d3.selectAll('.overlay').transition().duration(500).style('opacity',0);
            });
        }
    })

    d3.select('#top-selection').on('change', function(d) {
        topN = +d.target.value;

        data = changeListings.slice(0, topN);
        updateTable();

    });

    d3.selectAll('th').on('click', function(d) {
        const getProp = (obj, prop) => {
            return prop.split('.').reduce((r, e) => {
                return r[e];
            }, obj);
         };

        let sortKeys = {
            th_number: 'listing.cmc_rank',
            th_number_change: 'change.cmc_rank',
            th_name: 'listing.name',
            th_market_cap: 'listing.quote.USD.market_cap',
            th_market_cap_diluted: 'listing.quote.USD.fully_diluted_market_cap',
            th_market_cap_change: 'change.quote.USD.market_cap',
            th_volume: 'listing.quote.USD.volume_24h',
            th_volume_change: 'change.quote.USD.volume_24h',
        }

        if (!Object.keys(sortKeys).includes(d3.select(this).attr('id'))) {return;};

        let key = sortKeys[d3.select(this).attr('id')],
            desc = d3.select(this).attr('class')=='sort-desc' ? true : false;

        if (desc) {
            data.sort(function(a, b) {return d3.ascending(getProp(a,key), getProp(b,key));});
            d3.select(this).attr('class', 'sort-asc');
        } else {
            data.sort(function(a, b) {return d3.descending(getProp(a,key), getProp(b,key));});
            d3.select(this).attr('class', 'sort-desc');
        }

        updateTable();
    })

}

d3.selectAll('.overlay').transition().duration(1000).style('opacity',1);

d3.json('https://mongodb.philippstuerner.com/listings?last=2').then(function(dataRaw) {
    main(dataRaw);
    d3.selectAll('.overlay').transition().duration(500).style('opacity',0);
  });
