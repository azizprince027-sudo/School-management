const logger = require('./utils/logger');
const { initDatabase } = require('./db/table.js');
const { addUser, removeUser, listUsers } = require('./services/userServices.js');
logger.info('Démarrage du système');
logger.warning('Avertissement : Vérifiez la configuration');
logger.error('Erreur : Impossible de se connecter à la base de données');

initDatabase();


addUser('Alice', 'admin');
removeUser(1);
listUsers();