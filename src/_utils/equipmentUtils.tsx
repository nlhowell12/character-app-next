import {
    Armor,
    AttributeNames,
    BonusTypes,
    CarryingCapacityObject,
    Character,
    Currency,
    Equipment,
    Modifier,
    Sizes,
    Weapon,
    stackableBonuses,
} from '@/_models';
import {
    getModifierAttributeBonus,
    getTotalAttributeModifier,
    totalAttributeValue,
} from './attributeUtils';
import { BonusObject, getCombatSizeBonus } from './defenseUtils';
import {
    getDazzledModifiers,
    getEnergyDrainedModifiers,
    getEntangledModifiers,
    getFearModifiers,
    getSickenedModifiers,
    getSlowedModifiers,
} from './statusEffectUtils';

export const getAttributeDamageBonus = (
    character: Character,
    weapon: Weapon
): number => {
    return weapon.dexBasedDamage
        ? getTotalAttributeModifier(character, AttributeNames.Dexterity)
        : getTotalAttributeModifier(character, AttributeNames.Strength);
};

export const getAttributeAttackBonus = (
    character: Character,
    weapon: Weapon
): number => {
    return weapon.dexBasedAttack
        ? getTotalAttributeModifier(character, AttributeNames.Dexterity)
        : getTotalAttributeModifier(character, AttributeNames.Strength);
};

export const getAllArmorMods = (armor: Armor): Modifier[] => {
    return armor.modifiers.filter((mod) => !!mod.defense);
};

export const getTotalArmorBonus = (character: Character, armor: Armor) => {
    const mods = getAllArmorMods(armor);
    return getTotalModifierBonus(character, mods);
};

export const getAllDamageModifiers = (
    character: Character,
    weapon: Weapon
): Modifier[] => {
    const characterMods = character.miscModifiers.filter((x) => !!x.damage);
    const weaponMods = weapon.modifiers.filter((x) => !!x.damage);
    const statusEffectMods = [
        ...getSickenedModifiers(character)
    ].filter((x) => !!x.damage);
    return [...characterMods, ...weaponMods, ...statusEffectMods];
};

export const getDiceDamageModifiers = (
    character: Character,
    weapon: Weapon
): Modifier[] => {
    const allMods = getAllDamageModifiers(character, weapon);
    return allMods.filter((x) => !!x.damageType);
};

export const getTotalBAB = (character: Character): number => {
    return character.classes.reduce((x, y) => (!!y.BAB ? x + y.BAB : 0), 0);
};

export const getAllAttackModifiers = (
    character: Character,
    weapon: Weapon
): Modifier[] => {
    const characterMods = character.miscModifiers.filter((x) => !!x.attack);
    const weaponMods = weapon.modifiers.filter((x) => !!x.attack);
    const sizeBonus = getCombatSizeBonus(character);
    const sizeBonusMod: Modifier = {
        attack: true,
        value: sizeBonus, 
        type: BonusTypes.Size
    } as Modifier;
    const statusEffectMods = [
        ...getEntangledModifiers(character),
        ...getDazzledModifiers(character),
        ...getFearModifiers(character),
        ...getSickenedModifiers(character),
        ...getSlowedModifiers(character),
        ...getEnergyDrainedModifiers(character)
    ].filter((x) => !!x.attack);
    return [...characterMods, ...weaponMods, ...statusEffectMods, sizeBonusMod];
};

export const getEquipmentWeightBySize = (eq: Equipment): number => {
    const eqWeightSizeMod = {
        [Sizes.ColossalPlus]: 16,
        [Sizes.Colossal]: 16,
        [Sizes.Gargantuan]: 8,
        [Sizes.Huge]: 4,
        [Sizes.Large]: 2,
        [Sizes.Medium]: 1,
        [Sizes.Small]: 0.5,
        [Sizes.Tiny]: 0.25,
        [Sizes.Diminutive]: 0.125,
        [Sizes.Fine]: 0.0625,
    };

    const otherEqWeightSizeMod = {
        [Sizes.ColossalPlus]: 16,
        [Sizes.Colossal]: 16,
        [Sizes.Gargantuan]: 8,
        [Sizes.Huge]: 4,
        [Sizes.Large]: 2,
        [Sizes.Medium]: 1,
        [Sizes.Small]: 0.25,
        [Sizes.Tiny]: 0.125,
        [Sizes.Diminutive]: 0.0625,
        [Sizes.Fine]: 0.03125,
    };
    if(!!eq.size){
        /* @ts-ignore */
        if(eq.isArmor || eq.isWeapon){
            return eq.weight * eqWeightSizeMod[eq.size]
        } else {
            return eq.weight * otherEqWeightSizeMod[eq.size]
        }
    }
    return eq.weight;
};

