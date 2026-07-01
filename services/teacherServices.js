const db = require('../db/database.js');
const { logInfo } = require('../utils/logger.js');
const { ajouterUser } = require('./userServices.js');
// L'admin cree d'abord le compte (users), puis la fiche professeur (teachers)
function ajouterProfesseur(nom, matiere, classe, codeAcces) {
    const userId = ajouterUser(nom, 'professeur', codeAcces);
    const stmt = db.prepare(
        'INSERT INTO teachers (user_id, nom, matiere, classe) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(userId, nom, matiere, classe);
    logInfo(`Professeur ajoute : ${nom} - ${matiere} - Classe ${classe}`);
    return result.lastInsertRowid;
}
// La fonction "modifierProfesseur" est utilisée pour modifier les informations d'un professeur dans la base de données en utilisant son id. Elle prend deux paramètres : "id" qui représente l'id du professeur à modifier, et "champs" qui est un objet contenant les champs à modifier (nom, matiere, classe). La fonction utilise une requête SQL préparée pour mettre à jour les informations du professeur correspondant à cet id dans la table "teachers". Après la modification, une information est enregistrée dans les logs pour indiquer que le professeur a été modifié.
function modifierProfesseur(id, champs) {
    const { nom, matiere, classe } = champs;
    // On recupere le user_id lie a ce professeur AVANT la mise a jour
    const prof = db.prepare('SELECT user_id FROM teachers WHERE id = ?').get(id);
    db.prepare(
        'UPDATE teachers SET nom = ?, matiere = ?, classe = ? WHERE id = ?'
    ).run(nom, matiere, classe, id);
    // CORRECTIF : on synchronise aussi users.name, sinon le nouveau nom
    // n'apparait pas dans la table users et le professeur ne peut plus
    // se connecter qu'avec son ANCIEN nom.
    if (prof) {
        db.prepare('UPDATE users SET name = ? WHERE id = ?').run(nom, prof.user_id);
    }
    logInfo(`Professeur modifie : id ${id}`);
}
// La fonction "supprimerProfesseur" est utilisée pour supprimer un professeur de la base de données en utilisant son id. Elle prend un paramètre "id" qui représente l'id du professeur à supprimer. La fonction utilise une requête SQL préparée pour supprimer le professeur correspondant à cet id dans la table "teachers". Après la suppression, une information est enregistrée dans les logs pour indiquer que le professeur a été supprimé.
function supprimerProfesseur(id) {
    // CORRECTIF : on recupere le user_id AVANT de supprimer la fiche teacher,
    // sinon le compte users correspondant reste orphelin (le professeur
    // supprime pourrait encore se connecter, avec un menu casse car sans fiche).
    const prof = db.prepare('SELECT user_id FROM teachers WHERE id = ?').get(id);
    db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
    if (prof) {
        db.prepare('DELETE FROM users WHERE id = ?').run(prof.user_id);
    }
    logInfo(`Professeur supprime : id ${id}`);
}
// La fonction "rechercherProfesseur" est utilisée pour rechercher un professeur dans la base de données en utilisant son id. Elle prend un paramètre "id" qui représente l'id du professeur à rechercher. La fonction utilise une requête SQL préparée pour sélectionner le professeur correspondant à cet id dans la table "teachers". Si un professeur avec cet id est trouvé, ses informations sont retournées sous forme d'objet. Si aucun professeur n'est trouvé, la fonction retourne undefined.
function rechercherProfesseur(id) {
    return db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
}
// La fonction "listerProfesseurs" est utilisée pour lister tous les professeurs présents dans la base de données. Elle utilise une requête SQL préparée pour sélectionner tous les professeurs de la table "teachers". Les informations de tous les professeurs sont retournées sous forme de tableau d'objets.
function listerProfesseurs() {
    return db.prepare('SELECT * FROM teachers').all();
}
// Recupere la fiche professeur a partir du user_id (utile apres le login)
function getProfesseurParUserId(userId) {
    return db.prepare('SELECT * FROM teachers WHERE user_id = ?').get(userId);
}
module.exports = {
    ajouterProfesseur,
    modifierProfesseur,
    supprimerProfesseur,
    rechercherProfesseur,
    listerProfesseurs,
    getProfesseurParUserId
};