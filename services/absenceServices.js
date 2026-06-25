const db = require('../db/database.js');
const { logInfo } = require('../utils/logger.js');
const { DateValide } = require('../utils/validation.js');
// La fonction "enregistrerAbsence" est utilisée pour enregistrer une absence d'un étudiant pour une date donnée. Elle prend deux paramètres : "studentId" qui représente l'id de l'étudiant, et "date" qui représente la date de l'absence. La fonction utilise une requête SQL préparée pour insérer l'absence dans la table "absences" avec le statut par défaut "non_justifiee". Après l'enregistrement, une information est enregistrée dans les logs pour indiquer que l'absence a été enregistrée.
function enregistrerAbsence(studentId, date) {
    if (!DateValide(date)) {
        logWarning(`Date invalide rejetee : ${date}`);
        return false;
    }
    db.prepare(
        "INSERT INTO absences (student_id, date, status) VALUES (?, ?, 'non_justifiee')"
    ).run(studentId, date);
    logInfo(`Absence enregistree : etudiant ${studentId} le ${date}`);
    return true;
}
// La fonction "marquerStatut" est utilisée pour marquer une absence avec un statut spécifique (justifiee ou non_justifiee). Elle prend deux paramètres : "absenceId" qui représente l'id de l'absence à marquer, et "status" qui représente le statut à attribuer à cette absence. La fonction utilise une requête SQL préparée pour mettre à jour le statut de l'absence correspondante à cet id dans la table "absences". Après la modification, une information est enregistrée dans les logs pour indiquer que l'absence a été marquée avec le nouveau statut.
function marquerStatut(absenceId, status) {
    db.prepare('UPDATE absences SET status = ? WHERE id = ?').run(status, absenceId);
    logInfo(`Absence ${absenceId} marquee ${status}`);
}
// La fonction "historiqueEtudiant" est utilisée pour récupérer l'historique des absences d'un étudiant en utilisant son id. Elle prend un paramètre "studentId" qui représente l'id de l'étudiant dont on veut récupérer l'historique. La fonction utilise une requête SQL préparée pour sélectionner toutes les absences de cet étudiant dans la table "absences". Les absences sont retournées sous forme de tableau d'objets, où chaque objet contient les informations de l'absence (id, student_id, date, status).
function historiqueEtudiant(studentId) {
    return db.prepare('SELECT * FROM absences WHERE student_id = ?').all(studentId);
}
// La fonction "historiqueClasse" est utilisée pour récupérer l'historique des absences de tous les étudiants d'une classe donnée. Elle prend un paramètre "classe" qui représente la classe dont on veut récupérer l'historique. La fonction utilise une requête SQL préparée pour sélectionner toutes les absences des étudiants de cette classe en joignant la table "absences" avec la table "students" pour obtenir le nom et le prénom de chaque étudiant correspondant à chaque absence. Les absences sont retournées sous forme de tableau d'objets, où chaque objet contient les informations de l'absence (id, student_id, date, status) ainsi que le nom et le prénom de l'étudiant.
function historiqueClasse(classe) {
    return db.prepare(`
SELECT absences.*, students.nom, students.prenom
FROM absences
JOIN students ON absences.student_id = students.id
WHERE students.classe = ?
`).all(classe);
}
module.exports = {
    enregistrerAbsence,
    marquerStatut,
    historiqueEtudiant,
    historiqueClasse
};