export const getTotalEquipmentWeight = (character: Character) => {
    return character.equipment.reduce((x, y) => x + getEquipmentWeightBySize(y) * y.amount, 0);
};

export const getCurrencyWeight = (coins: Currency): number => {
    return Object.values(coins).reduce((x, y) => Number(x) + Number(y), 0) / 50;
};

export const getTotalCarriedWeight = (character: Character): number => {
    const eqWeight = getTotalEquipmentWeight(character);
    const currencyWeight = getCurrencyWeight(character.currency);
    return Number((eqWeight + currencyWeight).toFixed(2));
};

export const determineCarryingCapacity = (
    character: Character
): CarryingCapacityObject => {
    const capSizeMods = {
        [Sizes.ColossalPlus]: 16,
        [Sizes.Colossal]: 16,
        [Sizes.Gargantuan]: 8,
        [Sizes.Huge]: 4,
        [Sizes.Large]: 2,
        [Sizes.Medium]: 1,
        [Sizes.Small]: 0.75,
        [Sizes.Tiny]: 0.5,
        [Sizes.Diminutive]: 0.25,
        [Sizes.Fine]: 0.12,
    };
    const totalStrength: number = totalAttributeValue(
        character,
        AttributeNames.Strength
    );
    const getLight = (value: number): number =>
        Math.floor(0.3333333333333333333333 * value);
    const getMed = (value: number): number =>
        Math.floor(0.66666666666666666666666666666 * value);
    const getMiddleMax = (str: number): number =>
        Math.ceil(Math.round(100 * Math.pow(2, (str - 10) / 5)));
    const roundToFive = (val: number): number => {
        if (totalStrength % 2 === 0) {
            return Math.floor(val / 5) * 5;
        } else {
            return Math.ceil(val / 5) * 5;
        }
    };
    if (totalStrength <= 10) {
        const max = totalStrength * 10 * capSizeMods[character.size];
        return { light: getLight(max), med: getMed(max), heavy: max };
    } else if (totalStrength <= 15) {
        const max =
            roundToFive(getMiddleMax(totalStrength)) *
            capSizeMods[character.size];
        return { light: getLight(max), med: getMed(max), heavy: max };
    } else {
        const max =
            roundToFive(getMiddleMax(totalStrength - 5) * 2) *
            capSizeMods[character.size];
        return { light: getLight(max), med: getMed(max), heavy: max };
    }
};
export const getTotalModifierBonus = (
    character: Character,
    mods: Modifier[]
): number => {
    return Object.entries(getEqBonusObject(character, mods)).reduce(
        (x, [_, value]) => x + value,
        0
    );
};

export const getDamageBonus = (character: Character, weapon: Weapon) => {
    const modBonus = getTotalModifierBonus(
        character,
        getAllDamageModifiers(character, weapon)
    );
    const attBonus = getAttributeDamageBonus(character, weapon);
    return modBonus + attBonus;
};

export const getAttackBonus = (character: Character, weapon: Weapon) => {
    const modBonus = getTotalModifierBonus(
        character,
        getAllAttackModifiers(character, weapon)
    );
    const attBonus = getAttributeAttackBonus(character, weapon);
    const classBabTotal = getTotalBAB(character);
    const total = modBonus + attBonus + classBabTotal;
    
    return `${total > 0 ? '+': ''}${total}`;
};

export const getEqBonusObject = (
    character: Character,
    mods: Modifier[]
): BonusObject => {
    const bonusObject: BonusObject = {} as BonusObject;
    mods.forEach((mod) => {
        let value = mod.value;
        const attributeBasedModifier = getModifierAttributeBonus(
            character,
            mod
        );
        if (!!value || !!attributeBasedModifier) {
            if (!bonusObject[mod.type]) {
                bonusObject[mod.type] = 0;
            }
            if (!!attributeBasedModifier) {
                value = attributeBasedModifier;
            }
            if (stackableBonuses.some((type) => type === mod.type)) {
                bonusObject[mod.type] += value;
            } else if (mod.value > bonusObject[mod.type]) {
                bonusObject[mod.type] = value;
            }
        }
    });
    return bonusObject;
};

export const getModifiersFromWornEquipment = (character: Character) : Modifier[] => {
    const { equipment } = character;
    const modifiers: Modifier[] = [];
    equipment.filter(x => x.equipped).map(x => modifiers.push(...x.modifiers));
    return modifiers;
}
