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

export interface Equipment extends BaseEquipment, Weapon, Armor {};

export interface BaseEquipment {
    id: string;
    name: string;
    weight: number;
    modifiers: Modifier[];
    size?: Sizes;
    bodySlot?: BodySlot;
    amount: number;
    category?: string;

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
    isWeapon: boolean;
}

export interface Armor extends BaseEquipment {
    armorCheckPenalty: number;
    equipped?: boolean;
    maxDexBonus: number;
    spellFailure: number;
    hardness: number;
    isArmor: boolean;
}
