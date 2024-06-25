const date_object = createDateAsUTC(new Date())
const first_day_object = new Date(date_object.getFullYear(), date_object.getMonth() - 1, 2)
const last_day_object = new Date(2024, 0, 2)

const date = {
    jour: date_object.getDate(),
    mois: date_object.getMonth(),
    annee: date_object.getFullYear(),
    jourSemaine: date_object.getDay(),
    premierJourMois: first_day_object.getDay(),
    dernierJourMois: last_day_object.getDay()
}

function createDateAsUTC(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

function convertDateToUTC(date: Date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
}

console.log(first_day_object)
console.log(last_day_object)
console.log(date_object)
console.log('Premier jour : ' + date.premierJourMois + ' / ' + 'Dernier jour mois : ' + date.dernierJourMois)

const NOMS_JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const NOMS_MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

export { date, NOMS_MOIS, NOMS_JOURS }
