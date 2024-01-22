
import { Character, RankedSkill, Equipment, Armor, stackableBonuses } from '@/_models';
import { getTotalAttributeModifier } from './attributeUtils';
import { BonusObject } from './defenseUtils';
import { getDazzledModifiers, getEnergyDrainedModifiers, getFascinatedModifiers, getFearModifiers, getSickenedModifiers } from './statusEffectUtils';

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
	const miscMods = getTotalSkillMod(skill, character);
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

export const getTotalSkillMod = (
	skill: RankedSkill,
	character: Character
): number => {
	const bonuses: BonusObject = {} as BonusObject;
	const charMods = character.miscModifiers;
	const statusEffectMods = [...getDazzledModifiers(character), ...getFascinatedModifiers(character, skill.name), ...getFearModifiers(character, skill.name), ...getSickenedModifiers(character, skill.name), ...getEnergyDrainedModifiers(character, skill.name)]
	const allMods = [...charMods, ...statusEffectMods];
	allMods.forEach((mod) => {
		if (mod.skill === skill.name && !mod.damage) {
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
