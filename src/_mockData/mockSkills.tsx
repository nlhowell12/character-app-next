import { AttributeNames, RankedSkill, SkillTypes } from '../_models';

export const MockSkills: {[key in SkillTypes]: RankedSkill} = {
	[SkillTypes.Acrobatics]: {
		name: SkillTypes.Acrobatics,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
		armorCheckPenalty: true
	},
	[SkillTypes.Athletics]: {
		name: SkillTypes.Athletics,
		linkedAttribute: AttributeNames.Strength,
		ranks: 0,
	},
	[SkillTypes.Bluff]: {
		name: SkillTypes.Bluff,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 4,
	},
	[SkillTypes.Diplomacy]: {
		name: SkillTypes.Diplomacy,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 4,
	},
	[SkillTypes.Disguise]: {
		name: SkillTypes.Disguise,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 4,
	},
	[SkillTypes.Concentration]: {
		name: SkillTypes.Concentration,
		linkedAttribute: AttributeNames.Constitution,
		ranks: 0,
	},
	[SkillTypes.EscapeArtist]: {
		name: SkillTypes.EscapeArtist,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
	},
	[SkillTypes.Heal]: {
		name: SkillTypes.Heal,
		linkedAttribute: AttributeNames.Wisdom,
		ranks: 0,
	},
	[SkillTypes.Intimidate]: {
		name: SkillTypes.Intimidate,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 0,
	},
	[SkillTypes.KnowledgeArcana]: {
		name: SkillTypes.KnowledgeArcana,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.KnowledgeDungeoneering]: {
		name: SkillTypes.KnowledgeDungeoneering,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.KnowledgeHistory]: {
		name: SkillTypes.KnowledgeHistory,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.KnowledgeLocal]: {
		name: SkillTypes.KnowledgeLocal,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 4,
	},
	[SkillTypes.KnowledgeNature]: {
		name: SkillTypes.KnowledgeNature,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.KnowledgeNobilityRoyalty]: {
		name: SkillTypes.KnowledgeNobilityRoyalty,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.KnowledgePsionics]: {
		name: SkillTypes.KnowledgePsionics,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.Magecraft]: {
		name: SkillTypes.Magecraft,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.Perception]: {
		name: SkillTypes.Perception,
		linkedAttribute: AttributeNames.Wisdom,
		ranks: 4,
	},
	[SkillTypes.Perform]: {
		name: SkillTypes.Perform,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 0,
	},
	[SkillTypes.Ride]: {
		name: SkillTypes.Ride,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 0,
	},
	[SkillTypes.SenseMotive]: {
		name: SkillTypes.SenseMotive,
		linkedAttribute: AttributeNames.Wisdom,
		ranks: 4,
	},
	[SkillTypes.SleightOfHand]: {
		name: SkillTypes.SleightOfHand,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
	},
	[SkillTypes.SpeakLanguage]: {
		name: SkillTypes.SpeakLanguage,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	[SkillTypes.Stealth]: {
		name: SkillTypes.Stealth,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
	},
};
