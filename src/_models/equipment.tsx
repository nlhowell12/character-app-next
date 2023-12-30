import { Dice, Sizes, Modifier } from '.';

export enum BodySlot {
    Head = 'Head',
    Eye = 'Eye',
    Neck = 'Neck',
    Torso = 'Torso',
    Body = 'Body',
    Waist = 'Waist',
    Shoulders = 'Shoulders',
    Wrist = 'Wrist',
    Hands = 'Hands',
    Ring = 'Ring',
    Feet = 'Feet',
    None = 'None',
}

export type Equipment = BaseEquipment | Weapon | Armor;

export interface BaseEquipment {
    id: string;
    name: string;
    weight: number;
    magical?: boolean;
    masterwork?: boolean;
    modifiers: Modifier[];
    size?: Sizes;
    bodySlot?: BodySlot;
}

export interface Weapon extends BaseEquipment {
    category: string;
    numberOfDice: number;
    damage: Dice;
    qualities: string[];
    twoHanded: boolean;
    criticalRange: number;
    criticalMultiplier: number;
}

export interface Armor extends BaseEquipment {
    armorCheckPenalty: number;
    equipped?: boolean;
}
