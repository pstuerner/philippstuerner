const db = require("../models");
const Verbs = db.verbs;

const MODES_MAPPING = {
  "indicativo": "Indicativo (Indicative)",
  "subjunctivo": "Subjuntivo (Subjunctive)",
  "imperativo": "Imperativo (Imperative)",
  "infinitivo": "Infinitivo (Infinitive)",
  "gerundio": "Gerundio (Gerund)",
  "participio": "Participio (Participle)"
};
const TEMPS_MAPPING = {
  "presente": "Presente (Present)",
  "preterito perfecto compuesto": "Pretérito perfecto compuesto (Present perfect)",
  "preterito imperfect": "Pretérito imperfecto (Imperfect)",
  "preterito pluscuamperfecto": "Pretérito pluscuamperfecto (Past perfect)",
  "preterito perfecto simple": "Pretérito perfecto simple (Preterite)",
  "preterito anterior": "Pretérito anterior (Preterite perfect)",
  "futuro": "Futuro (Future)",
  "futuro perfecto": "Futuro perfecto (Future perfect)",
  "condicional": "Condicional (Conditional)",
  "condicional perfecto": "Condicional perfecto (Conditional perfect)",

  "present perfect": "Pretérito perfecto (Present perfect)",
  "preterito imperfecto 1": "Pretérito imperfecto 1 (Imperfect 1)",
  "preterito pluscuamperfecto 1": "Pretérito pluscuamperfecto 1 (Past perfect 1)",
  "preterito imperfecto 2": "Pretérito imperfecto 2 (Imperfect 2)",
  "preterito pluscuamperfecto 2": "Pretérito pluscuamperfecto 2 (Past perfect 2)",
  
  "imperativo": "Imperativo (Imperative)",
  "imperativo negativo": "Imperativo negativo (Imperative negative)",
  
  "simple": "Simple (Présent)",
  "compuesto": "Compuesto (Perfect)",
  
  "pasado": "Pasado (Perfect)"
};

// Retrieve a random selection of verbs.
exports.findAll = (req, res) => {
  const items = +req.query.items ? +req.query.items : 100;
  const mode = req.query.mode;
  let temps = req.query.temps;
  let query;
  let projection = {};
  
  query = Verbs.aggregate([{"$sample":{"size": items}}]);

  if (mode) {
    if (mode in MODES_MAPPING) {
      projection[MODES_MAPPING[mode]] = 1;
      if (temps) {
        temps = temps.split(',');
        temps.forEach(
            function (temp) {
              if (temp in TEMPS_MAPPING) {
                projection[`${MODES_MAPPING[mode]}.${TEMPS_MAPPING[temp]}`] = 1
              }
            }
          );
        delete projection[MODES_MAPPING[mode]];
      }
      query = query.project(projection);
    }
  }

  query
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
