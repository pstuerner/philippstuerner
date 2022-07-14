
const TOP100 = ["ser", "haber", "estar", "tener", "hacer", "poder", "decir", "ir", "ver", "dar", "saber", "querer", "llegar", "pasar", "deber", "poner", "parecer", "quedar", "creer", "hablar", "llevar", "dejar", "seguir", "encontrar", "llamar", "venir", "pensar", "salir", "volver", "tomar", "conocer", "vivir", "sentir", "tratar", "mirar", "contar", "empezar", "esperar", "buscar", "existir", "entrar", "trabajar", "escribir", "perder", "producir", "ocurrir", "entender", "pedir", "recibir", "recordar", "terminar", "permitir", "aparecer", "conseguir", "comenzar", "servir", "sacar", "necesitar", "mantener", "resultar", "leer", "caer", "cambiar", "presentar", "crear", "abrir", "considerar", "oír", "acabar", "convertir", "ganar", "formar", "traer", "partir", "morir", "aceptar", "realizar", "suponer", "comprender", "lograr", "explicar", "preguntar", "tocar", "reconocer", "estudiar", "alcanzar", "nacer", "dirigir", "correr", "utilizar", "pagar", "ayudar", "gustar", "jugar", "escuchar", "cumplir", "ofrecer", "descubrir", "levantar", "intentar"];

const TEMPS_IN_MODE = {
    "indicativo": ["presente", "preterito perfecto compuesto", "preterito imperfect", "preterito pluscuamperfecto", "preterito perfecto simple", "preterito anterior", "futuro", "futuro perfecto", "condicional", "condicional perfecto"],
    "subjuntivo": ["presente", "preterito perfecto", "preterito imperfecto 1", "preterito pluscuamperfecto 1", "preterito imperfecto 2", "preterito pluscuamperfecto 2", "futuro", "futuro perfecto"],
    "imperativo": ["imperativo", "imperativo negativo"],
    "infinitivo": ["simple", "compuesto"],
    "gerundio": ["simple", "compuesto"],
    "participio": ["pasado"]
};

const MODES_MAPPING = {
    "indicativo": "Indicativo (Indicative)",
    "subjuntivo": "Subjuntivo (Subjunctive)",
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
  
    "preterito perfecto": "Pretérito perfecto (Present perfect)",
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

const CORPUS = {
  "top100": TOP100.join(","),
  "all": "all"
}

export { TOP100, TEMPS_IN_MODE, TEMPS_MAPPING, MODES_MAPPING, CORPUS };