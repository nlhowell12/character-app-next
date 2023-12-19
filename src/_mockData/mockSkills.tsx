import { AttributeNames, SkillObject, SkillTypes } from '../_models';

export const MockSkills = {
	Acrobatics: {
		name: SkillTypes.Acrobatics,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
	},
	Athletics: {
		name: SkillTypes.Athletics,
		linkedAttribute: AttributeNames.Strength,
		ranks: 0,
	},
	Bluff: {
		name: SkillTypes.Bluff,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 4,
	},
	Diplomacy: {
		name: SkillTypes.Diplomacy,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 4,
	},
	Disguise: {
		name: SkillTypes.Disguise,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 4,
	},
	Concentration: {
		name: SkillTypes.Concentration,
		linkedAttribute: AttributeNames.Constitution,
		ranks: 0,
	},
	EscapeArtist: {
		name: SkillTypes.EscapeArtist,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
	},
	Heal: {
		name: SkillTypes.Heal,
		linkedAttribute: AttributeNames.Wisdom,
		ranks: 0,
	},
	Intimidate: {
		name: SkillTypes.Intimidate,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 0,
	},
	'Knowledge: Arcana': {
		name: SkillTypes.KnowledgeArcana,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	'Knowledge: Dungeoneering': {
		name: SkillTypes.KnowledgeDungeoneering,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	'Knowledge: History': {
		name: SkillTypes.KnowledgeHistory,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	'Knowledge: Local': {
		name: SkillTypes.KnowledgeLocal,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 4,
	},
	'Knowledge: Nature': {
		name: SkillTypes.KnowledgeNature,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	'Knowledge: Nobility & Royalty': {
		name: SkillTypes.KnowledgeNobilityRoyalty,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	'Knowledge: Psionics': {
		name: SkillTypes.KnowledgePsionics,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	Magecraft: {
		name: SkillTypes.Magecraft,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	Perception: {
		name: SkillTypes.Perception,
		linkedAttribute: AttributeNames.Wisdom,
		ranks: 4,
	},
	Perform: {
		name: SkillTypes.Perform,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 0,
	},
	Ride: {
		name: SkillTypes.Ride,
		linkedAttribute: AttributeNames.Charisma,
		ranks: 0,
	},
	'Sense Motive': {
		name: SkillTypes.SenseMotive,
		linkedAttribute: AttributeNames.Wisdom,
		ranks: 4,
	},
	'Sleight of Hand': {
		name: SkillTypes.SleightOfHand,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
	},
	'Speak Language': {
		name: SkillTypes.SpeakLanguage,
		linkedAttribute: AttributeNames.Intelligence,
		ranks: 0,
	},
	Stealth: {
		name: SkillTypes.Stealth,
		linkedAttribute: AttributeNames.Dexterity,
		ranks: 4,
	},
} as SkillObject;
