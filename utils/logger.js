const fs = require("fs");
const path = require("path");

// Définition du chemin du fichier de log ( je dit sors du fich loggers et entre dans le dossier logs et crée un fichier app.log)

const LOG = path.join(__dirname, '../logs/app.log'); 

// Fonction pour écrire les logs dans le fichier (horodatage);
function log(level, message) {
  // convertir une date et une heure en une chaîne de caractères (du texte)
    const date = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const ligne = `${date} [${level}] ${message}\n`;
    fs.appendFileSync(LOG, ligne, 'utf8');
} 

module.exports = {
    info: (msg) => log('INFO', msg),
    warning: (msg) => log('WARNING',msg),
    error: (msg) => log('ERROR', msg),
}; 