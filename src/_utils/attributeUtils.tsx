import { AttributeNames, Character, Modifier, ModifierSource } from "@/_models";

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
	const miscAttributeMods: Modifier[] =
		character.miscModifiers.filter((mod) => mod.attribute === attributeName && mod.definition !== ModifierSource.attributeScoreIncrease);
	return miscAttributeMods;
};

export const getBaseAttributeScore = (
	character: Character,
	attributeName: keyof typeof AttributeNames
): number => {
	const base = character.attributes[attributeName].value;
	const ASIIncreaseModifiers = character.miscModifiers.filter(
				(mod) =>
					mod.definition === ModifierSource.attributeScoreIncrease &&
					mod.attribute === attributeName
					)
	const totalASI = Object.entries(ASIIncreaseModifiers).reduce(
		(total, modifier) => {
			const [_, value] = modifier;
			return total + (!!value.value ? value.value : 0);
		},
		0
	);
	return base + totalASI;
};

export const totalAttributeValue = (
	character: Character,
	attributeName: AttributeNames
): number => {
	let total: number = getBaseAttributeScore(character, attributeName);
	getAllAttributeModifiers(character, attributeName).forEach((mod) => {
		total += mod.value;
	});
	return total;
};

export const getTotalAttributeModifier = (
	character: Character,
	attributeName: AttributeNames
) => {
	return getAttributeModifier(totalAttributeValue(character, attributeName));
};
