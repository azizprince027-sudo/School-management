class Absence {
    // Le constructeur de la classe "Absence" est une fonction spéciale qui est appelée lors de la création d'une nouvelle instance de la classe. Il prend quatre paramètres : "id", "studentId", "date" et "status". Ces paramètres sont utilisés pour initialiser les propriétés de l'objet "Absence". La propriété "id" représente l'identifiant unique de l'absence, "studentId" représente l'identifiant de l'étudiant concerné par l'absence, "date" représente la date de l'absence, et "status" représente le statut de l'absence, qui peut être soit 'justifiee' (justifiée) soit 'non_justifiee' (non justifiée). En utilisant ce constructeur, on peut facilement créer des objets "Absence" avec les informations nécessaires.
    constructor(id, studentId, date, status) {
        this.id = id;
        this.studentId = studentId;
        this.date = date;
        this.status = status; // 'justifiee' ou 'non_justifiee'
    }
}
// La classe "Absence" représente une absence d'un étudiant à une date spécifique. Elle contient des propriétés pour stocker l'identifiant de l'absence, l'identifiant de l'étudiant concerné, la date de l'absence et le statut de l'absence (justifiée ou non justifiée). Cette classe peut être utilisée pour créer des objets représentant les absences des étudiants, facilitant ainsi la gestion des absences dans l'application de gestion scolaire.
module.exports = Absence;