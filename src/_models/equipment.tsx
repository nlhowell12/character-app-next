import { Dice, Sizes, Modifier, Damage } from '.';

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

export interface DBEquipment extends BaseEquipment, Weapon, Armor {};

export type Equipment  = BaseEquipment | Armor | Weapon;

export interface BaseEquipment {
    id: string;
    name: string;
    weight: number;
    modifiers: Modifier[];
    size?: Sizes;
    bodySlot?: BodySlot;
    amount: number;
    category?: string;
    cost: string;
    equipped?: boolean;
    isWeapon?: boolean;
    isArmor?: boolean;
}
export interface Weapon extends BaseEquipment {
    numberOfDice: number;
    damage: Dice;
    damageTypes: Damage[];
    twoHanded: boolean;
    criticalRange: number;
    criticalMultiplier: number;
    rangeIncrement: number;
    dexBasedAttack: boolean;
    dexBasedDamage: boolean;
}

export interface Armor extends BaseEquipment {
    armorCheckPenalty: number;
    equipped?: boolean;
    maxDexBonus: number;
    spellFailure: number;
    hardness: number;
}
