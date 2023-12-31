import { AttributeNames, Character, Modifier, Weapon, stackableBonuses } from '@/_models';
import { getModifierAttributeBonus, getTotalAttributeModifier } from './attributeUtils';
import { BonusObject } from './defenseUtils';

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

export const getAllDamageModifiers = (character: Character, weapon: Weapon): Modifier[] => {
    const characterMods = character.miscModifiers.filter(x => !!x.damage);
    const weaponMods = weapon.modifiers.filter(x => !!x.damage);
    return [...characterMods, ...weaponMods];
};

export const getAllAttackModifiers = (character: Character, weapon: Weapon): Modifier[] => {
    const characterMods = character.miscModifiers.filter(x => !!x.attack);
    const weaponMods = weapon.modifiers.filter(x => !!x.attack);
    return [...characterMods, ...weaponMods];
};

export const getTotalModifierBonus = (character: Character, mods: Modifier[]): number => {
    return Object.entries(getEqBonusObject(character, mods)).reduce((x, [_, value]) => x + value, 0);
};

export const getDamageBonus = (character: Character, weapon: Weapon) => {
    const modBonus = getTotalModifierBonus(character, getAllDamageModifiers(character, weapon))
    const attBonus = getAttributeDamageBonus(character, weapon);
    return modBonus + attBonus;
};

export const getAttackBonus = (character: Character, weapon: Weapon) => {
    const modBonus = getTotalModifierBonus(character, getAllAttackModifiers(character, weapon));
    const attBonus = getAttributeAttackBonus(character, weapon);
    return modBonus + attBonus;
};

export const getEqBonusObject = (character: Character, mods: Modifier[]): BonusObject => {
    const bonusObject: BonusObject = {} as BonusObject;
    mods.forEach(mod => {
        const attributeBasedModifier = getModifierAttributeBonus(character, mod);
        if(!bonusObject[mod.type]){
            bonusObject[mod.type] = 0
        }
        if(!!attributeBasedModifier) {
            mod.value = attributeBasedModifier;
        }
        if (stackableBonuses.some((type) => type === mod.type)) {
            bonusObject[mod.type] += mod.value;
        } else if (mod.value > bonusObject[mod.type]) {
            bonusObject[mod.type] = mod.value;
        }
    })
    return bonusObject;
};
