const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NoteValide } = require('../utils/validation.js');
// La fonction "ajouterNote" est utilisée pour ajouter une note à un étudiant pour une matière donnée. Elle prend trois paramètres : "studentId" qui représente l'id de l'étudiant, "subjectId" qui représente l'id de la matière, et "note" qui représente la note à ajouter. La fonction vérifie d'abord si la note est valide en utilisant la fonction "isNoteValide". Si la note n'est pas valide, une alerte est enregistrée dans les logs et la fonction retourne false. Si la note est valide, une requête SQL préparée est utilisée pour insérer la note dans la table "grades". Après l'ajout, une information est enregistrée dans les logs pour indiquer que la note a été ajoutée.
function ajouterNote(studentId, subjectId, note) {
    if (!NoteValide(note)) {
        logWarning(`Note invalide rejetee : ${note}`);
        return false;
    }
    db.prepare(
        'INSERT INTO grades (student_id, subject_id, note) VALUES (?, ?, ?)'
    ).run(studentId, subjectId, note);
    logInfo(`Note ajoutee : etudiant ${studentId}, matiere ${subjectId}, note ${note}`);
    return true;
}
// La fonction "modifierNote" est utilisée pour modifier une note existante dans la base de données. Elle prend deux paramètres : "gradeId" qui représente l'id de la note à modifier, et "nouvelleNote" qui représente la nouvelle note à attribuer. La fonction vérifie d'abord si la nouvelle note est valide en utilisant la fonction "isNoteValide". Si la nouvelle note n'est pas valide, une alerte est enregistrée dans les logs et la fonction retourne false. Si la nouvelle note est valide, une requête SQL préparée est utilisée pour mettre à jour la note correspondante à cet id dans la table "grades". Après la modification, une information est enregistrée dans les logs pour indiquer que la note a été modifiée.
function modifierNote(gradeId, nouvelleNote) {
    if (!NoteValide(nouvelleNote)) {
        logWarning(`Note invalide rejetee : ${nouvelleNote}`);
        return false;
    }
    db.prepare('UPDATE grades SET note = ? WHERE id = ?').run(nouvelleNote, gradeId);
    logInfo(`Note modifiee : id ${gradeId}`);
    return true;
}
// La fonction "supprimerNote" est utilisée pour supprimer une note de la base de données en utilisant son id. Elle prend un paramètre "gradeId" qui représente l'id de la note à supprimer. La fonction utilise une requête SQL préparée pour supprimer la note correspondante à cet id dans la table "grades". Après la suppression, une information est enregistrée dans les logs pour indiquer que la note a été supprimée.
function supprimerNote(gradeId) {
    db.prepare('DELETE FROM grades WHERE id = ?').run(gradeId);
    logInfo(`Note supprimee : id ${gradeId}`);
}
// La fonction "moyenneEtudiant" est utilisée pour calculer la moyenne des notes d'un étudiant en utilisant son id. Elle prend un paramètre "studentId" qui représente l'id de l'étudiant dont on veut calculer la moyenne. La fonction utilise une requête SQL préparée pour sélectionner la moyenne des notes de cet étudiant dans la table "grades". Si l'étudiant a des notes, la moyenne est retournée arrondie à deux décimales. Si l'étudiant n'a pas de notes, la fonction retourne null.
function moyenneEtudiant(studentId) {
    const row = db.prepare(
        'SELECT AVG(note) AS moyenne FROM grades WHERE student_id = ?'
    ).get(studentId);
    return row.moyenne !== null ? Number(row.moyenne.toFixed(2)) : null;
}
// La fonction "notesEtudiant" est utilisée pour récupérer toutes les notes d'un étudiant en utilisant son id. Elle prend un paramètre "studentId" qui représente l'id de l'étudiant dont on veut récupérer les notes. La fonction utilise une requête SQL préparée pour sélectionner les notes de cet étudiant en joignant la table "grades" avec la table "subjects" pour obtenir le nom de la matière correspondante à chaque note. Les notes sont retournées sous forme de tableau d'objets, où chaque objet contient l'id de la note, le nom de la matière, et la note elle-même.
function notesEtudiant(studentId) {
    return db.prepare(`
SELECT grades.id, subjects.nom AS matiere, grades.note
FROM grades
JOIN subjects ON grades.subject_id = subjects.id
WHERE grades.student_id = ?
`).all(studentId);
}
module.exports = {
    ajouterNote,
    modifierNote,
    supprimerNote,
    moyenneEtudiant,
    notesEtudiant
};