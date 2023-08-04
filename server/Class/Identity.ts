import { connection } from "./Database";

export const tableName: string = "identities";

export interface Identity {
    id: number;
    firstName: string;
    lastName: string;
    height: number;
    weight: number;
    age: number;
    birthday: Date;
    isMale: boolean;
    isFake: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;

    mom: Identity | undefined;
    dad: Identity | undefined;

    childrens: Identity[] | undefined;
    brothers: Identity[] | undefined;
    sisters: Identity[] | undefined;
    friends: Identity[] | undefined;
    enemies: Identity[] | undefined;
}

var identities: Identity[] = [];

export var identityLoaded: boolean = false;

export function getIdentities(): Identity[] {
    return identities;
}

export function getIdentity(id: number): Identity | undefined {
    return identities.find(x => x.id === id);
}

export function addIdentity(firstName: string, lastName: string, height: number, weight: number, age: number, birthday: Date, isMale: boolean, isFake: boolean): void {
    const date: Date = new Date();
    connection.query("INSERT INTO `"+tableName+"` (`firstName`, `lastName`, `height`, `weight`, `age`, `birthday`, `isMale`, `isFake`,  `created_at`,  `updated_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [firstName, lastName, height, weight, age, birthday, isMale, isFake, date.toDateString(), date.toDateString()], (err, results) => {
        if (err)
            console.log(err);
        else {
            identities.push({
                id: results.insertId,
                firstName: firstName,
                lastName: lastName,
                height: height,
                weight: weight,
                age: age,
                birthday: birthday,
                isMale: isMale,
                isFake: isFake,
                mom: undefined,
                dad: undefined,
                childrens: undefined,
                brothers: undefined,
                sisters: undefined,
                friends: undefined,
                enemies: undefined
            });
            identityLoaded = true;
            console.log("Identity added");
        }
    });
}

export function removeIdentity(id: number): void {
    identities = identities.filter(x => x.id !== id);
}

export function updateIdentity(identity: Identity): void {
    identities = identities.map(x => x.id === identity.id ? identity : x);
}

export function loadIdentities(): void {
    connection.query("SELECT * FROM `"+tableName+"` WHERE `deleted_at` IS NULL OR `deleted_at` < NOW(); ", (err, results) => {
        if (err)
            console.log(err);
        else {
            identities = results.map((x: any) => {
                return {
                    id: x.id,
                    firstName: x.firstName,
                    lastName: x.lastName,
                    height: x.height,
                    weight: x.weight,
                    age: x.age,
                    birthday: x.birthday,
                    isMale: x.isMale,
                    isFake: x.isFake,
                    created_at: x.created_at,
                    updated_at: x.updated_at,
                    deleted_at: x.deleted_at,
                };
            });
            console.log("Identities loaded");
        }
    });
}
