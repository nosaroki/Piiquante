// On importe le package HTTP de Node qui permet de créer un serveur + app.js
const http = require("http");
const app = require ("./app");

// Renvoie un port valide qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// On dit à l'app express sur quel port elle va tourner
// Ce serveur attend les requêtes envoyées en utilisant listen
// On utilise port 3000 par défaut, s'il n'est pas dispo on utilise la variable environnement "process.env.PORT ||"
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Recherche les ≠ erreurs et les gèer de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// On créé une nouvelle constante dans laquelle on appelle la fonction qui sera appelée à chaque requête serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);

// Serveur Node opérationnel