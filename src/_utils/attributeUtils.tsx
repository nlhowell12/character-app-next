import { AttributeNames, Character, Modifier, ModifierSource } from "@/_models";

export const getAttributeModifier = (score: number): number => {
	return Math.floor((score - 10) / 2);
};

export const getAttributeBonuses = (
	attributeName: keyof typeof AttributeNames,
	modifiers: Modifier[]
): Modifier[] => {
	return !!modifiers
		? modifiers.filter((mod) => mod.attribute === attributeName)
		: [];
};

export const getAllAttributeModifiers = (
	character: Character,
	attributeName: AttributeNames
): Modifier[] => {
	const miscAttributeMods: Modifier[] =
		character.miscModifiers?.filter((mod) => mod.attribute === attributeName) ||
		[];
	const attributeModifiers =
		character.attributes[attributeName].modifiers || [];
	return [...miscAttributeMods, ...attributeModifiers];
};

export const getBaseAttributeScore = (
	character: Character,
	attributeName: keyof typeof AttributeNames
): number => {
	const base = character.attributes[attributeName].value;
	const ASIIncreaseModifiers = character.miscModifiers
		? character.miscModifiers.filter(
				(mod) =>
					mod.definition === ModifierSource.attributeScoreIncrease &&
					mod.attribute === attributeName
		  )
		: 0;
	const totalASI = Object.entries(ASIIncreaseModifiers).reduce(
		(total, modifier) => {
			// eslint-disable-next-line
			const [_, value] = modifier;
			return total + value.value;
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
		!!mod.value && (total += mod.value);
	});
	return total;
};

export const getTotalAttributeModifier = (
	character: Character,
	attributeName: AttributeNames
) => {
	return getAttributeModifier(totalAttributeValue(character, attributeName));
};
