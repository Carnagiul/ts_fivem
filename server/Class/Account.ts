import { Player } from "Player";
import { Society } from "Society";
import { Transaction } from "Transaction";

export interface Account {
    id: number;
    type: string;
    owner: Player | Society;
    balance: number;
    transactions: Transaction[];
}