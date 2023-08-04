import { Item } from "Item";
import { Player } from "Player";
import { Society } from "Society";

export interface Inventory {
    id: number;
    type: string;
    owner: Player | Society;
    content: Item[];
}