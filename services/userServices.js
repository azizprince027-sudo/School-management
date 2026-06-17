    const userModel = require('../db/table.js');
    const logger = require('../utils/logger');
    const ROLES = ['admin', 'professeur', 'étudiant'];
// ajout d'un utilisateur avec validation des données et journalisation des actions

    function addUser(name, role) { 
        
        if (!name || !ROLES.includes(role)) { 
            logger.warning(`Ajout utilisateur échoué — données invalides`);
        return { success: false, message: 'Nom ou rôle invalide.' };

        } 
        userModel.createUser(name, role); 
        logger.info(`Utilisateur ajouté : ${name} (${role})`); 
        return { success: true };

        } 
// suppression d'un utilisateur avec validation de l'identifiant et journalisation des actions

        function removeUser(id) { 
            
            userModel.deleteUser(id);
            logger.info(`Utilisateur supprimé : id=${id}`);
            } 
// liste de tous les utilisateurs avec journalisation de l'action

            function listUsers() { 

                return userModel.getAllUsers();
                
            } 
            
            module.exports = { addUser, removeUser, listUsers };