import { mockCharacters } from "@/_mockData/characters";
import { getAllAttackModifiers, getAllDamageModifiers, getAttackBonus, getAttributeAttackBonus, getAttributeDamageBonus, getDamageBonus, getEqBonusObject, getTotalModifierBonus } from "./equipmentUtils";
import { BonusTypes, Damage, Dice, Weapon } from "@/_models";

const dagger: Weapon = {
    id: '12345',
    name: 'Dagger',
    weight: 4,
    dexBasedAttack: true,
    dexBasedDamage: true,
    category: 'Knives', 
    damage: Dice.d4,
    damageTypes: [Damage.Piercing],
    numberOfDice: 1,
    twoHanded: false,
    criticalMultiplier: 2,
    criticalRange: 19,
    modifiers: [
        {
        type: BonusTypes.Paranormal,
        value: 2,
        damage: true
        },
        {
        type: BonusTypes.Untyped,
        value: 1,
        damage: true
        },
        {
        type: BonusTypes.Untyped,
        value: 1,
        damage: true
        },
]
};
const sword: Weapon = {
    id: '12345',
    name: 'Sword',
    weight: 8,
    dexBasedAttack: false,
    dexBasedDamage: false,
    category: 'Blades', 
    damage: Dice.d8,
    damageTypes: [Damage.Piercing, Damage.Slashing],
    numberOfDice: 1,
    twoHanded: false,
    criticalMultiplier: 2,
    criticalRange: 19,
    modifiers: [
        {
        type: BonusTypes.Morale,
        value: 2,
        attack: true
        },
        {
        type: BonusTypes.Morale,
        value: 3,
        attack: true
        },
]
};

describe('Equipment Utils', () => {
    it('should return correct damage based on attribute', () => {
        expect(getAttributeDamageBonus(mockCharacters[0], dagger)).toBe(4);
        expect(getAttributeDamageBonus(mockCharacters[0], sword)).toBe(0);
    })
    it('should return correct attack mod based on attribute', () => {
        expect(getAttributeAttackBonus(mockCharacters[0], dagger)).toBe(4);
        expect(getAttributeAttackBonus(mockCharacters[0], sword)).toBe(0);
    })
    it('should get all damage mods', () => {
        expect(getAllDamageModifiers(mockCharacters[0], dagger).length).toBe(4);
    })
    it('should get all attack mods', () => {
        expect(getAllAttackModifiers(mockCharacters[0], sword).length).toBe(5);
    })
    it('should total modifiers for damage or attack', () => {
        const damageModifiers = getAllDamageModifiers(mockCharacters[0], dagger);
        const attackModifiers = getAllAttackModifiers(mockCharacters[0], sword)
        expect(getTotalModifierBonus(damageModifiers)).toBe(6);
        expect(getTotalModifierBonus(attackModifiers)).toBe(5);
    });
    it('should get the damage bonus', () => {
        expect(getDamageBonus(mockCharacters[0], dagger)).toBe(10);
        expect(getDamageBonus(mockCharacters[0], sword)).toBe(2);
    })
    it('should get the attack bonus', () => {
        expect(getAttackBonus(mockCharacters[0], sword)).toBe(5);
        expect(getAttackBonus(mockCharacters[0], dagger)).toBe(8);
    })
    it('should return an attack bonus object', () => {
        expect(getEqBonusObject(getAllAttackModifiers(mockCharacters[0], sword))).toStrictEqual({
            [BonusTypes.Morale]: 3,
            [BonusTypes.Untyped]: 2
        })
        expect(getEqBonusObject(getAllDamageModifiers(mockCharacters[0], sword))).toStrictEqual({
            [BonusTypes.Morale]: 2,
        })
    })
});