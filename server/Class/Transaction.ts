import { Account } from "Account";
import { Player } from "Player";
import { Society } from "Society";

export interface Transaction {
    id: number;
    type: string;
    amount: number;
    sender: Account;
    hiddenSender: boolean;
    receiver: Account;
    hiddenReceiver: boolean;
    date: Date;
    processed: boolean;
    processedDate: Date;
    refundBy: Player | Society;
    refunded: boolean;
    refundDate: Date;
    refundReason: string;
}