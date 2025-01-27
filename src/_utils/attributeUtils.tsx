import { AttributeNames,BonusTypes,Character, Modifier, ModifierSource, StatusEffects } from "@/_models";
import { getEntangledModifiers, getExhaustedModifiers, getFatiguedModifiers } from "./statusEffectUtils";

export const getAttributeModifier = (score: number): number => {
	return Math.floor((score - 10) / 2);
};

export const getAttributeBonuses = (
	attributeName: keyof typeof AttributeNames,
	modifiers: Modifier[]
): Modifier[] => {
	return modifiers.filter((mod) => mod.attribute === attributeName)
};

export const getModifierAttributeBonus = (character: Character, mod: Modifier) => {
    return !mod.value && !!mod.attribute ? getTotalAttributeModifier(character, mod.attribute): 0
};

export const getAllAttributeModifiers = (
	character: Character,
	attributeName: AttributeNames
): Modifier[] => {
	const exhausted = getExhaustedModifiers(character);
	const entangled: Modifier[] = getEntangledModifiers(character);
	const fatigue = getFatiguedModifiers(character);
	const racialModifier: Modifier = {
		value: character.attributes[attributeName].racialBonus || 0,
		type: BonusTypes.Racial,
		attribute: attributeName
	} as Modifier;
	const miscAttributeMods: Modifier[] =
		[...character.miscModifiers, ...exhausted, ...entangled, ...fatigue, racialModifier].filter((mod) => mod.attribute === attributeName && !mod.damage);
	
	return miscAttributeMods;
};

export const getBaseAttributeScore = (
	character: Character,
	attributeName: keyof typeof AttributeNames
): number => {
	const base = character.attributes[attributeName].value;
	return base;
};

export const totalAttributeValue = (
	character: Character,
	attributeName: AttributeNames
): number => {
	let total: number = getBaseAttributeScore(character, attributeName);
	getAllAttributeModifiers(character, attributeName).forEach((mod) => {
		total += mod.value;
	});
	const isParalyzed = character.statusEffects.includes(StatusEffects.Paralyzed) && (attributeName === AttributeNames.Strength || attributeName === AttributeNames.Dexterity);
	const isHelpless = character.statusEffects.includes(StatusEffects.Helpless) && attributeName === AttributeNames.Dexterity;
	return (isParalyzed || isHelpless) ? 0 : total;
};

export const getTotalAttributeModifier = (
	character: Character,
	attributeName: AttributeNames
) => {
	return getAttributeModifier(totalAttributeValue(character, attributeName));
};
