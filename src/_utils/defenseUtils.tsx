import {
    Armor,
    AttributeNames,
    BonusTypes,
    Character,
    CharacterClass,
    Damage,
    Equipment,
    Modifier,
    ModifierSource,
    SizeModifiers,
    StatusEffects,
    stackableBonuses,
} from '@/_models';
import { getTotalAttributeModifier } from './attributeUtils';
import { getEnergyDrainedModifiers, getFearModifiers, getSickenedModifiers, getSlowedModifiers } from './statusEffectUtils';

export interface DefenseObject {
    dsBonus: number;
    drBonus: number;
}

const adjustDexForStatusEffects = (character: Character, dexMod: number) => {
    const loseDexMods = [
        StatusEffects.Blinded,
        StatusEffects.Cowering,
        StatusEffects.Frightened,
		StatusEffects.Stunned
    ];
    const additionalPenaltyMods = [
        StatusEffects.Blinded,
        StatusEffects.Cowering,
		StatusEffects.Stunned
    ];
    const additionalPenalty = character.statusEffects.some((x) =>
        additionalPenaltyMods.includes(x)
    )
        ? -2
        : 0;
    const adjustedDexMod = character.statusEffects.some((x) =>
        loseDexMods.includes(x)
    )
        ? additionalPenalty
        : dexMod;

    return adjustedDexMod;
};

export const drBonusTypes = [
    BonusTypes.Armor,
    BonusTypes.Shield,
    BonusTypes.Racial,
];

export const getTotalDefense = (character: Character): DefenseObject => {
    const adjustedDexMod = adjustDexForStatusEffects(
        character,
        getAdjustedMaxDexMod(character)
    );

    const acBonuses = getDefenseBonuses(character);
    let totalDRBonuses = 0;
    let totalDSBonuses = 0;
    Object.keys(acBonuses).forEach((bonus) => {
        const typedBonus = bonus as BonusTypes;
        if (drBonusTypes.includes(typedBonus)) {
            totalDRBonuses += acBonuses[typedBonus];
        } else {
            totalDSBonuses += acBonuses[typedBonus];
        }
    });

    return {
        dsBonus: 10 + Number(adjustedDexMod) + totalDSBonuses,
        drBonus: totalDRBonuses,
    };
};

export const getAdjustedMaxDexMod = (character: Character): number => {
    const maxDex = getLowestEqDexMod(character.equipment);
    const dexMod = getTotalAttributeModifier(
        character,
        AttributeNames.Dexterity
    );
    return !!maxDex && maxDex < dexMod ? maxDex : dexMod;
};
export const getLowestEqDexMod = (eq: Equipment[]): number | null => {
    const dexRestrictions = eq.filter(
        (x) =>
            !!(x as Armor).maxDexBonus &&
            (x as Armor).maxDexBonus > -1 &&
            !!(x as Armor).equipped
    );
    let mod: number | null = null;
    dexRestrictions.forEach((x) => {
        const armor = x as Armor;
        if (!mod || armor.maxDexBonus < mod) {
            mod = armor.maxDexBonus;
        }
    });
    return mod;
};

export const getMiscAcBonuses = (character: Character): Modifier[] => {
    const miscMods: Modifier[] = [];
    character.miscModifiers &&
        character.miscModifiers.forEach((mod) => {
            !!mod.defense && miscMods.push(mod);
        });
    return miscMods;
};

export const getEquipmentWithAcBonuses = (character: Character): Modifier[] => {
    const eqWithMods: Equipment[] = character.equipment.filter(
        (eq) =>
            !!(eq as Armor).equipped &&
            !!eq.modifiers?.some((mod) => !!mod.defense)
    );
    return eqWithMods
        .map((eq) => eq.modifiers.filter((mod) => !!mod.defense))
        .flat();
};

export type BonusObject = {
    [key in BonusTypes]: number;
};
 export type ModiferSourceBonusObject = {
    [key in ModifierSource]: number
 }
export const getCombatSizeBonus = (character: Character) => {
    return SizeModifiers[character.size].combatModifier;
};

export const getDefenseBonuses = (character: Character): BonusObject => {
    const miscMods = getMiscAcBonuses(character);
    const equipmentMods = getEquipmentWithAcBonuses(character);
	const statusEffectMods = [...getSlowedModifiers(character)].filter(x => !!x.defense);
    const sizeBonus = getCombatSizeBonus(character);
    const mods = [...miscMods, ...equipmentMods, ...statusEffectMods];
    const defenseBonuses: BonusObject = {
        Size: sizeBonus
    } as BonusObject;
    mods.forEach((mod) => {
        if (!mod.value && !!mod.attribute) {
            mod.value = getTotalAttributeModifier(character, mod.attribute);
        }
        if (!defenseBonuses[mod.type]) {
            defenseBonuses[mod.type] = 0;
        }
        if (!!mod.value) {
            if (stackableBonuses.some((type) => type === mod.type)) {
                defenseBonuses[mod.type] += Number(mod.value);
            } else if (mod.value > defenseBonuses[mod.type]) {
                defenseBonuses[mod.type] = mod.value;
            }
        }
    });
    return defenseBonuses;
};

export type ResistObject = {
    [key in Damage]: number;
};

export const getResistances = (character: Character): ResistObject => {
    const miscMod = character.miscModifiers.filter(
        (mod) => !!mod.resistance || mod.immunity
    );

    const resistances: ResistObject = {} as ResistObject;

    [...miscMod].forEach((mod) => {
        if (!!mod.damageType) {
            if (!resistances[mod.damageType]) {
                resistances[mod.damageType] = 0;
            }
            if (!!mod.value && mod.value > resistances[mod.damageType]) {
                resistances[mod.damageType] = mod.value;
            }
        }
    });
    return resistances;
};

export type SaveObject = {
    [key in AttributeNames]: number;
};

export const isProficientSave = (
    charClass: CharacterClass,
    save: AttributeNames
): boolean => {
    return charClass.primarySave === save || charClass.secondarySave === save;
};

export const getSaveBonus = (isProficient: boolean, level: number) => {
    return isProficient ? Math.floor((level + 4) / 2) : Math.floor(level / 3);
};

export const getSaveModifiers = (
    character: Character,
    saveName: AttributeNames
) => {
    const miscMods = character.miscModifiers.filter(
        (x) => x.save && x.attribute === saveName
    );
    const statusEffectMods = [
        ...getFearModifiers(character, undefined, saveName),
		...getSickenedModifiers(character, undefined, saveName),
        ...getEnergyDrainedModifiers(character, undefined, saveName)
    ].filter(x => x.attribute === saveName);
    return [...miscMods, ...statusEffectMods];
};

export const adjustSaveForModifiers = (
    character: Character,
    saveName: AttributeNames
) => {
	const saveMods = getSaveModifiers(character, saveName);
	return saveMods.reduce((x,y) => x + y.value, 0)
};

export const getTotalSaveBonus = (
    character: Character,
    saveName: AttributeNames
) => {
    let total = 0;
    const attributeValue = getTotalAttributeModifier(character, saveName);
    character.classes.forEach((cls) => {
        total += getSaveBonus(isProficientSave(cls, saveName), cls.level);
    });
    return total + attributeValue + adjustSaveForModifiers(character, saveName);
};
