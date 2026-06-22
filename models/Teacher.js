class Teacher {
    // Le constructeur de la classe Teacher est une fonction spéciale qui est appelée lors de la création d'une nouvelle instance de la classe. Il prend quatre paramètres : id, nom, matiere et classe. Ces paramètres sont utilisés pour initialiser les propriétés de l'objet Teacher. Par exemple, lorsque vous créez un nouvel enseignant en utilisant "new Teacher(1, 'M. Dupont', 'Mathématiques', '5ème')", le constructeur assignera ces valeurs aux propriétés correspondantes de l'objet Teacher.
    constructor(id, nom, matiere, classe) {
            this.id = id;
            this.nom = nom;
            this.matiere = matiere;
            this.classe = classe;
        }
        // La méthode getInfo() est une fonction définie dans la classe Teacher qui retourne une chaîne de caractères formatée contenant les informations de l'enseignant. Elle utilise les propriétés de l'objet (id, nom, matiere, classe) pour construire une description complète de l'enseignant, facilitant ainsi l'affichage de ses détails dans l'application. Par exemple, si vous avez un enseignant avec id=1, nom='M. Dupont', matiere='Mathématiques' et classe='5ème', la méthode getInfo() retournera la chaîne "Prof #1 - M. Dupont - Mathématiques - Classe 5ème".
    getInfo() {
        return `Prof #${this.id} - ${this.nom} - ${this.matiere} - Classe ${this.classe}`;
    }
}
module.exports = Teacher;