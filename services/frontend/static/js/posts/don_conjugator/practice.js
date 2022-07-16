import { TEMPS_IN_MODE, TEMPS_MAPPING, MODES_MAPPING } from "./util.js";

// Get card element
const card = document.querySelectorAll('.card');

// Loop through cards. 
// This is so you can have multiple cards on a page.
for (let i = 0; i < card.length; i++) {
   // Add a click event listener to each card.
   card[i].addEventListener("click", function() {
     // Toggle active class on card
     card[i].classList.toggle("active");
   });
}

let mode = d3.select('#mode').text();
d3.select('#mode').text(MODES_MAPPING[mode]);

d3.selectAll('.card').nodes().forEach(function (d) {
    let card = d3.select(d);
    let temp = card.select('#card-temp').text();
    let sp = card.select('#card-sp').text();
    
    d3.json(`https://mongodb.philippstuerner.com/api/conjugator/verbs?mode=${mode}&temps=${temp}&select=${sp}`).then(function (dataRaw) {
        let conjugation = dataRaw[0][MODES_MAPPING[mode]][TEMPS_MAPPING[temp]];
        let en = dataRaw[0]["en"];
        
        card.select('#card-en').text(en);
        card.select('#card-temp').text(TEMPS_MAPPING[temp]);
        card.select('#card-conjugation').selectAll("p").data(conjugation).join(enter => enter.append("p").attr("class", "card-text").text(d=>d));
        // debugger;
        // console.log(dataRaw)
    })
});