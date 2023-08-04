import { identityLoaded, loadIdentities } from './Identity';
import { loadPlayers, playerLoaded } from './Player';
import * as mysql from 'mysql';

export var dbReady: boolean = false;
export var dbStarted: boolean = false;

export const connection = mysql.createConnection({
    host: GetConvar('mysql_host', 'localhost'),
    user: GetConvar('mysql_user', 'root'),
    password: GetConvar('mysql_password', ''),
    database: GetConvar('mysql_database', 'mydatabase'),
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database!');
    dbStarted = true;
});

function setAsReady() {
  dbReady = true;
}
function loadIdentitiesAfterDbStart() {
  loadIdentities();
  setTimeout(setAsReady, 1000);
}
function loadPlayersAfterDbStart() {
  loadPlayers();
  setTimeout(loadIdentitiesAfterDbStart, 1000);
}

function executeWhenDbReady() {
  if (dbStarted) {
    setTimeout(loadPlayersAfterDbStart, 100);
  } else {
    // Attendre 100 millisecondes et vérifier à nouveau
    setTimeout(executeWhenDbReady, 100);
  }
}


executeWhenDbReady();