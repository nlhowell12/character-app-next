import { mockCharacters } from '@/_mockData/characters';
import {
    determineCarryingCapacity,
    getAllArmorMods,
    getAllAttackModifiers,
    getAllDamageModifiers,
    getAttackBonus,
    getAttributeAttackBonus,
    getAttributeDamageBonus,
    getCurrencyWeight,
    getDamageBonus,
    getDiceDamageModifiers,
    getEqBonusObject,
    getEquipmentWeightBySize,
    getTotalArmorBonus,
    getTotalBAB,
    getTotalCarriedWeight,
    getTotalEquipmentWeight,
    getTotalModifierBonus,
} from './equipmentUtils';
import { Armor, BaseEquipment, BonusTypes, Currency, Damage, Dice, Equipment, Sizes, Weapon } from '@/_models';

export const dagger: Weapon = {
    id: '12345',
    name: 'Dagger',
    weight: .5,
    dexBasedAttack: true,
    dexBasedDamage: true,
    category: 'Knives',
    damage: Dice.d4,
    damageTypes: [Damage.Piercing],
    numberOfDice: 1,
    twoHanded: false,
    criticalMultiplier: 2,
    criticalRange: 19,
    isWeapon: true,
    cost: '',
    amount: 5,
    modifiers: [
        {
            id: '123',
            type: BonusTypes.Paranormal,
            value: 2,
            damage: true,
        },
        {
            id: '1234',
            type: BonusTypes.Untyped,
            value: 1,
            damage: true,
        },
        {
            id: '12345',
            type: BonusTypes.Untyped,
            value: 1,
            damage: true,
        },
        {
            id: '123456',
            type: BonusTypes.Untyped,
            numberOfDice: 1,
            damageDice: Dice.d6,
            value: 0,
            damage: true,
            damageType: Damage.Fire
        },
    ],
    rangeIncrement: 10,
};
export const sword: Weapon = {
    id: '123456',
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
    isWeapon: true, 
    amount: 1,
    cost: '',
    modifiers: [
        {
            id: '123',
            type: BonusTypes.Morale,
            value: 2,
            attack: true,
        },
        {
            id: '1234',
            type: BonusTypes.Morale,
            value: 3,
            attack: true,
        },
    ],
    rangeIncrement: 0,
};

export const magicLeather: Armor = {
    id: '123457',
    name: 'Leather Armor',
    armorCheckPenalty: 0,
    maxDexBonus: 8,
    spellFailure: 0,
    hardness: 50,
    weight: 4,
    isArmor: true,
    amount: 1,
    cost: '',
    modifiers: [
        {            id: '123',
        type: BonusTypes.Armor, value: 2, defense: true},
        {            id: '1234',
        type: BonusTypes.Enhancement, value: 2, defense: true},
    ],
};

const otherEquipment: BaseEquipment = {
    id: '32456',
    name: 'Thieves Tools',
    weight: 1,
    cost: '1gp',
    modifiers: [],
    amount: 1
};

