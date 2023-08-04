import { Account } from "./Account";
import { Identity } from "./Identity";  // Import the Identity interface from Identity.ts
import { SocietyGrade } from "./SocietyGrade";
import { connection } from "./Database";
import { getDateString } from "../Tools/date";

export const tableName: string = "players";

export interface Player {
    id: number;
    identity: Identity;
    pos_x: number;
    pos_y: number;
    pos_z: number;
    pedID: number;
    accounts: Account[];
    jobs: SocietyGrade[];
    steamID: string;
}

export var players: Map<string, Player> = new Map<string, Player>();
export var playersBySource: Map<string, Player> = new Map<string, Player>();
export var playerLoaded: boolean = false;

export function loadPlayers() {
    connection.query("SELECT * FROM `"+tableName+"` WHERE `deleted_at` IS NULL OR `deleted_at` < NOW(); ", (err, results) => {
        if (err)
            console.log(err);
        else {
            results.forEach((x: any) => {
                players.set(x.steam_id, {
                    id: x.id,
                    identity: undefined,
                    pedID: undefined,
                    accounts: undefined,
                    jobs: undefined,
                    steamID: x.steam_id,
                    pos_x: parseFloat(x.pos_x),
                    pos_y: parseFloat(x.pos_y), 
                    pos_z: parseFloat(x.pos_z)
                });
                
            });
            console.log("Players loaded");
            playerLoaded = true;
        }
    });
}

export function savePlayer(steamID: string) {
    const date: Date = new Date();
    var player: Player = players.get(steamID);
    connection.query("UPDATE `"+tableName+"` SET `pos_x` = ?, `pos_y` = ?, `pos_z` = ?, `updated_at` = ? WHERE `steam_id` = ?", [player.pos_x, player.pos_y, player.pos_z, getDateString(), steamID], (err, results) => {
        if (err)
            console.log(err);
        else {
            console.log("Player saved");
        }
    });
}

export function getPlayerBySteamID(steamID: string): Player {
    return players.get(steamID);
}

export function createPlayer(steamID: string): Player {
    const date: Date = new Date();
    connection.query("INSERT INTO `"+tableName+"` (`steam_id`, `pos_x`, `pos_y`, `pos_z`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?)", [steamID, "0.0", "0.0", "0.0", getDateString(), getDateString()], (err, results) => {
        if (err)
            console.log(err);
        else {
            var player: Player = {
                id: undefined,
                identity: undefined,
                pedID: undefined,
                accounts: undefined,
                jobs: undefined,
                pos_x: 0.0,
                pos_y: 0.0,
                pos_z: 0.0,
                steamID: steamID
            };
            players.set(steamID, player);
        }
    });
    return players.get(steamID);
}