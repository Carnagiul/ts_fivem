import { Account } from "Account";
import { Player } from "Player";
import { SocietyGrade } from "SocietyGrade";

export interface Society {
    id: number;
    name: string;
    type: string;
    power: number;
    owner: Player;
    grade: SocietyGrade[];
    members: Player[];
    accounts: Account[];
}