describe('Equipment Utils', () => {
    it('should return correct damage based on attribute', () => {
        expect(getAttributeDamageBonus(mockCharacters[0], dagger)).toBe(4);
        expect(getAttributeDamageBonus(mockCharacters[0], sword)).toBe(-2);
    });
    it('should return correct attack mod based on attribute', () => {
        expect(getAttributeAttackBonus(mockCharacters[0], dagger)).toBe(4);
        expect(getAttributeAttackBonus(mockCharacters[0], sword)).toBe(-2);
    });
    it('should get all damage mods', () => {
        expect(getAllDamageModifiers(mockCharacters[0], dagger).length).toBe(6);
    });
    it('should get all damage dice mods', () => {
        expect(getDiceDamageModifiers(mockCharacters[0], dagger).length).toBe(1);
        expect(getDiceDamageModifiers(mockCharacters[0], dagger)[0].numberOfDice).toBe(1);
        expect(getDiceDamageModifiers(mockCharacters[0], dagger)[0].damageDice).toBe(Dice.d6);
        expect(getDiceDamageModifiers(mockCharacters[0], dagger)[0].damageType).toBe(Damage.Fire);
    });
    it('should get all attack mods', () => {
        expect(getAllAttackModifiers(mockCharacters[0], sword).length).toBe(5);
    });
    it('should return the correct carrying capacity', () => {
        expect(determineCarryingCapacity({...mockCharacters[0], size: Sizes.Medium})).toStrictEqual({light: 23, med: 46, heavy: 70})
        expect(determineCarryingCapacity({...mockCharacters[0], size: Sizes.Medium, attributes:{...mockCharacters[0].attributes, Strength: {value: 11}}})).toStrictEqual({light: 23, med: 46, heavy: 70})
        expect(determineCarryingCapacity({...mockCharacters[0], size: Sizes.Medium, attributes:{...mockCharacters[0].attributes, Strength: {value: 15}}})).toStrictEqual({light: 38, med: 76, heavy: 115})
        expect(determineCarryingCapacity({...mockCharacters[0], size: Sizes.Medium, attributes:{...mockCharacters[0].attributes, Strength: {value: 22}}})).toStrictEqual({light: 100, med: 200, heavy: 300})
        expect(determineCarryingCapacity({...mockCharacters[0], size: Sizes.Medium, attributes:{...mockCharacters[0].attributes, Strength: {value: 23}}})).toStrictEqual({light: 116, med: 233, heavy: 350})
        expect(determineCarryingCapacity({...mockCharacters[0], size: Sizes.Medium, attributes:{...mockCharacters[0].attributes, Strength: {value: 24}}})).toStrictEqual({light: 133, med: 266, heavy: 400})
        expect(determineCarryingCapacity({...mockCharacters[0], size: Sizes.Small, attributes:{...mockCharacters[0].attributes, Strength: {value: 24}}})).toStrictEqual({light: 100, med: 200, heavy: 300})
    });
    it('should modify equipment weight by size of equipment', () => {
        expect(getEquipmentWeightBySize(dagger)).toBe(dagger.weight);
        expect(getEquipmentWeightBySize(otherEquipment)).toBe(otherEquipment.weight);
        expect(getEquipmentWeightBySize({...otherEquipment, size: Sizes.Small})).toBe(otherEquipment.weight * .25);
        expect(getEquipmentWeightBySize({...otherEquipment, size: Sizes.Large})).toBe(otherEquipment.weight * 2);
        expect(getEquipmentWeightBySize({...dagger, size: Sizes.Small})).toBe(dagger.weight * .5);
        expect(getEquipmentWeightBySize({...dagger, size: Sizes.Large})).toBe(dagger.weight * 2);
    })
    it('should return total weight of carried equipment', () => {
        expect(getTotalEquipmentWeight(mockCharacters[0])).toBe(7)
        expect(getTotalEquipmentWeight({...mockCharacters[0], equipment: [...mockCharacters[0].equipment, dagger]})).toBe(9.5)
    });
    it('should get total weight of equipment and currency', () => {
        expect(getTotalCarriedWeight({...mockCharacters[0], currency: {cp: 0, sp: 0, gp: 150, pp: 0}})).toBe(10)
    });
    it('should get total BAB from all classes', () => {
        expect(getTotalBAB(mockCharacters[0])).toBe(1)
    })
    it('should total modifiers for damage or attack', () => {
        const damageModifiers = getAllDamageModifiers(
            mockCharacters[0],
            dagger
        );
        const attackModifiers = getAllAttackModifiers(mockCharacters[0], sword);
        expect(getTotalModifierBonus(mockCharacters[0], damageModifiers)).toBe(
            8
        );
        expect(getTotalModifierBonus(mockCharacters[0], attackModifiers)).toBe(
            5
        );
    });
    it('should get the damage bonus', () => {
        expect(getDamageBonus(mockCharacters[0], dagger)).toBe(12);
        expect(getDamageBonus(mockCharacters[0], sword)).toBe(2);
    });
    it('should get the attack bonus', () => {
        expect(getAttackBonus(mockCharacters[0], sword)).toBe('+4');
        expect(getAttackBonus(mockCharacters[0], dagger)).toBe('+9');
    });
    it('should return an attack bonus object', () => {
        expect(
            getEqBonusObject(
                mockCharacters[0],
                getAllAttackModifiers(mockCharacters[0], sword)
            )
        ).toStrictEqual({
            [BonusTypes.Morale]: 3,
            [BonusTypes.Untyped]: 2,
        });
        expect(
            getEqBonusObject(
                mockCharacters[0],
                getAllDamageModifiers(mockCharacters[0], sword)
            )
        ).toStrictEqual({
            [BonusTypes.Morale]: 2,
            [BonusTypes.Untyped]: 2,
        });
    });
    it('should get all armor mods from armor', () => {
        expect(getAllArmorMods(magicLeather).length).toBe(2)
    });
    it('should get totalArmorBonus', () => {
        const total = getTotalArmorBonus(mockCharacters[0], magicLeather)
        expect(total).toBe(4)
    });
    it('should get weight of coins carried', () => {
        const mockCurrency: Currency = {
            cp: 47,
            sp: 200,
            gp: 53,
            pp: 100
        }
        const total = getCurrencyWeight(mockCurrency)
        expect(total).toBe(8)
    });
});
