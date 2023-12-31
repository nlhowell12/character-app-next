
import { Character, RankedSkill, Equipment, Armor, stackableBonuses } from '@/_models';
import { getTotalAttributeModifier } from './attributeUtils';
import { BonusObject } from './defenseUtils';

export const getTotalSkillValue = (
	character: Character,
	skill: RankedSkill
): number => {
	const attributeMod = getTotalAttributeModifier(
		character,
		skill.linkedAttribute
	);
	const armorCheckPenalty = !!skill.armorCheckPenalty
		? getArmorCheckPenalties(character.equipment)
		: 0;
	// const synergies = getSkillSynergies(skill, character);
	const miscMods = getSkillModifiers(skill, character);
	return (
		(skill.ranks || 0) + attributeMod + armorCheckPenalty + miscMods
	);
};

export const getArmorCheckPenalties = (equipment: Equipment[]): number => {
	const armorWithPenalty = equipment.filter(
		(eq) => !!(eq as Armor).equipped && !!(eq as Armor).armorCheckPenalty
	);
	return armorWithPenalty.reduce(
		(x, y) => x - Number((y as Armor).armorCheckPenalty),
		0
	);
};

// export const getSkillSynergies = (
// 	skill: RankedSkill,
// 	character: Character
// ): number => {
// 	const synergies =
// 		skill.synergies?.filter(
// 			(x) => character.skills[x.linkedSkill].ranks >= x.requiredRanks
// 		) || [];
// 	return synergies.reduce((x, y) => x + y.value, 0);
// };

export const getSkillModifiers = (
	skill: RankedSkill,
	character: Character
): number => {
	const bonuses: BonusObject = {} as BonusObject;
	character.miscModifiers.forEach((mod) => {
		if (mod.skill === skill.name) {
			if (!bonuses[mod.type]) {
				bonuses[mod.type] = 0;
			}
			if (mod.value) {
				if (stackableBonuses.includes(mod.type)) {
					bonuses[mod.type] += mod.value;
				} else if (mod.value > bonuses[mod.type]) {
					bonuses[mod.type] = mod.value;
				}
			}
		}
	});
	return Object.entries(bonuses).reduce((x, [_, value]) => x + value, 0);
};
