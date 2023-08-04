import { dbReady } from "Class/Database";
import { createPlayer, getPlayerBySteamID, playersBySource, savePlayer } from "Class/Player";

console.log("[test] Server Resource Started");

function checkIfPlayerExists(source: number) {
    getPlayerIdentifiers(source).forEach((identifier: string) => {

        if (identifier.includes("steam:")) {
            if (getPlayerBySteamID(identifier) != undefined) {
                playersBySource.set(source + "", getPlayerBySteamID(identifier));
                console.log(`[test] Player ${source} already exists`);
            } else {
                playersBySource.set(source + "", createPlayer(identifier));
                console.log(`[test] Player ${source} does not exist`);
            }
        }
        console.log(`[test] Player ${source} identifier: ${identifier}`);
    });
}

on("playerJoining", (source: number) => {
    console.log(`[test] Player ${source} joined`);
    checkIfPlayerExists(source);
    console.log(playersBySource.get(source + "").steamID);

});

on("playerDropped", (source: number, reason: string) => {
    console.log(`[test] Player ${source} dropped`);
    var player = playersBySource.get(source + "");

    if (player != undefined) {
        var ped = GetPlayerPed(source + "");
        var vector = GetEntityCoords(ped);

        player.pos_x = vector[0];
        player.pos_y = vector[1];
        player.pos_z = vector[2];
        savePlayer(player.steamID);
        console.log(`[test] Player ${source} ${vector[0]} ${vector[1]} ${vector[2]} dropped`);
    } else {
        console.log(`[test] Player ${source} does not exist`);
    }
});

function executeWhenDbReady() {
    if (dbReady) {
        // Exécuter loadPlayers() et loadIdentities() ici
        getPlayers().forEach((source: string) => {
        console.log(`[test] Player ${source} already connected`);
        checkIfPlayerExists(parseInt(source));
    });
    } else {
        // Attendre 100 millisecondes et vérifier à nouveau
        setTimeout(executeWhenDbReady, 100);
    }
}
executeWhenDbReady();
