    const db = require('../db/database.js');
    const { logInfo } = require('../utils/logger.js');

    function ajouterMatiere(nom, teacherId = null) {
        const stmt = db.prepare('INSERT INTO subjects (nom, teacher_id) VALUES (?, ?)');
        const result = stmt.run(nom, teacherId);
        logInfo(`Matiere ajoutee : ${nom}`);
        return result.lastInsertRowid;
    }

    function affecterProfesseur(subjectId, teacherId) {
        db.prepare('UPDATE subjects SET teacher_id = ? WHERE id = ?').run(teacherId, subjectId);
        logInfo(`Professeur ${teacherId} affecte a la matiere ${subjectId}`);
    }

    function listerMatieres() {
        return db.prepare(`
    SELECT subjects.id, subjects.nom, teachers.nom AS professeur
    FROM subjects
    LEFT JOIN teachers ON subjects.teacher_id = teachers.id
    `).all();
    }
    module.exports = { ajouterMatiere, affecterProfesseur, listerMatieres };