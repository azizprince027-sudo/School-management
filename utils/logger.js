const fs = require("fs");
    const path = require("path");
    const LOG = path.join(__dirname, "../logs/app.log");
    
  
    function formatDate() {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}
        ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function writeLog(level, message) {
        const line = `${formatDate()} [${level}] ${message}\n`;
        fs.appendFileSync(LOG, line, "utf8");   
    }

    function logInfo(message) {
        writeLog("INFO", message);
    }

    function logWarning(message) {
        writeLog("WARNING", message);
    }


    function logError(message) {
        writeLog("ERROR", message);
    }

    module.exports = { logInfo, logWarning, logError };

//========================================================
// const fs = require("fs");
// const path = require("path");

// // Définition du chemin du fichier de log ( je dit sors du fich loggers et entre dans le dossier logs et crée un fichier app.log)

// const LOG = path.join(__dirname, '../logs/app.log');

// // Fonction pour écrire les logs dans le fichier (horodatage);
// function log(level, message) {
//   // convertir une date et une heure en une chaîne de caractères (du texte)
//     const date = new Date().toISOString().replace('T', ' ').slice(0, 19);
//     const ligne = `${date} [${level}] ${message}\n`;
//     fs.appendFileSync(LOG, ligne, 'utf8');
// }

// module.exports = {
//     info: (msg) => log('INFO', msg),
//     warning: (msg) => log('WARNING',msg),
//     error: (msg) => log('ERROR', msg),
// };

// function formatDate() {
//     // La fonction "formatDate" crée une nouvelle instance de l'objet Date pour obtenir la date et l'heure actuelles. Elle utilise une fonction "pad" pour ajouter un zéro devant les nombres inférieurs à 10, assurant ainsi que les mois, jours, heures, minutes et secondes sont toujours affichés avec deux chiffres. Enfin, elle retourne une chaîne de caractères formatée au format "YYYY-MM-DD HH:MM:SS", qui peut être utilisée pour enregistrer des timestamps dans les logs.
//     const d = new Date();
//     // La fonction "pad" prend un nombre "n" en entrée et retourne une chaîne de caractères représentant ce nombre, en ajoutant un zéro devant si le nombre est inférieur à 10. Cela garantit que les valeurs de mois, jour, heure, minute et seconde sont toujours affichées avec deux chiffres, ce qui est important pour maintenir un format de date cohérent dans les logs.
//     const pad = (n) => String(n).padStart(2, "0");
//     // La fonction "formatDate" utilise la fonction "pad" pour formater les composants de la date (mois, jour, heure, minute, seconde) et retourne une chaîne de caractères au format "YYYY-MM-DD HH:MM:SS". Par exemple, si la date actuelle est le 5 juin 2024 à 9h30 et 45 secondes, la fonction retournera "2024-06-05 09:30:45". Ce format est couramment utilisé pour les timestamps dans les logs, facilitant ainsi la lecture et l'analyse des événements enregistrés.
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
//             d.getMinutes(),
//         )}:${pad(d.getSeconds())}`;
// }

// function writeLog(level, message) {
//     const line = `${formatDate()} [${level}] ${message}\n`;
//     fs.appendFileSync(logFile, line, "utf8");
// }
// // La fonction "writeLog" prend deux paramètres : "level" qui représente le niveau de log (par exemple, "INFO", "WARNING", "ERROR") et "message" qui est le message à enregistrer. Elle utilise la fonction "formatDate" pour obtenir un timestamp formaté, puis construit une ligne de log en combinant le timestamp, le niveau de log et le message. Enfin, elle utilise la méthode "appendFileSync" de l'objet "fs" pour écrire cette ligne dans le fichier de log spécifié par "logFile", en utilisant l'encodage UTF-8. Cela permet d'enregistrer les événements importants de l'application dans un fichier de manière structurée.
// function logInfo(message) {
//     writeLog("INFO", message);
// }
// // La fonction "logInfo" est une fonction qui enregistre un message de niveau "INFO" dans le fichier de log. Elle utilise la fonction "writeLog" pour formater le message avec un horodatage et le niveau de log, puis l'écrit dans le fichier de log spécifié. Cela permet de suivre les événements normaux ou les informations importantes dans l'application, facilitant ainsi le débogage et la maintenance.
// function logWarning(message) {
//     writeLog("WARNING", message);
// }
// // La fonction "logWarning" est une fonction qui enregistre un message de niveau "WARNING" dans le fichier de log. Elle utilise la fonction "writeLog" pour formater le message avec un horodatage et le niveau de log, puis l'écrit dans le fichier de log spécifié. Cela permet de suivre les événements importants ou les avertissements dans l'application, facilitant ainsi le débogage et la maintenance.
// function logError(message) {
//     writeLog("ERROR", message);
// }
// module.exports = {
//     logInfo,
//     logWarning,
//     logError
// };



