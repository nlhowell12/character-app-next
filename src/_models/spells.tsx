import { CharacterClassNames, SkillTypes } from './character';

export enum Descriptors {
	Shadow = 'Shadow',
	Darkness = 'Darkness',
	Light = 'Light',
	MindAffecting = 'Mind Affecting',
	Compulsion = 'Compulsion',
	Teleportation = 'Teleportation',
	Summoning = 'Summoning',
	Vitae = 'Vitae',
	Creation = 'Creation',
	Thaumaturgic = 'Thaumaturgic',
	Polymorphic = 'Polymorphic',
	Healing = 'Healing',
	Jinx = 'Jinx',
	Cold = 'Cold',
	Fire = 'Fire',
	Electricity = 'Electricity',
	Acid = 'Acid',
	Sonic = 'Sonic',
	Air = 'Air',
	Water = 'Water',
	Death = 'Death',
	Glamer = 'Glamer',
	Fear = 'Fear',
	Ward = 'Ward',
	Force = 'Force',
}

export enum ArcaneSchool {
	Evocation = 'Evocation',
	Transmutation = 'Transmutation',
	Illusion = 'Illusion',
	Enchantment = 'Enchantment',
	Necromancy = 'Necromancy',
	Abjuration = 'Abjuration',
	Conjuration = 'Conjuration',
	Divination = 'Divination',
}

export enum PsionicDiscipline {
	Psychometabolism = 'Psychometabolism',
	Psychoportation = 'Psychoportation',
	Psychokinesis = 'Psychokinesis',
	Metacreativity = 'Metacreativity',
	Telepathy = 'Telepathy',
	Clairsentience = 'Clairsentience',
}

export enum DivineDomain {
	Air = 'Air',
	Death = 'Death',
	Deception = 'Deception',
	Earth = 'Earth',
	Fire = 'Fire',
	Life = 'Life',
	Magic = 'Magic',
	Mind = 'Mind',
	Peace = 'Peace',
	Truth = 'Truth',
	War = 'War',
	Water = 'Water',
	Cosmic = 'Cosmic',
}

export enum ShadowPath {
	UmbralMind = 'Umbral Mind',
	ShadowCalling = 'Shadow Calling',
	ElementalShadows = 'Elemental Shadows',
	EyesOfTheNightSky = 'Eyes of the Night Sky',
	DarkTerrain = 'Dark Terrain',
	BreathOfTwilight = 'Breath of Twilight',
	BodyAndSoul = 'Body and Soul',
	HeartAndSoul = 'Heart and Soul',
	TouchOfTwilight = 'Touch of Twilight',
	ShuttersAndClouds = 'Shutters and Clouds',
	EbonWhispers = 'Ebon Whispers',
	EbonWalls = 'Ebon Walls',
	VeilOfShadows = 'Veil of Shadows',
	BlackMagic = 'Black Magic',
	DarkMetamorphosis = 'Dark Metamorphosis',
	UnbindingShade = 'Unbinding Shade',
	DarkReflections = 'Dark Reflections',
	DarkShadows = 'Dark Shadows',
	EyesOfDarkness = 'Eyes of Darkness',
	CloakOfShadows = 'Cloak of Shadows',
	EbonRoads = 'Ebon Roads',
}

export enum ShadowMastery {
	Apprentice = 'Apprentice',
	Initiate = 'Initiate',
	Master = 'Master',
}

export enum MagickCategory {
	Arcane = 'Arcane',
	Divine = 'Divine',
	Psionic = 'Psionic',
	Shadow = 'Shadow',
	Maneuver = 'Maneuver',
}

export interface Magick {
	name: string;
	range: string;
	duration: string;
	description: string;
	descriptors?: string;
	category: MagickCategory;
	class: CharacterClassNames;
	level: number;
	damageType?: string;
	savingThrow?: string;
	action: string;
	bonusType?: string;
	prepared?: boolean;
}
export interface SpellObject {
	[CharacterClassNames.Cleric]: Prayer[];
	[CharacterClassNames.Hexblade]: (Spell | Maneuver)[];
	[CharacterClassNames.Oathsworn]: (Prayer | Maneuver)[];
	[CharacterClassNames.Fighter]: Maneuver[];
	[CharacterClassNames.PsychicWarrior]: (Power | Maneuver)[];
	[CharacterClassNames.Psion]: Power[];
	[CharacterClassNames.Shadowcaster]: Mystery[];
	[CharacterClassNames.SorcWiz]: Spell[];
}

export interface Spell extends Magick {
	school: ArcaneSchool;
}

export interface Power extends Magick {
	discipline: PsionicDiscipline;
}

export interface DisciplinePower extends Power {
	attribute: string;
	disciple: string;
}

export interface Prayer extends Magick {
	domain: DivineDomain;
}

export interface Mystery extends Magick {
	path: ShadowPath;
	mastery: ShadowMastery;
}

export interface Maneuver {
	level: number;
	name: string;
	maneuverType: string;
	action: string;
	description: string;
	category: MagickCategory;
	class: CharacterClassNames;
	skill: SkillTypes;
	school: string;
	weapon: string;
}

export type AnyMagickType = Magick | Prayer | Spell | Maneuver | Power | Mystery;
