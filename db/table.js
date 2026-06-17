const db = require('./database.js').db;

function initDatabase() {
// La méthode "exec" est utilisée pour exécuter une série de commandes SQL qui créent les tables nécessaires à la gestion d'une école. Chaque table est créée avec des colonnes spécifiques et des contraintes pour assurer l'intégrité des données. Par exemple, la table "users" contient des colonnes pour l'identifiant, le nom et le rôle de l'utilisateur, avec une contrainte CHECK pour limiter les rôles possibles. De même, les autres tables sont conçues pour stocker les informations sur les étudiants, les enseignants, les matières, les notes et les absences.
    db.exec(` 
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT NOT NULL, 
            role TEXT NOT NULL CHECK (role IN ('admin','professeur','étudiant'))
        );
        
        CREATE TABLE IF NOT EXISTS students ( 
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            matricule TEXT UNIQUE NOT NULL, 
            nom TEXT NOT NULL, 
            prenom TEXT NOT NULL, 
            age INTEGER NOT NULL, 
            classe TEXT NOT NULL 
        ); 
        
        CREATE TABLE IF NOT EXISTS teachers ( 
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL, 
            matiere TEXT NOT NULL 
        );

        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nom TEXT NOT NULL, 
            teacher_id INTEGER, 
            FOREIGN KEY (teacher_id) REFERENCES teachers(id) 
        );
        
        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            student_id INTEGER NOT NULL, 
            subject_id INTEGER NOT NULL,
            note REAL NOT NULL CHECK(note >= 0 AND note <= 20),
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (subject_id) REFERENCES subjects(id) 
        );

        CREATE TABLE IF NOT EXISTS absences ( 
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            student_id INTEGER NOT NULL,
            date TEXT NOT NULL, 
            status TEXT NOT NULL DEFAULT 'non justifiée' CHECK(status IN ('justifiée','non justifiée')), 
            FOREIGN KEY (student_id) REFERENCES students(id) 
        ); 
    `);
}

const createUser = (name, role) => db.prepare('INSERT INTO users (name, role) VALUES (?,?)').run(name, role); 
const deleteUser = (id) => db.prepare('DELETE FROM users WHERE id = ?').run(id); 
const getAllUsers = () => db.prepare('SELECT * FROM users').all();

module.exports = { createUser, deleteUser, getAllUsers, initDatabase };

