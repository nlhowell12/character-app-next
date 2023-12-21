
import { Armor, AttributeNames, BonusTypes, Character, CharacterClass, Damage, Equipment, Modifier, stackableBonuses } from '@/_models';
import { getTotalAttributeModifier } from './attributeUtils';

export interface DefenseObject {
	dsBonus: number;
	drBonus: number;
}

export const getTotalDefense = (character: Character): DefenseObject => {
	const drBonusTypes = [
		BonusTypes.Armor,
		BonusTypes.Shield,
		BonusTypes.Racial,
	];
	const dexMod = getTotalAttributeModifier(character, AttributeNames.Dexterity);
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

	return { dsBonus: 10 + dexMod + totalDSBonuses, drBonus: totalDRBonuses };
};

export const getMiscAcBonuses = (character: Character): Modifier[] => {
	const miscMods: Modifier[] = [];
	character.miscModifiers &&
		character.miscModifiers.forEach((mod) => {
			!!mod.defense && miscMods.push(mod);
		});
	return miscMods;
};

export const getEquipmentAcBonuses = (character: Character): Modifier[] => {
	const eqWithMods: Equipment[] = character.equipment.filter(
		(eq) =>
			!!(eq as Armor).equipped && !!eq.modifiers?.some((mod) => !!mod.defense)
	);
	return eqWithMods
		.map((eq) => eq.modifiers.filter((mod) => !!mod.defense))
		.flat();
};

export type BonusObject = {
	[key in BonusTypes]: number;
};

export const getDefenseBonuses = (character: Character): BonusObject => {
	const miscMods = getMiscAcBonuses(character);
	const equipmentMods = getEquipmentAcBonuses(character);
	const mods = [...miscMods, ...equipmentMods];
	const defenseBonuses: BonusObject = {} as BonusObject;
	mods.forEach((mod) => {
		if (!mod.value && !!mod.attribute) {
			mod.value = getTotalAttributeModifier(character, mod.attribute);
		}
		if (!defenseBonuses[mod.type]) {
			defenseBonuses[mod.type] = 0;
		}
		if (!!mod.value) {
			if (stackableBonuses.some((type) => type === mod.type)) {
				defenseBonuses[mod.type] += mod.value;
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

export const getTotalSaveBonus = (
	character: Character,
	saveName: AttributeNames
) => {
	let total = 0;
	const attributeValue = getTotalAttributeModifier(character, saveName);
	character.classes.forEach((cls) => {
		total += getSaveBonus(isProficientSave(cls, saveName), cls.level);
	});
	return total + attributeValue;
};
