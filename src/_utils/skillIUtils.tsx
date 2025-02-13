
import { Character, RankedSkill, Equipment, Armor, stackableBonuses, SizeModifiers, Modifier, BonusTypes, SkillTypes } from '@/_models';
import { getTotalAttributeModifier } from './attributeUtils';
import { BonusObject } from './defenseUtils';
import { getDazzledModifiers, getEnergyDrainedModifiers, getFascinatedModifiers, getFearModifiers, getSickenedModifiers } from './statusEffectUtils';
import { getModifiersFromWornEquipment } from './equipmentUtils';

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

export const getSkillSizeBonus = (character: Character) => {
	return SizeModifiers[character.size].stealthModifier;
};

export const getModsForSkill = (
	skill: RankedSkill,
	character: Character
) => {
	const skillsAffectedBySize = [SkillTypes.Stealth];
	const skillMods = character.miscModifiers.filter(x => x.skill === skill.name || !!x.allSkills);
	const sizeBonus = getSkillSizeBonus(character);
	const equipmentBonuses = getModifiersFromWornEquipment(character).filter(x => x.skill === skill.name || x.allSkills)
	const sizeMod: Modifier[] = skillsAffectedBySize.includes(skill.name) ? [{
		value: sizeBonus,
		type: BonusTypes.Size,
		skill: SkillTypes.Stealth
	} as Modifier] : []
	const statusEffectMods = [...getDazzledModifiers(character), ...getFascinatedModifiers(character, skill.name), ...getFearModifiers(character, skill.name), ...getSickenedModifiers(character, skill.name), ...getEnergyDrainedModifiers(character, skill.name)].filter(x => x.skill === skill.name);
	return [...skillMods, ...sizeMod, ...statusEffectMods, ...equipmentBonuses]
};

export const getSkillBonusObject = (	
	skill: RankedSkill,
	character: Character
): BonusObject => {
	const bonuses: BonusObject = {} as BonusObject;
	const allMods = getModsForSkill(skill, character);
	allMods.forEach((mod) => {
		if (mod.skill === skill.name || mod.allSkills) {
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
	return bonuses
};

export const getTotalSkillMod = (
	skill: RankedSkill,
	character: Character
): number => {
	const bonuses = getSkillBonusObject(skill, character);
	return Object.entries(bonuses).reduce((x, [_, value]) => x + value, 0);
};

export const useUntrained = (skill: RankedSkill) => {
	const requiresTraining: SkillTypes[] = [
		SkillTypes.Heal,
		SkillTypes.KnowledgeArcana,
		SkillTypes.KnowledgeDungeoneering,
		SkillTypes.KnowledgeHistory, 
		SkillTypes.KnowledgeLocal,
		SkillTypes.KnowledgeNature,
		SkillTypes.KnowledgeNobilityRoyalty,
		SkillTypes.KnowledgePsionics,
		SkillTypes.Magecraft,
		SkillTypes.SleightOfHand,
		SkillTypes.SpeakLanguage
	];
	return !requiresTraining.includes(skill.name) || !!skill.ranks;
}