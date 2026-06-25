    const { question, choixMenu, confirmer } = require('./utils/messagesReadline.js');
    const { logInfo } = require('./utils/logger.js');
    const authService = require('./services/authetification.js');
    const { initDatabase } = require('./db/table.js');
    const userService = require('./services/userServices.js');
    const studentService = require('./services/studentServices.js');
    const teacherService = require('./services/teacherServices.js');
    const subjectService = require('./services/subjectServices.js');
    const gradeService = require('./services/gradeServices.js');
    const absenceService = require('./services/absenceServices.js');
    const statsService = require('./services/meilleursEtudian.js');
    const db = require('./db/database.js');
    const { logError } = require('./utils/logger.js');
    // Gestion des erreurs non gérées et des promesses rejetées
    process.on('uncaughtException', (err) => {
        logError(`Erreur critique non geree : ${err.message}`);
        console.error('Une erreur critique est survenue. Consultez les logs.');
        process.exit(1);
    });
    process.on('unhandledRejection', (reason) => {
        logError(`Promesse rejetee : ${reason}`);
    });
    //  ECRAN D'ACCUEIL
    function ecranAccueil() {
        console.log('\n=== Bienvenue sur School Management ===');
        const choix = choixMenu(' Connecter vous ur votre plateforme ?', ['Se connecter', 'Quitter']);
        if (choix === 2) {
            console.log('tu vas payer gage oh.');
            process.exit(0);
        }
        ecranConnexion();
    }
    //  ECRAN DE CONNEXION
    function ecranConnexion() {
        const role = choixMenu(' Ce connecter en tant  :', ['Administrateur', 'Professeur', 'Etudiant']);
        if (role === 1) {
            const name = question('Nom :');
            const code = question('Code d\'acces :');
            const user = authService.loginUser(name, code);
            if (user && user.role === 'admin') {
                menuAdmin();
            } else {
                console.log('Identifiants incorrects.');
                ecranAccueil();
            }
        } else if (role === 2) {
            const name = question('Nom :');
            const code = question('Code d\'acces :');
            const user = authService.loginUser(name, code);
            if (user && user.role === 'professeur') {
                const fiche = teacherService.getProfesseurParUserId(user.id);
                menuProfesseur(fiche);
            } else {
                console.log('Identifiants incorrects.');
                ecranAccueil();
            }
        } else if (role === 3) {
            const matricule = question('Matricule :');
            const student = authService.loginStudent(matricule);
            if (student) {
                menuEtudiant(student);
            } else {
                console.log('Matricule introuvable.');
                ecranAccueil();
            }
        } else {
            ecranAccueil();
        }
    }
    //  MENU ADMIN 
    function menuAdmin() {
        const choix = choixMenu('=== MENU ADMINISTRATEUR ===', [
            'Ajouter un professeur',
            'Lister les professeurs',
            'Ajouter un etudiant',
            'Lister les etudiants',
            'Ajouter une matiere',
            'Affecter un professeur a une matiere',
            'Lister les matieres',
            'Se deconnecter'
        ]);
        if (choix === 1) {
            const nom = question('Nom du professeur :');
            const matiere = question('Matiere enseignee :');
            const classe = question('Classe geree :');
            const code = question('Code d\'acces a creer :');
            teacherService.ajouterProfesseur(nom, matiere, classe, code);
            console.log('Professeur ajoute.');
        } else if (choix === 2) {
            console.table(teacherService.listerProfesseurs());
        } else if (choix === 3) {
            const matricule = question('Matricule :');
            const nom = question('Nom :');
            const prenom = question('Prenom :');
            const age = question('Age :');
            const classe = question('Classe :');
            const ok = studentService.ajouterEtudiant(matricule, nom, prenom, Number(age), classe);
            console.log(ok ? 'Etudiant ajoute.' : 'Erreur : matricule deja utilise.');
        } else if (choix === 4) {
            console.table(studentService.listerEtudiants());
        } else if (choix === 5) {
            const nom = question('Nom de la matiere :');
            subjectService.ajouterMatiere(nom);
            console.log('Matiere ajoutee.');
        } else if (choix === 6) {
            const subjectId = question('ID matiere :');
            const teacherId = question('ID professeur :');
            subjectService.affecterProfesseur(Number(subjectId), Number(teacherId));
            console.log('Affectation effectuee.');
        } else if (choix === 7) {
            console.table(subjectService.listerMatieres());
        } else if (choix === 8) {
            ecranAccueil();
            return;
        }
        menuAdmin();
    }
    //  MENU PROFESSEUR 
    function menuProfesseur(prof) {
        const choix = choixMenu(`=== MENU PROFESSEUR (${prof.nom} - Classe ${prof.classe}) ===`, [
            'Lister mes etudiants',
            'Ajouter une note',
            'Modifier une note',
            'Supprimer une note',
            'Calculer la moyenne d\'un etudiant',
            'Enregistrer une absence',
            'Marquer une absence',
            'Voir le meilleur etudiant de la classe',
            'Voir la moyenne generale de la classe',
            'Se deconnecter'
        ]);
        if (choix === 1) {
            console.table(studentService.listerEtudiants(prof.classe));
        } else if (choix === 2) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            if (!etudiant || etudiant.classe !== prof.classe) {
                console.log('Etudiant introuvable dans votre classe.');
            } else {
                const subjectId = question('ID matiere :');
                const note = question('Note (0-20) :');
                const ok = gradeService.ajouterNote(etudiant.id, Number(subjectId), Number(note));
                console.log(ok ? 'Note ajoutee.' : 'Note invalide.');
            }
        } else if (choix === 3) {
            const gradeId = question('ID de la note :');
            const note = question('Nouvelle note :');
            const ok = gradeService.modifierNote(Number(gradeId), Number(note));
            console.log(ok ? 'Note modifiee.' : 'Note invalide.');
        } else if (choix === 4) {
            const gradeId = question('ID de la note a supprimer :');
            gradeService.supprimerNote(Number(gradeId));
            console.log('Note supprimee.');
        } else if (choix === 5) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            if (etudiant) {
                const moyenne = gradeService.moyenneEtudiant(etudiant.id);
                console.log(`Moyenne : ${moyenne !== null ? moyenne : 'aucune note'}`);
            }
        } else if (choix === 6) {
            const matricule = question('Matricule etudiant :');
            const etudiant = studentService.rechercherEtudiant(matricule);
            const date = question('Date (AAAA-MM-JJ) :');
            if (etudiant) {
                absenceService.enregistrerAbsence(etudiant.id, date);
                console.log('Absence enregistree.');
            }
        } else if (choix === 7) {
            const absenceId = question('ID absence :');
            const justifiee = confirmer('Absence justifiee ?');
            absenceService.marquerStatut(Number(absenceId), justifiee ? 'justifiee' : 'non_justifiee');
            console.log('Statut mis a jour.');
        } else if (choix === 8) {
            const meilleur = statsService.meilleurEtudiant(prof.classe);
            console.log(meilleur ? meilleur : 'Aucune note enregistree.');
        } else if (choix === 9) {
            const moyenne = statsService.moyenneGeneraleClasse(prof.classe);
            console.log(`Moyenne generale de la classe : ${moyenne !== null ? moyenne : 'aucune note'}`);
        } else if (choix === 10) {
            ecranAccueil();
            return;
        }
        menuProfesseur(prof);
    }
    //  MENU ETUDIANT 
    function menuEtudiant(etudiant) {
        const choix = choixMenu(`=== MENU ETUDIANT (${etudiant.prenom} ${etudiant.nom}) ===`, [
            'Voir mes notes',
            'Voir ma moyenne',
            'Voir le meilleur etudiant de la classe',
            'Voir la moyenne generale de la classe',
            'Se deconnecter'
        ]);
        if (choix === 1) {
            console.table(gradeService.notesEtudiant(etudiant.id));
        } else if (choix === 2) {
            const moyenne = gradeService.moyenneEtudiant(etudiant.id);
            console.log(`Ma moyenne : ${moyenne !== null ? moyenne : 'aucune note'}`);
        } else if (choix === 3) {
            const meilleur = statsService.meilleurEtudiant(etudiant.classe);
            console.log(meilleur ? meilleur : 'Aucune note enregistree.');
        } else if (choix === 4) {
            const moyenne = statsService.moyenneGeneraleClasse(etudiant.classe);
            console.log(`Moyenne generale : ${moyenne !== null ? moyenne : 'aucune note'}`);
        } else if (choix === 5) {
            ecranAccueil();
            return;
        }
        menuEtudiant(etudiant);
    }
    //  Fonction pour initialiser la base de données et créer un compte admin par défaut
    function seedAdmin() {
        const existe = db.prepare(
            "SELECT id FROM users WHERE name = 'Admin' AND role = 'admin'"
        ).get();
        if (!existe) {
            userService.ajouterUser('Admin', 'admin', '1234');
            logInfo('Compte admin par defaut cree (identifiant: Admin / code: 1234)');
        }
    }
    // .get() est utilisé pour récupérer un seul enregistrement de la base de données. Si aucun enregistrement n'est trouvé, il retourne undefined. Dans ce cas, on vérifie si le compte admin existe déjà avant de le créer.
    initDatabase();
    seedAdmin();
    logInfo("Demarrage de l'application School Management");
    ecranAccueil();